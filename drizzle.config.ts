<<<<<<< HEAD:drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED! },
});
=======
import { createDrizzleConfig } from "@agent-native/core/db/drizzle-config";

// This starter keeps app tables in `drizzle/schema.ts` (not the framework
// default `server/db/schema.ts`), so point drizzle-kit at that path.
export default createDrizzleConfig({ schema: "./drizzle/schema.ts" });
>>>>>>> origin/template:.github/starter-patch/overlay/drizzle.config.ts
