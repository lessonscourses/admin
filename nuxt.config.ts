// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    bdurl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
    authSecret: process.env.AUTH_SECRET,
    mongodbUri: process.env.DATABASE_URL,
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
    FILES_PATH: process.env.FILES_PATH,
    FILES_PATH_VIDEO: process.env.FILES_PATH_VIDEO,
    public: {
      filesPath: process.env.FILES_PATH_URL,
      filesPathVideo: process.env.FILES_PATH_VIDEO_URL,
      urlHost: process.env.AUTH_ORIGIN,
    },
  },
  app: {
    head: {
      title: "Admin",
      htmlAttrs: {
        lang: "ru",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { charset: "utf-8" },
        { hid: "robots", name: "robots", content: "noindex, nofollow" },
        { name: "yandex-verification", content: "" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Admin mycyrse",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Admin",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Admin mycyrse",
        },
        {
          hid: "og:url",
          property: "og:url",
        },
        {
          hid: "og:image",
          property: "og:image",
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: "ru_RU",
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "website",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  modules: [
    "nuxt-server-utils",
    "@sidebase/nuxt-auth",
    "nuxt-icon",
    "@element-plus/nuxt",
    "@nuxt/image-edge",
    "@nuxt/image",
    "nuxt-aos",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-swiper",
    "@nuxt/content",
    "@hypernym/nuxt-anime",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [100, 300, 400, 500, 600, 700, 800],
          download: true,
          inject: true,
        },
      },
    ],
  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },
  image: {
    aliyun: {
      baseURL: "https://disk.weboko.net/",
      //baseURL: "http://localhost:3001/",
    },
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  css: ["@/node_modules/bulma/css/bulma.css", "@/assets/main.css"],
  devtools: { enabled: true },
  nitro: {
    plugins: ["~/server/index.ts"],
    devProxy: {
      "/images": {
        target: "https://disk.weboko.net/assets/images/",
        changeOrigin: true,
      },
    },
  },
});
