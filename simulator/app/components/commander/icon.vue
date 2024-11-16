<script lang="ts" setup>
    defineProps<{
        icon: string;
    }>();
</script>

<template>
    <nuxt-img h="16" m="x-auto" :src="icon"/>
</template>