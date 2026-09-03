import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "dist");
const bundleDirectory = join(projectRoot, "src-tauri", "target", "release", "bundle");
const packageExtensions = new Set([".msi", ".exe", ".appimage", ".deb", ".rpm"]);

const findPackages = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findPackages(entryPath);
    return packageExtensions.has(extname(entry.name).toLowerCase()) ? [entryPath] : [];
  });

execFileSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "tauri:build"],
  { cwd: projectRoot, stdio: "inherit", shell: true },
);

mkdirSync(outputDirectory, { recursive: true });
for (const entry of readdirSync(outputDirectory, { withFileTypes: true })) {
  if (entry.name !== ".gitkeep") {
    rmSync(join(outputDirectory, entry.name), { recursive: true, force: true });
  }
}

const packages = findPackages(bundleDirectory);
if (packages.length === 0) {
  throw new Error(`No se encontró ningún instalador en ${bundleDirectory}`);
}

for (const packagePath of packages) {
  cpSync(packagePath, join(outputDirectory, basename(packagePath)));
}

console.log(`Instaladores disponibles en ${outputDirectory}:`);
for (const packagePath of packages) console.log(`- ${basename(packagePath)}`);
