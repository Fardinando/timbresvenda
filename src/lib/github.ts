const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

function headers() {
  return {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function createRelease(tag: string, name: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        tag_name: tag,
        name,
        draft: false,
        prerelease: false,
      }),
    }
  );
  if (!res.ok) throw new Error(`Failed to create release: ${await res.text()}`);
  return res.json();
}

export async function uploadReleaseAsset(
  releaseId: number,
  filename: string,
  data: Buffer,
  contentType: string = "application/octet-stream"
) {
  const uploadUrl = `https://uploads.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/${releaseId}/assets?name=${encodeURIComponent(filename)}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `token ${TOKEN}`,
      "Content-Type": contentType,
      "Content-Length": String(data.length),
    },
    body: new Uint8Array(data),
  });
  if (!res.ok) throw new Error(`Failed to upload asset: ${await res.text()}`);
  return res.json();
}

export async function deleteReleaseAsset(assetId: number) {
  const res = await fetch(
    `https://uploads.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/assets/${assetId}`,
    { method: "DELETE", headers: headers() }
  );
  return res.ok;
}

export async function deleteRelease(releaseId: number) {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases/${releaseId}`,
    { method: "DELETE", headers: headers() }
  );
  return res.ok;
}

export async function listReleaseAssets(releaseTag: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/${releaseTag}`,
    { headers: headers() }
  );
  if (!res.ok) return [];
  const release = await res.json();
  return release.assets ?? [];
}

export function getAssetDownloadUrl(asset: { browser_download_url: string }) {
  return asset.browser_download_url;
}
