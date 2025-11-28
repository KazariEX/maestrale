<template>
    <main
        p="x-4 y-8"
        lg:p="l-22"
        lt-lg:p="b-16"
    >
        <slot></slot>
    </main>
    <maestrale-navbar />
    <maestrale-overlay />
    <maestrale-dialog />
</template>
