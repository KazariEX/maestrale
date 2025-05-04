<script lang="ts" setup>
    import type { Attributes } from "maestrale";
    import { attributeMap } from "~/data/constants/attribute";

    const { value } = defineProps<{
        attr: keyof Attributes;
        value: number;
    }>();

    const displayValue = computed(() => {
        return value.toString().padEnd(5, "0");
    });
</script>

<template>
    <li
        flex="~ items-center gap-2"
        h="8"
        p="1"
        b-b="~ solid slate op-25"
    >
        <nuxt-img w="6" :src="`/assets/prefab/variantplatform/${attr}.png`"/>
        <span>{{ attributeMap[attr] }}</span>
        <span m="l-auto">+{{ displayValue }}%</span>
    </li>
</template>
