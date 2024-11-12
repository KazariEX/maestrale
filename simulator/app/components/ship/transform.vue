<script lang="ts" setup>
    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);
</script>

<template>
    <ul
        v-if="ship?.canTransform()"
        grid="~ rows-3 cols-6 gap-1"
    >
        <template v-for="rows, col in ship.transformMatrix">
            <ship-transform-item
                v-for="templates, row in rows"
                :style="{ gridRowStart: row + 1, gridColumnStart: col + 1 }"
                :templates
            />
        </template>
    </ul>
</template>