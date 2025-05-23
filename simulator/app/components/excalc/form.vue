<script lang="ts" setup>
    defineProps<{
        label: string;
    }>();
</script>

<template>
    <div flex="~ items-center gap-4">
        <span text="nowrap">{{ label }}</span>
        <slot></slot>
    </div>
</template>
