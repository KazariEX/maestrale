<script setup>
    const fleetStore = useFleetStore();
    const ship = storeToRefs(fleetStore).curShip;
</script>

<template>
    <div class="ship-transform">
        <div class="transform-wrapper">
            <template v-for="(line, x) in ship.transformTable">
                <template v-for="(id, y) in line">
                    <ShipTransformItem
                        v-if="id"
                        :style="{ gridRowStart: y + 1, gridColumnStart: x + 1 }"
                        :id="id"
                        :template="ship.transformTemplate[id]"
                    />
                </template>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .transform-wrapper {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 4px;
    }
</style>