<script lang="ts" setup>
    import type { Attributes } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";

    const { attr, label, icon } = defineProps<{
        attr?: keyof typeof attributeMap;
        label?: string;
        icon?: string;
    }>();

    const fleetStore = useFleetStore();
    const technologyStore = useTechnologyStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const src = computed(() => {
        return `/image/prefab/variantplatform/${icon ?? attr}.png`;
    });

    const value = computed(() => {
        return attr && ship.value ? Math.floor(ship.value[attr].value) : "";
    });

    const equipValue = computed(() => {
        return ship.value
            && attr
            && !["ammo", "oil", "oxy_max"].includes(attr)
                ? ship.value.equipAttrs.value[attr as keyof Attributes]
                : 0;
    });

    const techValue = computed(() => {
        return ship.value?.breakout.value === 4
            && attr
            && !["ammo", "luck", "speed", "oil", "oxy_max"].includes(attr)
                ? technologyStore.get(ship.value.type.value, attr as keyof Attributes)
                : 0;
    });
</script>

<template>
    <li
        flex="~ gap-1"
        h="7"
        bg="gray op-33"
        leading="7"
    >
        <i
            flex="~ justify-center"
            w="7"
            bg="gray op-80"
        >
            <nuxt-img w="6" max-h="7" m="y-auto" :src/>
        </i>
        <span>{{ label ?? (attr ? attributeMap[attr] : "") }}</span>
        <span m="l-auto r-1">
            <span>{{ value }}</span>
            <span
                v-if="fleetStore.attrMode === `equip` && equipValue > 0"
                text="green-600"
            >+{{ equipValue }}</span>
            <span
                v-else-if="fleetStore.attrMode === `tech` && techValue > 0"
                text="orange-500"
            >+{{ techValue }}
            </span>
        </span>
    </li>
</template>