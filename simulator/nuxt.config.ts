import { resolve } from "node:path";

export default defineNuxtConfig({
    alias: {
        maestrale: resolve(import.meta.dirname, "../packages/core/src"),
        "@maestrale/data": resolve(import.meta.dirname, "../packages/data/src"),
        "@maestrale/excalc": resolve(import.meta.dirname, "../packages/excalc/dist/excalc.js"),
    },
    compatibilityDate: "2024-07-19",
    css: [
        "~/assets/index.scss",
    ],
    devServer: {
        port: 2243,
    },
    devtools: {
        enabled: true,
    },
    experimental: {
        typedPages: true,
    },
    future: {
        compatibilityVersion: 4,
    },
    ssr: false,
    unhead: {
        legacy: true,
    },
    vite: {
        build: {
            target: "esnext",
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                },
            },
        },
    },
    modules: [
        "@nuxt/icon",
        "@nuxt/image",
        "@pinia/nuxt",
        "@primevue/nuxt-module",
        "@unocss/nuxt",
        "@vueuse/nuxt",
        "pinia-plugin-persistedstate/nuxt",
    ],
    primevue: {
        components: {
            prefix: "Prime",
            // https://github.com/primefaces/primevue/issues/7434
            exclude: ["Chart", "Editor", "Form", "FormField"],
        },
        importTheme: {
            from: "~/themes/index.ts",
        },
        options: {
            ripple: true,
        },
    },
    piniaPluginPersistedstate: {
        storage: "localStorage",
    },
    icon: {
        componentName: "iconify",
    },
});
