import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "mysql", 
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Zeo@1523", // Use the actual password here, not the URL-encoded one
    database: "drizzle_test",
  },
});