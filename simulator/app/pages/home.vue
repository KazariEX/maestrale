<script lang="ts" setup>
    import { createShip } from "maestrale";

    definePageMeta({
        alias: "/"
    });

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    fleetStore.vanguard1 = createShip(60104, {
        technology
    });
</script>

<template>
    <div grid="~ gap-2">
        <ship-card fleet="main" v-model="fleetStore.main1"/>
        <ship-card fleet="main" v-model="fleetStore.main2"/>
        <ship-card fleet="main" v-model="fleetStore.main3"/>
        <ship-card fleet="vanguard" v-model="fleetStore.vanguard1"/>
        <ship-card fleet="vanguard" v-model="fleetStore.vanguard2"/>
        <ship-card fleet="vanguard" v-model="fleetStore.vanguard3"/>
    </div>
</template>