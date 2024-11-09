import { resolve } from "node:path";

export default defineNuxtConfig({
    alias: {
        maestrale: resolve(__dirname, "../packages/core/src")
    },
    compatibilityDate: "2024-07-19",
    css: [
        "~/assets/index.scss"
    ],
    devtools: {
        enabled: true
    },
    experimental: {
        viewTransition: true,
        typedPages: true
    },
    future: {
        compatibilityVersion: 4
    },
    ssr: false,
    modules: [
        "@nuxt/icon",
        "@nuxt/image",
        "@pinia/nuxt",
        "@primevue/nuxt-module",
        "@unocss/nuxt"
    ],
    primevue: {
        components: {
            prefix: "Prime"
        },
        importTheme: {
            from: "~/themes/index.ts"
        },
        options: {
            ripple: true
        }
    }
});