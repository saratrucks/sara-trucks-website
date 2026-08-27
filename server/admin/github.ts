const OWNER = "saratrucks";
const REPO = "sara-trucks-website";
const BRANCH = "main";
const API_VERSION = "2026-03-10";

type GitHubFile = {
  sha: string;
  content?: string;
  encoding?: string;
};

function token() {
  const value = process.env.GITHUB_TOKEN;
  if (!value) throw new Error("NOT_CONFIGURED");
  return value;
}

function headers() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token()}`,
    "X-GitHub-Api-Version": API_VERSION,
    "Content-Type": "application/json",
  };
}

function endpoint(path: string) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export async function getRepositoryFile(path: string) {
  const response = await fetch(`${endpoint(path)}?ref=${BRANCH}`, { headers: headers() });
  if (!response.ok) throw new Error(`GITHUB_READ_${response.status}`);
  const file = (await response.json()) as GitHubFile;
  if (!file.content || file.encoding !== "base64") throw new Error("GITHUB_INVALID_FILE");
  return {
    sha: file.sha,
    content: Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"),
  };
}

export async function putRepositoryFile(path: string, content: Buffer | string, message: string, sha?: string) {
  const body: Record<string, string> = {
    message,
    branch: BRANCH,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content, "utf8").toString("base64"),
  };
  if (sha) body.sha = sha;

  const response = await fetch(endpoint(path), {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GITHUB_WRITE_${response.status}:${details.slice(0, 300)}`);
  }

  return response.json();
}
