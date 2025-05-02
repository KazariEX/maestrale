<script lang="ts" setup>
    defineProps<{
        label: string;
    }>();

    const modelValue = defineModel<number>();
</script>

<template>
    <li flex="~ gap-4 items-center">
        <span>{{ label }}</span>
        <prime-input-number
            input-class="w-24 text-center"
            size="small"
            readonly
            :use-grouping="false"
            v-model="modelValue"
        />
    </li>
</template>
