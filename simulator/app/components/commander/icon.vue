<script lang="ts" setup>
    const { icon } = defineProps<{
        icon?: string;
    }>();

    const src = computed(() => {
        return icon ?? "/assets/artresource/ui/commanderui/commandroomui/icon_bg.png";
    });
</script>

<template>
    <nuxt-img
        :class="{
            [`h-16`]: icon,
            [`size-14 p-2 my-1`]: !icon
        }"
        m="x-auto"
        cursor="pointer"
        :src
    />
</template>