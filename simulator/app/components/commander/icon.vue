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
        m="x-auto"
        cursor="pointer"
        :class="icon ? `h-16` : `size-14 p-2 my-1`"
        :src
    />
</template>
