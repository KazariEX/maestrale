<script lang="ts" setup>
    const navs = [
        {
            title: "编队",
            icon: "fa6-solid:house",
            to: { name: "home" }
        },
        {
            title: "科技",
            icon: "fa6-solid:sliders",
            to: { name: "technology" }
        },
        {
            title: "关于",
            icon: "fa6-solid:circle-info",
            to: { name: "about" }
        }
    ] as const;
</script>

<template>
    <nav
        position="fixed inset-x-0 bottom-0"
        grid="~ cols-3 items-center"
        h="16"
        shadow="black lg"
    >
        <nuxt-link
            v-for="{ title, icon, to } in navs"
            grid="~ place-items-center gap-1"
            class="[&.router-link-active]-text-primary"
            :to
        >
            <iconify text="4.5" :name="icon"/>
            <span>{{ title }}</span>
        </nuxt-link>
    </nav>
</template>