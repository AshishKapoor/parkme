import { defineConfig } from "orval";

export default defineConfig({
  parkme: {
    input: {
      target: "http://localhost:8000/api/schema/",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated/index.ts",
      schemas: "src/api/generated/schemas",
      client: "fetch",
      clean: true,
      override: {
        useDates: true,
        mutator: {
          path: "src/api/http-client.ts",
          name: "httpClient",
        },
      },
    },
  },
});
