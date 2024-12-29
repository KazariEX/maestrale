<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base label="水面编队" v-model="fleetStore.surface">
        <fleet-group
            type="main"
            :items="[
                {
                    key: `main2`,
                    role: `僚舰`,
                    order: 2
                },
                {
                    key: `main1`,
                    role: `旗舰`,
                    order: 1
                },
                {
                    key: `main3`,
                    role: `僚舰`,
                    order: 3
                }
            ]"
            v-model="fleetStore.surface.currentFleet"
        />
        <fleet-group
            type="vanguard"
            :items="[
                {
                    key: `vanguard1`,
                    role: `领舰`,
                    order: 1
                },
                {
                    key: `vanguard2`,
                    role: `中位`,
                    order: 2
                },
                {
                    key: `vanguard3`,
                    role: `尾舰`,
                    order: 3
                }
            ]"
            v-model="fleetStore.surface.currentFleet"
        />
    </fleet-base>
</template>