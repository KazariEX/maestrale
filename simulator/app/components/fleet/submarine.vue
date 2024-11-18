<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base v-slot="{ fleet }" label="潜艇编队" v-model="fleetStore.submarine">
        <div grid="~ gap-2">
            <ship-card fleet="submarine" v-model="fleet.submarine1.value"/>
            <ship-card fleet="submarine" v-model="fleet.submarine2.value"/>
            <ship-card fleet="submarine" v-model="fleet.submarine3.value"/>
        </div>
    </fleet-base>
</template>