<script lang="ts" setup>
    useHead({
        link: [
            { rel: "icon", href: "/image/favicon.ico" }
        ],
        titleTemplate: "%s %separator 西北风模拟器",
        templateParams: {
            separator: "-"
        }
    });
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>