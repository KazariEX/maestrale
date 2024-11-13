<script lang="ts" setup>
    const fleetStore = useFleetStore();

    const options = computed(() => {
        return fleetStore.surfaceFleets.map(({ name }, i) => ({
            label: name,
            value: i
        }));
    });
</script>

<template>
    <fleet-base
        :options
        :remove-disabled="fleetStore.surfaceFleets.length <= 1"
        v-model="fleetStore.currentSurfaceIdx"
        @add="fleetStore.addSurfaceFleet"
        @remove="fleetStore.removeSurfaceFleet"
    >
        <div grid="~ gap-2">
            <ship-card fleet="main" v-model="fleetStore.currentSurfaceFleet.main1"/>
            <ship-card fleet="main" v-model="fleetStore.currentSurfaceFleet.main2"/>
            <ship-card fleet="main" v-model="fleetStore.currentSurfaceFleet.main3"/>
        </div>
        <div grid="~ gap-2">
            <ship-card fleet="vanguard" v-model="fleetStore.currentSurfaceFleet.vanguard1"/>
            <ship-card fleet="vanguard" v-model="fleetStore.currentSurfaceFleet.vanguard2"/>
            <ship-card fleet="vanguard" v-model="fleetStore.currentSurfaceFleet.vanguard3"/>
        </div>
    </fleet-base>
</template>