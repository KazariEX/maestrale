<script lang="ts" setup>
    useHead({
        title: "斩杀率",
    });
</script>

<template>
    <div max-w="180" m="x-auto">
        <div flex="~ gap-(row-4 col-12) lt-sm:col" m="b-4">
            <excalc-power />
            <excalc-main />
        </div>
        <excalc-buki />
    </div>
</template>
