<script lang="ts" setup>
    export interface RarityIconProps {
        mode?: "general" | "spweapon";
        rarity?: number;
        icon: string;
        frame?: boolean;
        meta?: boolean;
        padding?: boolean;
        star?: number;
        maxStar?: number;
    }

    const {
        mode = "general",
        rarity,
        frame = true,
        meta,
    } = defineProps<RarityIconProps>();

    const order = computed(() => {
        return Math.max(2, rarity ?? 0) - (mode === "general" ? 1 : 0);
    });

    const backgroundStyle = computed(() => ({
        backgroundImage: `url(${getRarityBackgroundAtlas(order.value, meta)})`,
    }));

    const frameStyle = computed(() => ({
        backgroundImage: `url(${getRarityFrameAtlas(order.value)})`,
    }));
</script>

<template>
    <a
        flex="~"
        position="relative"
        size="inherit"
        :class="{
            [`p-1`]: padding,
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
            v-if="frame"
            position="absolute inset-0"
            :style="frameStyle"
        ></div>
        <rarity-star
            v-if="star"
            position="absolute bottom-0.5 left-1"
            :value="star"
            :max="maxStar ?? star!"
        />
    </a>
</template>
