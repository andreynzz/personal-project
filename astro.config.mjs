import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  build: {
    inlineStylesheets: "always"
  },
  integrations: [react()]
});
