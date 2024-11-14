<script lang="ts" setup>
    import { ShareCfg } from "maestrale";

    useHead({
        meta: [
            { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no" }
        ],
        link: [
            { rel: "icon", href: "/image/favicon.ico" }
        ],
        titleTemplate: "%s %separator 西北风模拟器",
        templateParams: {
            separator: "/"
        }
    });

    await ShareCfg.load();
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>