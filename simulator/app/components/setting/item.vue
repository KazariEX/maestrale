<script lang="ts" setup>
    defineProps<{
        title: string;
        desc?: string;
    }>();
</script>

<template>
    <li
        flex="~ justify-between items-center gap-4"
        h="16"
        b-b="~ solid $p-content-border-color"
    >
        <div>
            <span leading="normal">{{ title }}</span>
            <p text="xs slate">{{ desc }}</p>
        </div>
        <slot></slot>
    </li>
</template>
