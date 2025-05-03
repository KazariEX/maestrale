<script lang="ts" setup>
    import { armorMap } from "~/data/constraint/armor";
    import { FleetAttrFlag } from "~/types/fleet";

    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const armorLabel = computed(() => {
        return ship.value ? armorMap[ship.value.armor.value] : "";
    });

    const isSubmarine = computed(() => {
        return ship.value ? [8, 17, 22].includes(ship.value.type.value) : false;
    });

    const attrFlagOptions = [
        { label: "装备", value: FleetAttrFlag.Equip },
        { label: "科技", value: FleetAttrFlag.Tech },
        { label: "猫", value: FleetAttrFlag.Commander },
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
        <li grid="row-end-6" flex="~ justify-end items-center gap-2.5">
            <label v-for="{ label, value } in attrFlagOptions" cursor="pointer">
                <prime-checkbox
                    size="small"
                    binary
                    :model-value="!!(fleetStore.attrFlag & value)"
                    @update:model-value="fleetStore.attrFlag ^= value"
                />
                <span p="l-1">{{ label }}</span>
            </label>
        </li>
    </ul>
</template>
