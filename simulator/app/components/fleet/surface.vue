<script lang="ts" setup>
    const fleetStore = useFleetStore();
</script>

<template>
    <fleet-base v-slot="{ fleet }" label="水面编队" v-model="fleetStore.surface">
        <fleet-group
            :fleet
            type="main"
            :items="[
                {
                    key: `main1`,
                    role: `僚舰`
                },
                {
                    key: `main2`,
                    role: `旗舰`
                },
                {
                    key: `main3`,
                    role: `僚舰`
                }
            ]"
        />
        <fleet-group
            :fleet
            type="vanguard"
            :items="[
                {
                    key: `vanguard1`,
                    role: `领舰`
                },
                {
                    key: `vanguard2`,
                    role: `中位`
                },
                {
                    key: `vanguard3`,
                    role: `尾舰`
                }
            ]"
        />
    </fleet-base>
</template>