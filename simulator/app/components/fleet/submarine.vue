<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base label="潜艇编队" v-model="fleetStore.submarine">
        <fleet-group
            type="submarine"
            :items="[
                {
                    key: `submarine2`,
                    role: `僚舰`,
                    order: 2,
                },
                {
                    key: `submarine1`,
                    role: `旗舰`,
                    order: 1,
                },
                {
                    key: `submarine3`,
                    role: `僚舰`,
                    order: 3,
                },
            ]"
            v-model="fleetStore.submarine.currentFleet"
        />
    </fleet-base>
</template>
