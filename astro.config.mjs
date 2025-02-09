// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import brainDbAstro from "@braindb/astro";
import starlightSidebarTopics from "starlight-sidebar-topics";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Ingress.Wiki",
      locales: {
        en: { label: "English" },
        "zh-hans": { label: "简体中文", lang: "zh-Hans" },
      },
      defaultLocale: "en",
      social: {
        github: "https://github.com/ingress-wiki/IngressWiki",
      },
      editLink: {
        baseUrl: "https://github.com/ingress-wiki/IngressWiki/edit/main/",
      },
      customCss: ["./src/styles/global.css"],
      components: {
        Head: "./src/components/Head.astro",
        Footer: "./src/components/Footer.astro",
      },
      plugins: [
        starlightSidebarTopics([
          {
            id: "guides",
            label: { en: "Guides", "zh-Hans": "指南" },
            icon: "open-book",
            link: "/guides/",
            items: [
              {
                label: "For New Recruits",
                translations: { "zh-Hans": "新手上路" },
                autogenerate: { directory: "guides/starter" },
              },
              {
                label: "Digging Deeper",
                translations: { "zh-Hans": "进阶训练" },
                autogenerate: { directory: "guides/advanced" },
              },
            ],
          },
          {
            id: "reference",
            label: { en: "Reference", "zh-Hans": "资料" },
            icon: "seti:db",
            link: "/reference/",
            items: [
              {
                label: "Concepts",
                translations: { "zh-Hans": "概念" },
                autogenerate: { directory: "reference/concepts" },
              },
              {
                label: "Inventory Items",
                translations: { "zh-Hans": "物品" },
                autogenerate: { directory: "reference/items" },
              },
              {
                label: "Medals",
                translations: { "zh-Hans": "徽章" },
                autogenerate: { directory: "reference/medals" },
              },
            ],
          },
          {
            id: "contributing",
            label: { en: "Contributing", "zh-Hans": "维基" },
            icon: "heart",
            link: "/contributing/",
            items: [
              {
                label: "Content",
                translations: { "zh-Hans": "内容" },
                autogenerate: { directory: "contributing/content" },
              },
              {
                label: "Community",
                translations: { "zh-Hans": "社区" },
                autogenerate: { directory: "contributing/community" },
              },
              {
                label: "Technology",
                translations: { "zh-Hans": "技术" },
                autogenerate: { directory: "contributing/tech" },
              },
            ],
          },
        ]),
      ],
    }),
    svelte(),
    brainDbAstro(),
  ],

  redirects: {
    "/": "/en",
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".csb.app"],
    },
  },
});
