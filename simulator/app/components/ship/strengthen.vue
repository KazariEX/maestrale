<script lang="ts" setup>
    import { StrengthenType } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";

    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const attrs = ["cannon", "torpedo", "air", "reload"] as const;
</script>

<template>
    <ul grid="~ gap-4">
        <template v-if="ship?.strengthen.type === StrengthenType.General">
            <ship-strengthen-item
                v-for="attr in attrs"
                :label="attributeMap[attr]"
                :max="ship.strengthen.maxAttrs[attr]"
                v-model="ship.strengthen.attrs.value[attr]"
            />
        </template>
        <template v-else-if="ship?.strengthen.type === StrengthenType.Blueprint">
            <ship-strengthen-item
                label="蓝图"
                :max="ship.strengthen.blueprintMax1"
                v-model="ship.strengthen.blueprint1.value"
            />
            <ship-strengthen-item
                label="天运"
                :max="ship.strengthen.blueprintMax2"
                v-model="ship.strengthen.blueprint2.value"
            />
        </template>
    </ul>
</template>