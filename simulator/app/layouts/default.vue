<template>
    <main p="x-4 y-8 lg:l-22 lt-lg:b-16">
        <slot></slot>
    </main>
    <maestrale-navbar />
    <bikariya-modals />
</template>

<style lang="scss">
    .bikariya-overlay {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
