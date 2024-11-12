<script lang="ts" setup>
    import type { TransformMatrixTemplate } from "maestrale";

    const templates = defineModel<TransformMatrixTemplate[]>({
        required: true
    });

    const template = computed(() => {
        return templates.value.some(({ edit_trans }) => edit_trans.length)
            && templates.value.find(({ enable }) => enable.value)
            || templates.value[0];
    });
</script>

<template>
    <li
        v-if="template"
        grid="~ gap-1"
        p="1"
        b="~ solid gray op-40"
        cursor="pointer"
        :class="{
            [`op-50`]: !template.enable.value
        }"
        @click="template.enable.value = !template.enable.value"
    >
        <nuxt-img size="7" m="auto" :src="`/image/artresource/atlas/modicon/${template.icon}.png`"/>
        <span text="3 center truncate">{{ template.name }}</span>
    </li>
</template>