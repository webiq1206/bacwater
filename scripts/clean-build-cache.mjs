import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Workspace caches can be copied into publishing or outlive npm ci.
// Remove only disposable compiler caches, not the currently served build.
const cache = fileURLToPath(new URL("../.next/cache/webpack/", import.meta.url));
rmSync(cache, { recursive: true, force: true });
console.log("Cleared generated Webpack cache before production build.");