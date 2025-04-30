<script lang="ts" setup>
    import { armorMap } from "~/data/constraint/armor";

    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const armorLabel = computed(() => {
        return ship.value ? armorMap[ship.value.armor.value] : "";
    });

    const isSubmarine = computed(() => {
        return ship.value ? [8, 17, 22].includes(ship.value.type.value) : false;
    });

    const attrModeOptions = [
        { label: "装备", value: "equips" },
        { label: "科技", value: "tech" },
        { label: "猫", value: "commanders" },
    ];
</script>

<template>
    <ul grid="~ cols-3 gap-2">
        <ship-status-item attr="durability"/>
        <ship-status-item :label="armorLabel" icon="armor"/>
        <ship-status-item attr="reload"/>
        <ship-status-item attr="cannon"/>
        <ship-status-item attr="torpedo"/>
        <ship-status-item attr="dodge"/>
        <ship-status-item attr="antiaircraft"/>
        <ship-status-item attr="air"/>
        <ship-status-item attr="hit"/>
        <template v-if="isSubmarine">
            <ship-status-item attr="oxy_max"/>
            <ship-status-item attr="ammo"/>
        </template>
        <template v-else>
            <ship-status-item attr="antisub"/>
        </template>
        <ship-status-item attr="speed" icon="attr_speed"/>
        <ship-status-item grid="row-start-5" attr="luck"/>
        <ship-status-item grid="row-start-5" attr="oil" icon="expend"/>
        <li grid="~ row-end-6 justify-end items-end">
            <prime-select-button
                m="t--1px"
                leading="4"
                size="small"
                :options="attrModeOptions"
                option-label="label"
                option-value="value"
                :allow-empty="false"
                v-model="fleetStore.attrMode"
            />
        </li>
    </ul>
</template>
