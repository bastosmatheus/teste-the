import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src", "!src/database/tables.sql", "!src/service/*.spec.ts"],
  format: ["cjs"],
  outDir: "dist",
});
