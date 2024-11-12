<script lang="ts" setup>
    import type { TransformMatrixTemplate } from "maestrale";

    const { templates } = defineProps<{
        templates: TransformMatrixTemplate[];
    }>();

    const template = computed(() => {
        return templates.some(({ edit_trans }) => edit_trans.length)
            && templates.find(({ enable }) => enable.value)
            || templates[0];
    });

    const toggleEnabled = template.value && useToggle(template.value.enable);
</script>

<template>
    <li
        v-if="template"
        grid="~ gap-1 justify-items-center"
        p="y-1"
        b="~ solid gray op-40"
        cursor="pointer"
        :class="{
            [`op-50`]: !template.enable.value
        }"
        @click="toggleEnabled?.()"
    >
        <nuxt-img size="7" :src="`/image/artresource/atlas/modicon/${template.icon}.png`"/>
        <span text="3">{{ template.name }}</span>
    </li>
</template>