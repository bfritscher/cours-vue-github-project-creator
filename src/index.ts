import dotenv from "dotenv";

import { runBootstrap } from "./bootstrap";

dotenv.config();

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const projectTemplateName = process.env.GITHUB_PROJECT_TEMPLATE_NAME || "LIA_TEMPLATE";

if (!owner || !repo || !token) {
  throw new Error("GITHUB_OWNER, GITHUB_REPO and GITHUB_TOKEN must be set in .env");
}

await runBootstrap({
  owner,
  repo,
  token,
  projectTemplateName,
});
