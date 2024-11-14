<script lang="ts" setup>
    defineProps<{
        title?: string;
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();
</script>

<template>
    <transition>
        <div
            v-if="isOpening"
            class="lib-dialog"
            position="fixed inset-0"
            size="fit"
            m="auto"
            p="x-6 y-4"
            b="rounded-xl"
            bg="white"
        >
            <header flex="~ justify-between">
                <h2 text="4 gray-600">{{ title }}</h2>
                <iconify
                    text="5 gray hover:primary"
                    cursor="pointer"
                    name="fa6-solid:xmark"
                    @click="emit(`close`)"
                />
            </header>
            <slot></slot>
        </div>
    </transition>
</template>

<style lang="scss">
    .lib-dialog {
        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
            scale: 0.66;
        }
    }
</style>