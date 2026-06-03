/**
 * Regenerate src/content/inventory.json — a registry of source files under
 * client/src. Run after adding/removing/renaming files: `pnpm gen:inventory`.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(repoRoot, "client/src");
const out = path.resolve(srcDir, "content/inventory.json");

const typeOf = (file: string): string => {
  if (file.endsWith(".tsx")) return "component";
  if (file.endsWith(".ts")) return "module";
  if (file.endsWith(".json")) return "content";
  if (file.endsWith(".css")) return "style";
  return "other";
};

async function walk(dir: string, acc: { path: string; type: string; bytes: number }[]) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(abs, acc);
    } else {
      const rel = path.relative(repoRoot, abs).replace(/\\/g, "/");
      if (rel.endsWith("content/inventory.json")) continue;
      const { size } = await fs.stat(abs);
      acc.push({ path: rel, type: typeOf(entry.name), bytes: size });
    }
  }
}

async function main() {
  const files: { path: string; type: string; bytes: number }[] = [];
  await walk(srcDir, files);
  files.sort((a, b) => a.path.localeCompare(b.path));
  const generatedAt = new Date().toISOString().slice(0, 10);
  await fs.writeFile(out, JSON.stringify({ generatedAt, files }, null, 2) + "\n", "utf-8");
  console.log(`inventory.json: ${files.length} files`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
