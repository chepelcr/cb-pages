import type { Plugin, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(exec);

/**
 * Dev-only local CMS middleware. Exists ONLY while running `vite` (apply:
 * "serve"); it is never part of a static production build. It lets the dev-only
 * admin panel write content JSON back to disk, upload media, inspect git, and
 * publish (commit + push) so GitHub Pages redeploys.
 *
 * Security: bound to localhost requests only. There is no auth — this must
 * never run on a public host.
 */
export function localCms(): Plugin {
  let root = process.cwd(); // vite root (the `client/` dir)
  let projectRoot = process.cwd(); // git root (repo root)

  return {
    name: "local-cms",
    apply: "serve",
    configResolved(config) {
      root = config.root;
      projectRoot = path.resolve(config.root, ".."); // client/ -> repo root
    },
    configureServer(server: ViteDevServer) {
      const json = (res: ServerResponse, status: number, body: unknown) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      const readBody = (req: IncomingMessage): Promise<any> =>
        new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (c) => (data += c));
          req.on("end", () => {
            try {
              resolve(data ? JSON.parse(data) : {});
            } catch (e) {
              reject(e);
            }
          });
          req.on("error", reject);
        });

      const isLocal = (req: IncomingMessage) => {
        const addr = req.socket.remoteAddress ?? "";
        return addr === "127.0.0.1" || addr === "::1" || addr === "::ffff:127.0.0.1";
      };

      // Confine writes to the content dir / public media dir.
      const safeContentPath = (filename: string): string => {
        const abs = path.resolve(root, filename);
        const contentDir = path.resolve(root, "src/content");
        if (!abs.startsWith(contentDir)) throw new Error("Refused: path outside content dir");
        return abs;
      };

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/__cms/")) return next();
        if (!isLocal(req)) return json(res, 403, { error: "Local requests only" });

        try {
          // --- Write a content JSON file ---
          if (req.url === "/__cms/write" && req.method === "POST") {
            const { filename, data } = await readBody(req);
            if (!filename) return json(res, 400, { error: "filename required" });
            const abs = safeContentPath(filename);
            await fs.mkdir(path.dirname(abs), { recursive: true });
            await fs.writeFile(abs, JSON.stringify(data, null, 2) + "\n", "utf-8");
            return json(res, 200, { ok: true });
          }

          // --- Upload an asset (data URL) into public/media ---
          if (req.url === "/__cms/upload" && req.method === "POST") {
            const { filename, dataUrl } = await readBody(req);
            const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl ?? "");
            if (!match) return json(res, 400, { error: "invalid dataUrl" });
            const buffer = Buffer.from(match[2], "base64");
            const mediaDir = path.resolve(root, "public/media");
            await fs.mkdir(mediaDir, { recursive: true });
            let name = (filename || "asset").replace(/[^a-zA-Z0-9.\-_]/g, "-");
            // avoid clobbering an existing file
            let target = path.join(mediaDir, name);
            let i = 1;
            while (await fs.access(target).then(() => true).catch(() => false)) {
              const ext = path.extname(name);
              const base = path.basename(name, ext);
              target = path.join(mediaDir, `${base}-${i}${ext}`);
              i++;
            }
            await fs.writeFile(target, buffer);
            return json(res, 200, { src: `/media/${path.basename(target)}` });
          }

          // --- Delete an asset from public/media ---
          if (req.url === "/__cms/delete-asset" && req.method === "POST") {
            const { src } = await readBody(req);
            if (!src || !src.startsWith("/media/")) return json(res, 400, { error: "invalid src" });
            const abs = path.resolve(root, "public", src.replace(/^\//, ""));
            const mediaDir = path.resolve(root, "public/media");
            if (!abs.startsWith(mediaDir)) return json(res, 400, { error: "refused" });
            await fs.rm(abs, { force: true });
            return json(res, 200, { ok: true });
          }

          // --- Git status + recent log ---
          if (req.url === "/__cms/status" && req.method === "GET") {
            const [status, log] = await Promise.all([
              run("git status --short", { cwd: projectRoot }).then((r) => r.stdout).catch(() => ""),
              run("git log -5 --pretty=format:%h %ad %s --date=short", { cwd: projectRoot }).then((r) => r.stdout).catch(() => ""),
            ]);
            return json(res, 200, { dirty: status.trim().length > 0, status, log });
          }

          // --- Publish: commit content + media and push ---
          if (req.url === "/__cms/publish" && req.method === "POST") {
            const { message } = await readBody(req);
            const msg = (message || "chore(content): update via admin").replace(/"/g, "'");
            await run("git add -A client/src/content client/public/media", { cwd: projectRoot });
            const { stdout: staged } = await run("git diff --cached --name-only", { cwd: projectRoot });
            if (!staged.trim()) return json(res, 200, { pushed: false, output: "No hay cambios para publicar." });
            await run(`git commit -m "${msg}"`, { cwd: projectRoot });
            const { stdout, stderr } = await run("git push", { cwd: projectRoot });
            return json(res, 200, { pushed: true, output: stdout + stderr });
          }

          return json(res, 404, { error: "Unknown CMS endpoint" });
        } catch (e: any) {
          return json(res, 500, { error: e?.message ?? String(e) });
        }
      });
    },
  };
}
