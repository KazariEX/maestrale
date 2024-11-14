<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base v-slot="{ fleet }" label="水面编队" v-model="fleetStore.surface">
        <div grid="~ gap-2">
            <ship-card fleet="main" v-model="fleet.main1"/>
            <ship-card fleet="main" v-model="fleet.main2"/>
            <ship-card fleet="main" v-model="fleet.main3"/>
        </div>
        <div grid="~ gap-2">
            <ship-card fleet="vanguard" v-model="fleet.vanguard1"/>
            <ship-card fleet="vanguard" v-model="fleet.vanguard2"/>
            <ship-card fleet="vanguard" v-model="fleet.vanguard3"/>
        </div>
    </fleet-base>
</template>