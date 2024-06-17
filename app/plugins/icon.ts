import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export default defineNuxtPlugin(async (NuxtApp) => {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        NuxtApp.vueApp.component(key, component);
    }
});