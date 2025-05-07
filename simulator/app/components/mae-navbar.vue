<script lang="ts" setup>
    import type { RouteLocationRaw } from "vue-router";

    const navs: {
        title: string;
        icon: string;
        to: RouteLocationRaw;
    }[] = [
        {
            title: "编队",
            icon: "fa6-solid:ship",
            to: { name: "fleet" },
        },
        {
            title: "舰队科技",
            icon: "fa6-solid:sliders",
            to: { name: "technology" },
        },
        {
            title: "指挥喵",
            icon: "fa6-solid:n",
            to: { name: "catlodge" },
        },
        {
            title: "设置",
            icon: "fa6-solid:gear",
            to: { name: "settings" },
        },
    ];
</script>

<template>
    <nav
        position="fixed"
        lg:position="inset-y-0 left-0"
        lt-lg:position="inset-x-0 bottom-0"
        flex="~ justify-center lg:col"
        w="lg:18"
        h="lt-lg:16"
        b="solid border lg:r lt-lg:t"
        bg="background"
    >
        <nuxt-link
            v-for="{ title, icon, to } in navs"
            v-ripple
            flex="~ col justify-center items-center gap-1 lt-lg:1"
            p="lg:y-6"
            class="[&.router-link-active]:text-primary"
            :to
        >
            <iconify text="4.5" :name="icon"/>
            <span>{{ title }}</span>
        </nuxt-link>
    </nav>
</template>
