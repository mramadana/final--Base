import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'node:path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  
  app: {
    pageTransition: {
      name: 'layout',
      mode: 'out-in',
    },
    head: {
      title: "جعفر-علوان",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "ar", class: "html_direction" },
      meta: [
        { name: "description", content: "موقع اميال لتاجير السيارات" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/logo.svg" },
      ],
      script: [
        {
          children: `
            (function () {
              const savedLang = localStorage.getItem("locale") || "ar";
              const html = document.documentElement;
              html.lang = savedLang;
              html.dir = savedLang === "ar" ? "rtl" : "ltr";
              window.__NUXT_LANG__ = savedLang;
              window.__NUXT_TEXTS__ = { ar: "العربية", en: "English" };
            })();
          `,
          type: "text/javascript",
          defer: true,
        },
      ],
    },
  },

  modules: [
    'nuxt-primevue',
    "@pinia/nuxt",
    '@pinia-plugin-persistedstate/nuxt',
    "nuxt-echarts",
  ],

  alias: {
    assets: resolve(__dirname, './assets'), // <-- التصحيح هنا
  },

  css: [
    "bootstrap/dist/css/bootstrap.rtl.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "primevue/resources/themes/lara-light-green/theme.css",
    "primevue/resources/primevue.min.css",
    "~/assets/css/style.scss",
  ],

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },

  build: {
    transpile: [
      "@fawmi/vue-google-maps",
      "@syncfusion/ej2-vue-calendars",
      "@syncfusion/ej2-base",
      "@syncfusion/ej2-calendars"
    ],
  },

  compatibilityDate: "2025-01-12",
});