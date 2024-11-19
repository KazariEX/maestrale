<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base v-slot="{ fleet }" label="潜艇编队" v-model="fleetStore.submarine">
        <fleet-group
            :fleet
            type="submarine"
            :items="[
                {
                    key: `submarine1`,
                    role: `僚舰`
                },
                {
                    key: `submarine2`,
                    role: `旗舰`
                },
                {
                    key: `submarine3`,
                    role: `僚舰`
                }
            ]"
        />
    </fleet-base>
</template>