import "dotenv/config";
import { defineConfig, env } from "prisma/config";

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});