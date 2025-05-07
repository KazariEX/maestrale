<script lang="ts" setup>
    defineProps<{
        title: string;
        desc?: string;
    }>();
</script>

<template>
    <li
        flex="~ items-center gap-4"
        h="16"
        b-b="~ solid border"
    >
        <div m="r-auto">
            <span leading="normal">{{ title }}</span>
            <p text="xs slate">{{ desc }}</p>
        </div>
        <slot></slot>
    </li>
</template>
