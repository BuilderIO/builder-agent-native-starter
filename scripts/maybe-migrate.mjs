import { spawnSync } from "node:child_process";

const branchKind = process.env.FUSION_BRANCH_KIND;

if (branchKind !== "feature") {
  if (branchKind !== "main") {
    console.warn(
      `Skipping database migrations because FUSION_BRANCH_KIND is ${branchKind ?? "unset"}`,
    );
  }

  process.exit(0);
}

if (!process.env.DATABASE_URL_UNPOOLED) {
  console.warn(
    "Skipping database migrations because DATABASE_URL_UNPOOLED is not set",
  );
  process.exit(0);
}

const isWindows = process.platform === "win32";
const pnpmCommand = isWindows ? "pnpm.cmd" : "pnpm";
const result = spawnSync(pnpmCommand, ["run", "db:migrate"], {
  env: process.env,
  shell: isWindows,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
