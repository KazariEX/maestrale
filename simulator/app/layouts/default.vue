<template>
    <main
        w="fit"
        m="x-auto"
        p="x-4 y-8"
        lg:p="l-22"
        lt-lg:p="b-16"
    >
        <slot></slot>
    </main>
    <mae-navbar />
    <mae-overlay />
    <mae-modal />
</template>
