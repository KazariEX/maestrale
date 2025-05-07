<script lang="ts" setup>
    const modalStore = useModalStore();

    const displayModals = computed(() => {
        return modalStore.modals.filter((ctx) => ctx.isOpening);
    });
</script>

<template>
    <transition-group>
        <div
            v-for="{ zIndex, close } in displayModals"
            :key="zIndex"
            class="mae-overlay"
            position="fixed inset-0"
            bg="black/50"
            :style="{ zIndex: zIndex - 1 }"
            @click="close()"
        ></div>
    </transition-group>
</template>

<style lang="scss">
    .mae-overlay {
        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
