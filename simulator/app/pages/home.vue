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
    <div flex="~ gap-8">
        <div grid="~ gap-8">
            <div grid="~ gap-2">
                <ship-card fleet="main" v-model="fleetStore.main1"/>
                <ship-card fleet="main" v-model="fleetStore.main2"/>
                <ship-card fleet="main" v-model="fleetStore.main3"/>
            </div>
            <div grid="~ gap-2">
                <ship-card fleet="vanguard" v-model="fleetStore.vanguard1"/>
                <ship-card fleet="vanguard" v-model="fleetStore.vanguard2"/>
                <ship-card fleet="vanguard" v-model="fleetStore.vanguard3"/>
            </div>
        </div>
        <div grid="~ gap-8 content-start" w="120">
            <equip-list v-model="fleetStore.currentShip"/>
            <ship-status />
        </div>
    </div>
</template>