<script lang="ts" setup>
    defineProps<{
        value?: number;
        max: number;
    }>();

    const backgroundStyle = {
        backgroundImage: `url("/image/prefab/ui/worldui/star_bg.png")`
    };
</script>

<template>
    <ul flex="~">
        <li
            v-for="i in max"
            flex="~"
            size="13px"
            m="x--2.5px"
            :style="backgroundStyle"
        >
            <nuxt-img v-if="i <= (value ?? max)" h="full" src="/image/prefab/ui/worldui/star.png"/>
        </li>
    </ul>
</template>