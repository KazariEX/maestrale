<script lang="ts" setup>
    const modalStore = useModalStore();
    const { modals } = storeToRefs(modalStore);
</script>

<template>
    <template v-for="{ component, zIndex, isOpening } in modals" :key="zIndex">
        <component :is="component" :is-opening :style="{ zIndex }"/>
    </template>
</template>