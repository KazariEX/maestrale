<script lang="ts" setup>
    defineProps<{
        title?: string;
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();

    useEventListener("keyup", (event) => {
        if (event.key === "Escape") {
            emit("close");
        }
    });
</script>

<template>
    <transition>
        <div
            v-if="isOpening"
            class="libeccio-dialog"
            position="fixed inset-0"
            size="fit"
            m="auto"
            p="x-6 y-4"
            b="rounded-xl"
            bg="background"
        >
            <header grid="~ cols-[1fr_auto]">
                <h2 text="4 slate-600 dark:slate-300">{{ title }}</h2>
                <button
                    size="5"
                    text="5 slate @hover:primary"
                    @click="emit(`close`)"
                >
                    <iconify name="fa6-solid:xmark"/>
                </button>
            </header>
            <slot></slot>
        </div>
    </transition>
</template>

<style lang="scss">
    .libeccio-dialog {
        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
            scale: 0.66;
        }
    }
</style>
