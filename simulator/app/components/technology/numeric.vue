<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
    }>();
</script>

<template>
    <li grid="~ cols-2" text="center">
        <span>{{ label }}：</span>
        <span>{{ value }}</span>
    </li>
</template>
