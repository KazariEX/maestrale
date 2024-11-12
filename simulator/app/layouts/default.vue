<template>
    <main
        overflow="x-auto"
        w="fit"
        max-w="full"
        m="x-auto"
        p="t-8 x-4 b-24"
    >
        <slot></slot>
    </main>
    <mae-navbar />
    <mae-overlay />
    <mae-modal />
</template>