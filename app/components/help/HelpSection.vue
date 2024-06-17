<script setup>
    const props = defineProps({
        title: String
    });
</script>

<template>
    <div class="help-section">
        <h1 class="section-title">{{ title }}</h1>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .section-title {
        margin-block: 0.25em;
    }
</style>