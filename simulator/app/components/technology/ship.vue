<script lang="ts" setup>
    import type { AchieveAdditional } from "~/types/technology";

    defineProps<{
        additional: AchieveAdditional;
    }>();
</script>

<template>
    <div flex="~ items-center gap-3">
        <rarity-icon
            size="16"
            :icon="additional.icon"
            :rarity="additional.rarity"
        />
        <span>{{ additional.name }}</span>
    </div>
</template>
