<script lang="ts" setup>
    export interface RarityIconProps {
        mode?: "general" | "spweapon";
        rarity?: number;
        icon: string;
        padding?: boolean;
        showFrame?: boolean;
        star?: number;
        maxStar?: number;
        isMeta?: boolean;
    }

    const {
        mode = "general",
        rarity,
        showFrame = true,
        isMeta = false,
    } = defineProps<RarityIconProps>();

    const order = computed(() => {
        return Math.max(2, rarity ?? 0) - (mode === "general" ? 1 : 0);
    });

    const backgroundStyle = computed(() => ({
        backgroundImage: `url(/assets/artresource/atlas/weaponframes/bg${isMeta ? "1" : ""}${order.value}.png)`,
    }));

    const frameStyle = computed(() => ({
        backgroundImage: `url(/assets/artresource/atlas/weaponframes/frame_${order.value}.png)`,
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
            v-if="showFrame"
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
