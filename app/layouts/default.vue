<template>
    <MaeNavbar />
    <main class="mae-main">
        <slot></slot>
    </main>
    <ShipSelector />
    <EquipSelector />
    <SpweaponSelector />
</template>

<style lang="scss">
    .mae-main {
        --pd: 2em;

        overflow: auto;
        width: 100vw;
        padding-block: 2em calc(4em + var(--pd));
    }

    .mae-navbar {
        z-index: 64;
    }

    @media (width < 1024px) {
        .mae-main {
            padding-inline: 0.5em;
        }
    }
</style>