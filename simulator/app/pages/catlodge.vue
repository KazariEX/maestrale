<script lang="ts" setup>
    useHead({
        title: "指挥喵",
    });
</script>

<template>
    <div flex="~ gap-8 lt-md:col" w="fit" m="x-auto">
        <commander-panel />
        <commander-nest />
    </div>
</template>
