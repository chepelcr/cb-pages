/**
 * Client for the dev-only local-CMS Vite middleware. These endpoints exist ONLY
 * when running `vite` in dev (apply: "serve"); they are never part of a static
 * production build. "Save" = write a content JSON file back to disk. "Publish" =
 * git add/commit/push so GitHub Pages redeploys.
 */

export interface WriteResult {
  ok: boolean;
  error?: string;
}

async function postJson(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed: ${res.status}`);
  return json;
}

/** Write a content JSON file (path relative to the Vite root `client/`). */
export async function writeContentFile(filename: string, data: unknown): Promise<WriteResult> {
  await postJson("/__cms/write", { filename, data });
  return { ok: true };
}

/** Upload an asset (data URL) into public/media and return its public src. */
export async function uploadAsset(
  filename: string,
  dataUrl: string,
): Promise<{ src: string }> {
  return postJson("/__cms/upload", { filename, dataUrl });
}

/** Delete a media file from public/media. */
export async function deleteAsset(src: string): Promise<WriteResult> {
  await postJson("/__cms/delete-asset", { src });
  return { ok: true };
}

/** Commit + push all content/media changes so GitHub Pages redeploys. */
export async function publish(message: string): Promise<{ pushed: boolean; output: string }> {
  return postJson("/__cms/publish", { message });
}

/** Read git status + recent log for the Diagnostics page. */
export async function gitStatus(): Promise<{ dirty: boolean; status: string; log: string }> {
  const res = await fetch("/__cms/status");
  if (!res.ok) throw new Error(`Status failed: ${res.status}`);
  return res.json();
}
