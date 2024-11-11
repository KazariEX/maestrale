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
        star?: number;
        maxStar?: number;
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
            position="absolute inset-0"
            :style="frameStyle"
        ></div>
        <rarity-star
            v-if="star || maxStar"
            position="absolute bottom-0.5 left-1"
            :value="star"
            :max="maxStar!"
        />
    </a>
</template>