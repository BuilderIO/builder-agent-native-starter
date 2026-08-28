import { createDrizzleConfig } from "@agent-native/core/db/drizzle-config";

// This starter keeps app tables in `drizzle/schema.ts` (not the framework
// default `server/db/schema.ts`), so point drizzle-kit at that path.
export default createDrizzleConfig({ schema: "./drizzle/schema.ts" });
