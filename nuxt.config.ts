export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "icon", href: "/image/favicon.ico" }
            ]
        }
    },
    css: [
        "~/assets/scss/index.scss"
    ],
    devServer: {
        port: 615
    },
    devtools: {
        enabled: false
    },
    future: {
        compatibilityVersion: 4
    },
    ssr: false,
    modules: [
        "@element-plus/nuxt",
        "@nuxt/image",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt"
    ]
});