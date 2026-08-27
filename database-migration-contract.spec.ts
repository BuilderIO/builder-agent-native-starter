import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("database migration ownership", () => {
  it("uses generated Drizzle migrations as the only app migration path", () => {
    const skill = read(".agents/skills/storing-data/SKILL.md");
    const releaseScript = read("scripts/migrate-production.ts");
    const netlifyConfig = read("netlify.toml");
    const packageJson = JSON.parse(read("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(skill).toContain("drizzle/schema.ts");
    expect(skill).toContain("pnpm db:generate");
    expect(skill).toContain("scripts/migrate-production.ts` is framework-only");
    expect(skill).toContain(
      "do not create a parallel `runMigrations([...])` list",
    );

    expect(releaseScript).toContain("runFrameworkReleaseMigrations(null)");
    expect(releaseScript).not.toMatch(/from ["'][^"']*server\/plugins\/db/);
    expect(packageJson.scripts["db:generate"]).toBe("drizzle-kit generate");
    expect(packageJson.scripts["db:migrate"]).toBe("drizzle-kit migrate");
    expect(netlifyConfig).toContain(
      "pnpm migrate:production && pnpm db:migrate",
    );
  });
});
