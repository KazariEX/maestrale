<script lang="ts" setup>
    import { createShip, ShareCfg } from "maestrale";

    useHead({
        link: [
            { rel: "icon", href: "/image/favicon.ico" }
        ],
        titleTemplate: "%s %separator 西北风模拟器",
        templateParams: {
            separator: "/"
        }
    });

    await ShareCfg.load();

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    const maestrale = createShip(60104, {
        technology
    });

    fleetStore.vanguard1 = maestrale;
    fleetStore.setCurrentShip(maestrale);
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>