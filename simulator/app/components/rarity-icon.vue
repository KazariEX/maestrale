<script lang="ts" setup>
    import type { UseRarityStyleOptions } from "~/composables/useRarityStyle";

    const {
        mode = "general",
        rarity,
        showFrame = true
    } = defineProps<{
        mode?: UseRarityStyleOptions["mode"];
        rarity?: number;
        icon: string;
        padding?: boolean;
        showFrame?: boolean;
    }>();

    const { backgroundStyle, frameStyle } = useRarityStyle(() => rarity ?? 0, {
        mode
    });
</script>

<template>
    <a
        flex="~"
        position="relative"
        size="inherit"
        :class="{
            [`p-1`]: padding
        }"
        :style="backgroundStyle"
    >
        <nuxt-img
            size="full"
            object="contain"
            :src="icon"
            loading="lazy"
        />
        <div
            v-if="showFrame"
            absolute="~"
            inset="0"
            :style="frameStyle"
        ></div>
    </a>
</template>