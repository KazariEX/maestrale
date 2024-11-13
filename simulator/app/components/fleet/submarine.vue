<script lang="ts" setup>
    const fleetStore = useFleetStore();

    const options = computed(() => {
        return fleetStore.submarineFleets.map(({ name }, i) => ({
            label: name,
            value: i
        }));
    });
</script>

<template>
    <fleet-base
        :options
        :remove-disabled="fleetStore.submarineFleets.length <= 1"
        v-model="fleetStore.currentSubmarineIdx"
        @add="fleetStore.addSubmarineFleet"
        @remove="fleetStore.removeSubmarineFleet"
    >
        <div grid="~ gap-2">
            <ship-card fleet="submarine" v-model="fleetStore.currentSubmarineFleet.submarine1"/>
            <ship-card fleet="submarine" v-model="fleetStore.currentSubmarineFleet.submarine2"/>
            <ship-card fleet="submarine" v-model="fleetStore.currentSubmarineFleet.submarine3"/>
        </div>
    </fleet-base>
</template>