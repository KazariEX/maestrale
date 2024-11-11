<script lang="ts" setup>
    import type { UseRarityStyleOptions } from "~/composables/useRarityStyle";

    const {
        mode = "general",
        rarity,
        iconClass = "size-max-full",
        showFrame = true
    } = defineProps<{
        mode?: UseRarityStyleOptions["mode"];
        rarity?: number;
        icon: string;
        iconClass?: string;
        showFrame?: boolean;
        shrink?: boolean;
    }>();

    const { backgroundStyle, frameStyle } = useRarityStyle(() => rarity ?? 0, {
        mode
    });
</script>

<template>
    <a
        relative="~"
        flex="~"
        size="inherit"
        :style="backgroundStyle"
    >
        <nuxt-img
            :class="[iconClass, {
                [`m-auto`]: shrink
            }]"
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