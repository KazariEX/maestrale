import { resolve } from "node:path";

export default defineNuxtConfig({
    alias: {
        maestrale: resolve(__dirname, "../packages/core/src")
    },
    compatibilityDate: "2024-07-19",
    css: [
        "~/assets/index.scss"
    ],
    devServer: {
        port: 2243
    },
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
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
        }
    },
    modules: [
        "@nuxt/icon",
        "@nuxt/image",
        "@pinia/nuxt",
        "@primevue/nuxt-module",
        "@unocss/nuxt",
        "@vueuse/nuxt"
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
    },
    icon: {
        componentName: "iconify"
    }
});