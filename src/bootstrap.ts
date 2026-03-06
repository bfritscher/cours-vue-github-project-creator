import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Logger } from "./logger";
import type { MDStory } from "./types";

import {
  createIssue,
  createIssueAddToProject,
  createLabelIfNotExists,
  ensureProjectFromTemplate,
  getProjectInfo,
  getRepositoryId,
  initClient,
} from "./github/client";
import { logInfo, withLogger } from "./logger";
import { getMDStory } from "./parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const epicsDir = join(__dirname, "../data/epics");
const storiesDir = join(__dirname, "../data/stories");
const priorityPath = join(__dirname, "../data/priority.json");

type MDStoryWithEpic = MDStory & {
  title: string;
  priority: number;
  epic: {
    labelId: string;
    issueId: string;
  };
};

export type BootstrapProgress = {
  completedSteps: number;
  totalSteps: number;
  percent: number;
  message: string;
};

export type BootstrapRunOptions = {
  owner: string;
  repo: string;
  token: string;
  projectTemplateName?: string;
  logger?: Logger;
  onProgress?: (progress: BootstrapProgress) => void;
};

export type BootstrapRunResult = {
  owner: string;
  repo: string;
  labelCount: number;
  epicCount: number;
  storyCount: number;
  totalSteps: number;
};

function getStoryFiles(dirPath: string): string[] {
  return readdirSync(dirPath).filter(file => file.endsWith(".md"));
}

export async function runBootstrap({
  owner,
  repo,
  token,
  projectTemplateName = "LIA_TEMPLATE",
  logger,
  onProgress,
}: BootstrapRunOptions): Promise<BootstrapRunResult> {
  const epicFiles = getStoryFiles(epicsDir);
  const storyFiles = getStoryFiles(storiesDir);
  const epics: Record<string, {
    epic: MDStory & { stories: MDStory[] };
    issueId: string;
  }> = {};

  epicFiles.forEach((file) => {
    const content = readFileSync(join(epicsDir, file), "utf-8");
    const { frontmatter, description } = getMDStory(content);
    const epicNumber = file.match(/^(\d+)-/)?.[1];

    if (!epicNumber) {
      throw new Error(`Unable to derive epic number from ${file}`);
    }

    epics[epicNumber] = {
      epic: {
        frontmatter,
        description,
        stories: [],
      },
      issueId: "",
    };
  });

  const labels = [...new Set([...Object.values(epics).map(epic => epic.epic.frontmatter.label), "Epic"])]
    .filter((label): label is string => Boolean(label));

  const totalSteps = 2 + labels.length + Object.keys(epics).length + storyFiles.length;
  let completedSteps = 0;

  function emitProgress(message: string) {
    onProgress?.({
      completedSteps,
      totalSteps,
      percent: totalSteps === 0 ? 100 : Math.round((completedSteps / totalSteps) * 100),
      message,
    });
  }

  function advance(message: string) {
    completedSteps += 1;
    emitProgress(message);
  }

  emitProgress(`Preparing bootstrap for ${owner}/${repo}`);

  return await withLogger(logger ?? {
    info: message => console.log(message),
    warn: message => console.warn(message),
    error: message => console.error(message),
  }, async () => {
    logInfo(`Bootstrapping ${owner}/${repo}`);

    initClient(token);

    const repositoryId = await getRepositoryId({ owner, repo });
    advance(`Connected to ${owner}/${repo}`);

    const existingProjectInfo = await getProjectInfo({ owner, repo });
    const projectInfo = existingProjectInfo
      ?? await ensureProjectFromTemplate({
        owner,
        repo,
        repositoryId,
        templateProjectName: projectTemplateName,
      });
    advance(existingProjectInfo ? "Found linked project" : "Created linked project from template");

    const labelsByName = new Map<string, string>();
    for (const label of labels) {
      const labelInfo = await createLabelIfNotExists({
        repositoryId,
        label: { name: label },
      });
      labelsByName.set(label, labelInfo.id);
      advance(`Ensured label ${label}`);
    }

    for (const [epicNumber, epicStory] of Object.entries(epics)) {
      const labelId = labelsByName.get("Epic");

      if (!labelId) {
        throw new Error("Label \"Epic\" not found");
      }

      const issueId = await createIssue({
        repositoryId,
        projectInfo,
        owner,
        repo,
        issue: {
          title: epicStory.epic.frontmatter.title!,
          body: epicStory.epic.description,
        },
        labelId,
      });

      epicStory.issueId = issueId;
      advance(`Ensured epic ${epicNumber}`);
    }

    const priorityOrder = JSON.parse(readFileSync(priorityPath, "utf-8")) as string[];
    const storiesWithEpic: MDStoryWithEpic[] = storyFiles.map((file) => {
      const content = readFileSync(join(storiesDir, file), "utf-8");
      const { frontmatter, description } = getMDStory(content);
      const [epicNumber, storyNumber] = file.split("-").slice(0, 2);

      const storyId = `${epicNumber}-${storyNumber}`;
      const priorityIndex = priorityOrder.indexOf(storyId);

      if (priorityIndex === -1) {
        throw new Error(`Story ${file} not found in priority order`);
      }

      const title = frontmatter.role
        ? `As a ${frontmatter.role}, I want to ${frontmatter.action}`
        : frontmatter.title;

      if (!title) {
        throw new Error(`Title not set for ${file}`);
      }

      return {
        title,
        frontmatter,
        description,
        priority: priorityIndex + 1,
        epic: {
          labelId: labelsByName.get(frontmatter.label as string) as string,
          issueId: epics[epicNumber].issueId,
        },
      };
    });

    storiesWithEpic.sort((a, b) => a.priority - b.priority);

    for (const story of storiesWithEpic) {
      let body = story.frontmatter.role
        ? `As a ${story.frontmatter.role}, I want to ${story.frontmatter.action} so that ${story.frontmatter.benefit}.\n\n`
        : "";
      body += story.description;

      await createIssueAddToProject({
        repositoryId,
        projectInfo,
        owner,
        repo,
        issue: {
          parentIssueId: story.epic.issueId,
          title: story.title,
          body,
        },
        labelId: story.epic.labelId,
      });

      advance(`Ensured story ${story.title}`);
    }

    logInfo(`Bootstrap complete for ${owner}/${repo}`);

    return {
      owner,
      repo,
      labelCount: labels.length,
      epicCount: Object.keys(epics).length,
      storyCount: storiesWithEpic.length,
      totalSteps,
    };
  });
}
