<script lang="ts" setup>
    const dialogStore = useDialogStore();
    const { dialogs } = storeToRefs(dialogStore);

    const filteredDialogs = computed(() => {
        return dialogs.value.filter((ctx) => ctx.isOpening.value);
    });
</script>

<template>
    <transition-group>
        <div
            v-for="{ zIndex, close } in filteredDialogs"
            :key="zIndex"
            class="maestrale-overlay"
            position="fixed inset-0"
            bg="black/50"
            :style="{ zIndex: zIndex - 1 }"
            @click="close()"
        ></div>
    </transition-group>
</template>

<style lang="scss">
    .maestrale-overlay {
        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
