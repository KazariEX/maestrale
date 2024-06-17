<script setup>
    import armorTable from "~~/data/constraint/armor";

    const fleetStore = useFleetStore();
    const ship = storeToRefs(fleetStore).curShip;
</script>

<template>
    <div class="ship-status">
        <div class="attr-table">
            <ShipStatusItem attr-name="durability"/>
            <ShipStatusItem :title="armorTable[ship?.armor]" icon="armor"/>
            <ShipStatusItem attr-name="reload"/>
            <ShipStatusItem attr-name="cannon"/>
            <ShipStatusItem attr-name="torpedo"/>
            <ShipStatusItem attr-name="dodge"/>
            <ShipStatusItem attr-name="antiaircraft"/>
            <ShipStatusItem attr-name="air"/>
            <ShipStatusItem attr-name="hit"/>
            <template v-if="[8, 17, 22].includes(ship?.type)">
                <ShipStatusItem attr-name="oxy_max"/>
                <ShipStatusItem attr-name="ammo"/>
            </template>
            <template v-else>
                <ShipStatusItem attr-name="antisub"/>
            </template>
            <ShipStatusItem attr-name="speed" icon="attr_speed"/>
            <ShipStatusItem class="attr-last" attr-name="luck"/>
            <ShipStatusItem class="attr-last" attr-name="oil" icon="expend"/>
            <el-radio-group class="attr-last attr-switch" v-model="fleetStore.attrExtraMode" size="small">
                <el-radio-button :label="false">装备</el-radio-button>
                <el-radio-button :label="true">科技</el-radio-button>
            </el-radio-group>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .attr-table {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        font-size: 14px;
    }

    .attr-last {
        grid-row-start: 5;
    }

    .attr-switch {
        justify-self: right;
    }
</style>