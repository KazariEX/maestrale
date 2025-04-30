<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
    }>();
</script>

<template>
    <li>
        <span text="slate">{{ label }}：</span>
        <span>{{ value }}</span>
    </li>
</template>
