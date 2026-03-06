import type { IncomingMessage, ServerResponse } from "node:http";

import dotenv from "dotenv";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runBootstrap } from "./bootstrap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "../public");

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const projectTemplateName = process.env.GITHUB_PROJECT_TEMPLATE_NAME || "LIA_TEMPLATE";
const port = Number(process.env.PORT || 3000);

type RunRequest = {
  owner?: string;
  repo?: string;
  repoUrl?: string;
};

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function getMimeType(filePath: string): string {
  switch (extname(filePath)) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    default:
      return "text/plain; charset=utf-8";
  }
}

async function readJsonBody(request: IncomingMessage): Promise<RunRequest> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf-8")) as RunRequest;
}

function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const parsedUrl = new URL(repoUrl);

  if (parsedUrl.hostname !== "github.com") {
    throw new Error("Repository URL must point to github.com");
  }

  const [owner, rawRepo] = parsedUrl.pathname.split("/").filter(Boolean);
  const repo = rawRepo?.replace(/\.git$/, "");

  if (!owner || !repo) {
    throw new Error("Repository URL must include both owner and repo");
  }

  return { owner, repo };
}

function resolveRepositoryInput(body: RunRequest): { owner: string; repo: string } {
  if (body.owner && body.repo) {
    return { owner: body.owner.trim(), repo: body.repo.trim() };
  }

  if (body.repoUrl) {
    return parseRepoUrl(body.repoUrl.trim());
  }

  throw new Error("Provide either owner/repo or repoUrl");
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "Missing request URL" });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/") {
    const filePath = join(publicDir, "index.html");
    response.writeHead(200, { "Content-Type": getMimeType(filePath) });
    response.end(readFileSync(filePath));
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && request.url === "/api/run") {
    if (!token) {
      sendJson(response, 500, { error: "GITHUB_TOKEN must be set in the environment" });
      return;
    }

    try {
      const body = await readJsonBody(request);
      const { owner, repo } = resolveRepositoryInput(body);

      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-ndjson; charset=utf-8",
      });

      const logs: string[] = [];
      const writeEvent = (event: Record<string, unknown>) => {
        response.write(`${JSON.stringify(event)}\n`);
      };

      const pushLog = (level: "info" | "warn" | "error", message: string) => {
        const line = `[${level}] ${message}`;
        logs.push(line);
        writeEvent({ type: "log", level, message, logs });
      };

      writeEvent({ type: "start", owner, repo });

      const result = await runBootstrap({
        owner,
        repo,
        token,
        projectTemplateName,
        logger: {
          info: message => pushLog("info", message),
          warn: message => pushLog("warn", message),
          error: message => pushLog("error", message),
        },
        onProgress: progress => writeEvent({ type: "progress", ...progress }),
      });

      writeEvent({ type: "done", result, logs });
      response.end();
      return;
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      if (!response.headersSent) {
        sendJson(response, 400, { error: message });
        return;
      }

      response.write(`${JSON.stringify({ type: "error", message })}\n`);
      response.end();
      return;
    }
  }

  const requestedPath = request.url === "/index.html" ? "/index.html" : request.url;
  const filePath = join(publicDir, requestedPath);

  try {
    const fileContent = readFileSync(filePath);
    response.writeHead(200, { "Content-Type": getMimeType(filePath) });
    response.end(fileContent);
  }
  catch {
    sendJson(response, 404, { error: "Not found" });
  }
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
