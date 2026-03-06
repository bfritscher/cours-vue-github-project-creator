import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";

import type {
  AddToProjectMutationResponse,
  AddToProjectParams,
  CheckProjectMembershipQueryResponse,
  CopyProjectMutationResponse,
  CreateIssueMutationResponse,
  CreateIssueParams,
  CreateLabelMutationResponse,
  CreateLabelParams,
  GetLabelQueryResponse,
  GetProjectByIdQueryResponse,
  GetProjectIdParams,
  GetProjectQueryResponse,
  GetRepositoryIdQueryResponse,
  LinkProjectToRepositoryMutationResponse,
  OrganizationProjectsQueryResponse,
  ProjectInfo,
  ProjectNode,
  SearchIssueQueryResponse,
  UpdateIssueMutationResponse,
  UpdateProjectCollaboratorsMutationResponse,
  UserProjectsQueryResponse,
} from "./types";

import { logError, logInfo, logWarn } from "../logger";
import {
  ADD_LABELS_TO_LABELABLE_MUTATION,
  ADD_TO_PROJECT_MUTATION,
  COPY_PROJECT_MUTATION,
  CREATE_ISSUE_MUTATION,
  CREATE_LABEL_MUTATION,
  LINK_ISSUES_MUTATION,
  LINK_PROJECT_TO_REPOSITORY_MUTATION,
  REMOVE_SUB_ISSUE_MUTATION,
  UPDATE_ISSUE_MUTATION,
  UPDATE_ITEM_STATUS_MUTATION,
  UPDATE_PROJECT_COLLABORATORS_MUTATION,
} from "./mutations";
import {
  CHECK_PROJECT_MEMBERSHIP_QUERY,
  GET_LABEL_QUERY,
  GET_ORGANIZATION_TEMPLATE_PROJECT_QUERY,
  GET_PROJECT_BY_ID_QUERY,
  GET_PROJECT_QUERY,
  GET_REPO_ID_QUERY,
  GET_USER_TEMPLATE_PROJECT_QUERY,
  SEARCH_ISSUE_QUERY,
} from "./queries";

const randomIssueLabelColors: string[] = [
  "0E8A16", // green
  "D73A4A", // red
  "0366D6", // blue
  "F9C513", // yellow
  "6A737D", // gray
  "B39DDB", // purple
  "E69F66", // orange
  "E0E0E0", // light gray
];

let colors = randomIssueLabelColors.slice();
function getNextRandomColor(): string {
  if (colors.length === 0) {
    colors = randomIssueLabelColors.slice();
  }
  return colors.shift()!;
}

let graphqlClient: typeof graphql | null = null;
let restClient: Octokit | null = null;

const projectItemsCache = new Map<string, Set<string>>();

export function initClient(token: string) {
  graphqlClient = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
  restClient = new Octokit({ auth: token });
}

export async function getRepositoryId({
  owner,
  repo,
}: GetProjectIdParams): Promise<string> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  const repoResponse = (await graphqlClient(GET_REPO_ID_QUERY, {
    owner,
    repo,
  })) as GetRepositoryIdQueryResponse;

  return repoResponse.repository.id;
}

export async function getProjectInfo({
  owner,
  repo,
}: GetProjectIdParams): Promise<ProjectInfo | undefined> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }
  try {
    const response = (await graphqlClient(GET_PROJECT_QUERY, {
      owner,
      repo,
    })) as GetProjectQueryResponse;

    const project = response.repository.projectsV2.nodes[0];
    if (!project) {
      return undefined;
    }

    return getValidatedProjectInfo(project);
  }
  catch (error) {
    if (error instanceof Error) {
      logError(error);
      throw new TypeError(
        `Failed to get project information: ${error.message}`,
      );
    }
    throw error;
  }
}

export async function ensureProjectFromTemplate({
  owner,
  repo,
  repositoryId,
  templateProjectName,
}: GetProjectIdParams & {
  repositoryId: string;
  templateProjectName: string;
}): Promise<ProjectInfo> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  const ownerNode = await getTemplateProjectOwner(owner, templateProjectName);
  if (!ownerNode) {
    throw new Error(`Could not resolve owner "${owner}" to a GitHub user or organization`);
  }

  const templateProject = ownerNode.projectsV2.nodes.find(
    project => project.title === templateProjectName,
  );
  if (!templateProject) {
    throw new Error(
      `No project named "${templateProjectName}" was found under owner "${owner}"`,
    );
  }

  logInfo(
    `No linked project found for ${owner}/${repo}. Copying template project "${templateProjectName}"`,
  );

  const copyResponse = (await graphqlClient(COPY_PROJECT_MUTATION, {
    ownerId: ownerNode.id,
    projectId: templateProject.id,
    title: repo,
  })) as CopyProjectMutationResponse;

  const copiedProject = copyResponse.copyProjectV2.projectV2;
  logInfo(
    `Copied template project to "${copiedProject.title}" (number: ${copiedProject.number})`,
  );

  await graphqlClient(LINK_PROJECT_TO_REPOSITORY_MUTATION, {
    projectId: copiedProject.id,
    repositoryId,
  }) as LinkProjectToRepositoryMutationResponse;

  await syncDirectRepoCollaboratorsToProject({
    owner,
    repo,
    projectId: copiedProject.id,
  });

  projectItemsCache.delete(copiedProject.id);

  return await getProjectInfoById(copiedProject.id);
}

async function getTemplateProjectOwner(owner: string, templateProjectName: string): Promise<{
  id: string;
  projectsV2: {
    nodes: Array<{
      id: string;
      title: string;
      number: number;
    }>;
  };
} | null> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  const organizationResponse = (await graphqlClient(GET_ORGANIZATION_TEMPLATE_PROJECT_QUERY, {
    owner,
    projectName: templateProjectName,
  })) as OrganizationProjectsQueryResponse;

  if (organizationResponse.organization) {
    return organizationResponse.organization;
  }

  const userResponse = (await graphqlClient(GET_USER_TEMPLATE_PROJECT_QUERY, {
    owner,
    projectName: templateProjectName,
  })) as UserProjectsQueryResponse;

  return userResponse.user;
}

async function syncDirectRepoCollaboratorsToProject({
  owner,
  repo,
  projectId,
}: GetProjectIdParams & {
  projectId: string;
}): Promise<void> {
  if (!graphqlClient || !restClient) {
    throw new Error("GitHub clients not initialized");
  }

  const collaborators = await restClient.paginate(restClient.rest.repos.listCollaborators, {
    owner,
    repo,
    affiliation: "direct",
    per_page: 100,
  });

  const projectCollaborators = collaborators
    .filter(collaborator => collaborator.type === "User")
    .map((collaborator) => {
      const role = collaborator.permissions?.admin
        ? "ADMIN"
        : collaborator.permissions?.pull && !collaborator.permissions?.push && !collaborator.permissions?.maintain
          ? "READER"
          : "WRITER";

      return {
        userId: collaborator.node_id,
        role,
      };
    });

  if (projectCollaborators.length === 0) {
    logInfo(`No direct repository collaborators found for ${owner}/${repo}`);
    return;
  }

  await graphqlClient(UPDATE_PROJECT_COLLABORATORS_MUTATION, {
    projectId,
    collaborators: projectCollaborators,
  }) as UpdateProjectCollaboratorsMutationResponse;

  logInfo(
    `Granted project access to ${projectCollaborators.length} direct repository collaborator(s)`,
  );
}

async function getProjectInfoById(projectId: string): Promise<ProjectInfo> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  const response = (await graphqlClient(GET_PROJECT_BY_ID_QUERY, {
    projectId,
  })) as GetProjectByIdQueryResponse;

  if (!response.node) {
    throw new Error(`Project ${projectId} could not be loaded after creation`);
  }

  return getValidatedProjectInfo(response.node);
}

function getValidatedProjectInfo(project: ProjectNode): ProjectInfo {
  const layout = project.views.nodes[0]?.layout;
  logInfo(
    `Found project: ${project.title} (number: ${project.number}, layout: ${layout})`,
  );

  if (layout !== "BOARD_LAYOUT") {
    throw new Error(
      `Project "${project.title}" is not a board view project. It is currently in ${layout} view.
To fix this:
1. Go to the project settings
2. Click "Layout"
3. Select "Board" view
4. Add a "Backlog" column`,
    );
  }

  const statusField = project.fields.nodes.find(
    field => field.name === "Status",
  );
  if (!statusField) {
    throw new Error(
      `No Status field found in project "${project.title}".
Please add a "Status" field to your project.`,
    );
  }

  const backlogOption = statusField.options?.find(
    option => option.name === "Backlog",
  );
  if (!backlogOption) {
    throw new Error(
      `No "Backlog" option found in Status field. Available options: ${statusField.options
        ?.map(option => option.name)
        .join(", ")}.
Please add a "Backlog" option to your Status field.`,
    );
  }

  return {
    projectId: project.id,
    projectNumber: project.number,
    fieldId: statusField.id,
    optionId: backlogOption.id,
  };
}

export async function createLabelIfNotExists({
  label,
  repositoryId,
}: CreateLabelParams) {
  try {
    if (!graphqlClient) {
      throw new Error("GraphQL client not initialized");
    }

    const labelResponse = (await graphqlClient(GET_LABEL_QUERY, {
      repoId: repositoryId,
      name: label.name,
    })) as GetLabelQueryResponse;

    if (labelResponse.node.label) {
      logInfo(`Label "${label.name}" already exists`);
      return labelResponse.node.label;
    }

    const color = label.color || getNextRandomColor();

    logInfo("Creating label:", {
      name: label.name,
    });

    const createLabelResponse = (await graphqlClient(CREATE_LABEL_MUTATION, {
      repoId: repositoryId,
      name: label.name,
      color,
      description: label.description || "",
    })) as CreateLabelMutationResponse;

    return createLabelResponse.createLabel.label;
  }
  catch (error) {
    if (error instanceof Error) {
      logError(error);
      throw new TypeError(
        `Failed to create label "${label.name}": ${error.message}`,
      );
    }
    throw error;
  }
}

export async function createIssue({
  issue,
  labelId,
  repositoryId,
  owner,
  repo,
}: CreateIssueParams) {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  // Replace placeholders in issue body with actual values
  const processedBody = issue.body
    .replace(/<<GITHUB_OWNER>>/g, owner)
    .replace(/<<GITHUB_REPO>>/g, repo);

  const searchQuery = `repo:${owner}/${repo} is:issue in:title "${issue.title.trim()}"`;
  const searchResponse = (await graphqlClient(SEARCH_ISSUE_QUERY, {
    searchQuery,
  })) as SearchIssueQueryResponse;

  const existingIssues = searchResponse.search.nodes;
  if (existingIssues.length > 0) {
    const existingIssue = existingIssues[0];
    logInfo(
      `Found existing issue #${existingIssue.number} with title "${existingIssue.title}"`,
    );

    // Update the issue body if it's different
    if (existingIssue.body !== processedBody) {
      logInfo(`Updating body for existing issue #${existingIssue.number}`);
      const updateResponse = (await graphqlClient(UPDATE_ISSUE_MUTATION, {
        issueId: existingIssue.id,
        body: processedBody,
      })) as UpdateIssueMutationResponse;
      logInfo(`Updated issue #${updateResponse.updateIssue.issue.number} body`);
    }

    const hasLabel = existingIssue.labels.nodes.some(
      label => label.id === labelId,
    );
    if (!hasLabel) {
      logInfo(`Adding label to existing issue #${existingIssue.number}`);
      await graphqlClient(ADD_LABELS_TO_LABELABLE_MUTATION, {
        labelableId: existingIssue.id,
        labelIds: [labelId],
      });
    }

    if (issue.parentIssueId) {
      logInfo(`Checking parent issue link for #${existingIssue.number}`);
      const currentParentId = existingIssue.parent?.id;

      if (currentParentId !== issue.parentIssueId) {
        // If the issue has a different parent, remove the old relationship first
        if (currentParentId) {
          logInfo(
            `Removing existing parent relationship for issue ${existingIssue.number} from parent ${currentParentId}`,
          );
          try {
            await graphqlClient(REMOVE_SUB_ISSUE_MUTATION, {
              issueId: existingIssue.id,
              parentId: currentParentId,
            });
            logInfo(
              `Removed existing parent relationship for issue ${existingIssue.number}`,
            );
          }
          catch (error) {
            logWarn(
              `Failed to remove existing parent relationship: ${error}`,
            );
            // Continue to try adding the new parent
          }
        }

        logInfo(
          `Linking existing issue ${existingIssue.number} to parent issue ${issue.parentIssueId}`,
        );
        await graphqlClient(LINK_ISSUES_MUTATION, {
          issueId: existingIssue.id,
          parentId: issue.parentIssueId,
        });
        logInfo(
          `Linked existing issue ${existingIssue.number} to parent issue ${issue.parentIssueId}`,
        );
      }
      else {
        logInfo(
          `Issue #${existingIssue.number} is already linked to parent issue ${issue.parentIssueId}`,
        );
      }
    }

    return existingIssue.id;
  }

  logInfo("Creating new issue:", {
    title: issue.title,
    parentIssueId: issue.parentIssueId,
  });

  const createResponse = (await graphqlClient(CREATE_ISSUE_MUTATION, {
    repoId: repositoryId,
    title: issue.title.trim(),
    body: processedBody,
    labelIds: [labelId],
  })) as CreateIssueMutationResponse;

  const newIssueId = createResponse.createIssue.issue.id;
  const newIssueNumber = createResponse.createIssue.issue.number;
  logInfo(`Created issue #${newIssueNumber} with ID: ${newIssueId}`);

  if (issue.parentIssueId) {
    await graphqlClient(LINK_ISSUES_MUTATION, {
      issueId: newIssueId,
      parentId: issue.parentIssueId,
    });
    logInfo(
      `Linked issue ${newIssueNumber} to parent issue ${issue.parentIssueId}`,
    );
  }

  return newIssueId;
}

async function getProjectItems(projectId: string): Promise<Set<string>> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }

  const cachedItems = projectItemsCache.get(projectId);
  if (cachedItems) {
    return cachedItems;
  }

  const membershipResponse = (await graphqlClient(
    CHECK_PROJECT_MEMBERSHIP_QUERY,
    {
      projectId,
    },
  )) as CheckProjectMembershipQueryResponse;

  const items = new Set(
    membershipResponse.node.items.nodes
      .map(item => item.content?.id)
      .filter((id): id is string => id !== undefined),
  );

  projectItemsCache.set(projectId, items);
  return items;
}

export async function addToProject({
  issueId,
  projectInfo,
}: AddToProjectParams): Promise<void> {
  if (!graphqlClient) {
    throw new Error("GraphQL client not initialized");
  }
  try {
    const projectItems = await getProjectItems(projectInfo.projectId);

    if (projectItems.has(issueId)) {
      logInfo(`Issue ${issueId} is already in the project`);
      return;
    }

    logInfo(`Adding issue ${issueId} to project`);
    const addResponse = (await graphqlClient(ADD_TO_PROJECT_MUTATION, {
      projectId: projectInfo.projectId,
      contentId: issueId,
    })) as AddToProjectMutationResponse;

    projectItems.add(issueId);

    await graphqlClient(UPDATE_ITEM_STATUS_MUTATION, {
      projectId: projectInfo.projectId,
      itemId: addResponse.addProjectV2ItemById.item.id,
      fieldId: projectInfo.fieldId,
      optionId: projectInfo.optionId,
    });

    logInfo(`Added issue ${issueId} to project and set status to Backlog`);
  }
  catch (error) {
    if (error instanceof Error) {
      logError(error);
      throw new TypeError(`Failed to add issue to project: ${error.message}`);
    }
    throw error;
  }
}

export async function createIssueAddToProject({
  issue,
  labelId,
  projectInfo,
  repositoryId,
  owner,
  repo,
}: CreateIssueParams): Promise<string> {
  const issueId = await createIssue({
    issue,
    projectInfo,
    repositoryId,
    labelId,
    owner,
    repo,
  });
  await addToProject({ issueId, projectInfo });
  return issueId;
}
