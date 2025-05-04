<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
    }>();
</script>

<template>
    <li flex="~ items-center gap-4">
        <span>{{ label }}</span>
        <prime-input-number
            input-class="w-23 text-center"
            size="small"
            readonly
            :use-grouping="false"
            :model-value="value"
        />
    </li>
</template>
