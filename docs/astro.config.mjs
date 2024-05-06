import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkToc],
  },
  integrations: [tailwind(), mdx()],
});
