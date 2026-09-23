import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = fileURLToPath(new URL("../", import.meta.url));
const mode = process.argv[2];
const dev = path.join(root, ".next/dev/types");
const tsc = require.resolve("typescript/bin/tsc");
const validator = `// Deliberately stale development output from removed routes.
import type { LayoutRoutes } from "./routes.js";
import type { LayoutRoutes as ProductionLayoutRoutes } from "../../types/routes.js";
type CurrentLayout<Route extends ProductionLayoutRoutes> = Route;
export type StaleLayout = CurrentLayout<LayoutRoutes>;
export type RemovedPlan = typeof import("../../../src/app/plan/advanced/page.js");
export type RemovedConverter = typeof import("../../../src/app/tools/ml-to-units/page.js");
export type RemovedLayout = typeof import("../../../src/app/tools/ml-to-units/layout.js");
export const staleDevelopmentSentinel: string = 123;
`;

function checkTypes(config, extra = []) {
  const result = spawnSync(process.execPath, [tsc, "--project", config, "--noEmit", "--incremental", "false", "--pretty", "false", ...extra], {
    cwd: root, encoding: "utf8", timeout: 120_000, maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.notEqual(result.status, null, `Typecheck terminated: ${result.signal}`);
  return { status: result.status, output: result.stdout + result.stderr };
}

function parseConfig(name) {
  const file = path.join(root, name);
  const read = ts.readConfigFile(file, ts.sys.readFile);
  assert.equal(read.error, undefined, `Cannot read ${name}`);
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root, undefined, file);
  assert.equal(parsed.errors.length, 0, `Invalid ${name}`);
  return parsed;
}

function expectRejected(file, source, code) {
  // Exclusive creation and a finally block protect existing source files.
  fs.writeFileSync(file, source, { flag: "wx" });
  try {
    const result = checkTypes("tsconfig.build.json");
    assert.notEqual(result.status, 0, "A genuine production type error was accepted.");
    assert.ok(result.output.includes(path.basename(file)) && result.output.includes(code), result.output);
  } finally { fs.unlinkSync(file); }
}

if (mode === "seed") {
  // Only the disposable CI checkout is allowed to receive deliberate failures.
  assert.equal(process.env.CI, "true", "Seed this fixture only in a disposable CI checkout.");
  for (const route of ["src/app/plan/advanced/page.tsx", "src/app/tools/ml-to-units/page.tsx", "src/app/tools/ml-to-units/layout.tsx"]) {
    assert.equal(fs.existsSync(path.join(root, route)), false, `${route} is no longer an appropriate removed-route fixture.`);
  }
  for (const file of ["routes.d.ts", "validator.ts"]) {
    assert.equal(fs.existsSync(path.join(dev, file)), false, `Refusing to overwrite existing development ${file}.`);
  }
  fs.mkdirSync(dev, { recursive: true });
  fs.writeFileSync(path.join(dev, "routes.d.ts"), 'export type LayoutRoutes = "/" | "/tools/ml-to-units";\n', { flag: "wx" });
  fs.writeFileSync(path.join(dev, "validator.ts"), validator, { flag: "wx" });
  // Model the ignored next-env file left by a development session as well.
  fs.writeFileSync(path.join(root, "next-env.d.ts"), '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\nimport "./.next/dev/types/routes.d.ts";\n');
  console.log("Seeded stale development route types and a development next-env reference.");
} else if (mode === "verify") {
  assert.equal(fs.readFileSync(path.join(dev, "validator.ts"), "utf8"), validator, "The fixture must remain present throughout the build.");
  const built = JSON.parse(fs.readFileSync(path.join(root, ".next/required-server-files.json"), "utf8"));
  assert.equal(built.config.typescript.tsconfigPath, "tsconfig.build.json");
  assert.equal(built.config.typescript.ignoreBuildErrors, false);
  const config = parseConfig("tsconfig.build.json");
  assert.equal(config.options.strict, true);
  assert.equal(config.options.noEmit, true);
  const relative = config.fileNames.map(f => path.relative(root, f).split(path.sep).join("/"));
  assert.ok(relative.includes("src/app/layout.tsx"));
  assert.ok(relative.includes(".next/types/validator.ts"), "Current production route validation must remain enabled.");
  assert.equal(relative.some(f => f.startsWith(".next/dev/")), false);
  assert.equal(fs.readFileSync(path.join(root, "next-env.d.ts"), "utf8").includes(".next/dev/"), false);
  console.log("PASS actual production build selects strict production types, not development artifacts.");

  const valid = checkTypes("tsconfig.build.json", ["--listFiles"]);
  assert.equal(valid.status, 0, valid.output);
  assert.equal(valid.output.split(/\r?\n/).some(line => line.replaceAll("\\", "/").includes("/.next/dev/")), false);
  console.log("PASS no development types enter the complete production TypeScript program.");

  const baseline = checkTypes("tsconfig.json");
  assert.notEqual(baseline.status, 0, "The stale fixture must reproduce the original shared-config failure.");
  for (const expected of ["TS2344", "TS2307", ".next/dev/types/validator.ts"]) assert.ok(baseline.output.includes(expected), baseline.output);
  console.log("PASS the same stale fixture still reproduces the original TS2344 and TS2307 errors in the development config.");

  expectRejected(path.join(root, "src/bacwater-build-type-negative.ts"), 'export const sourceTypeError: string = 42;\n', "TS2322");
  console.log("PASS genuine application TypeScript errors are still rejected.");
  expectRejected(path.join(root, ".next/types/bacwater-build-type-negative.ts"), 'export type BrokenRoute = typeof import("../../src/app/nonexistent-build-fixture/page.js");\n', "TS2307");
  console.log("PASS genuine current production route errors are still rejected.");
} else {
  throw new Error("Use seed before next build, then verify after a successful build.");
}
