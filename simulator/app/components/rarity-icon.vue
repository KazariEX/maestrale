<script lang="ts" setup>
    const { rarity } = defineProps<{
        rarity?: number;
        icon: string;
        shrink?: boolean;
    }>();

    const { backgroundStyle, frameStyle } = useRarityStyle(() => rarity ?? 0);
</script>

<template>
    <a
        relative="~"
        flex="~"
        size="inherit"
        :style="backgroundStyle"
    >
        <nuxt-img
            size="max-full"
            :class="{
                [`m-auto`]: shrink
            }"
            :src="icon"
            loading="lazy"
        />
        <div absolute="~" inset="0" :style="frameStyle"></div>
    </a>
</template>