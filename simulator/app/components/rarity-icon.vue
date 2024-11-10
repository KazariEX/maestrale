<script lang="ts" setup>
    const { rarity, icon } = defineProps<{
        rarity?: number;
        icon: string;
    }>();

    const { backgroundStyle, frameStyle } = useRarityStyle(() => rarity ?? 0);
</script>

<template>
    <a
        relative="~"
        flex="~"
        :style="backgroundStyle"
    >
        <nuxt-img size="16" :src="icon"/>
        <div absolute="~" inset="0" :style="frameStyle"></div>
    </a>
</template>