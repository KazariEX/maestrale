<script lang="ts" setup>
    import type { TransformMatrixItem } from "maestrale";

    const items = defineModel<TransformMatrixItem[]>({
        required: true,
    });

    const item = computed(() => {
        return items.value.some(({ template }) => template.edit_trans.length)
            && items.value.find(({ isEnabled }) => isEnabled.value)
            || items.value[0];
    });
</script>

<template>
    <li
        v-if="item"
        grid="~ gap-1"
        p="1"
        b="~ solid border"
        cursor="pointer"
        :class="{
            [`op-50`]: !item.isEnabled.value,
        }"
        @click="item.isEnabled.value = !item.isEnabled.value"
    >
        <nuxt-img size="7" m="auto" :src="getTransformIconAtlas(item.template.icon)"/>
        <span text="3 center truncate">{{ item.template.name }}</span>
    </li>
</template>
