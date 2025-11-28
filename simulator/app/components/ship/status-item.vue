<script lang="ts" setup>
    import type { Attributes } from "maestrale";
    import { attributeMap } from "~/data/constants/attribute";
    import { FleetAttrFlag } from "~/types/fleet";

    const { attr, label, icon } = defineProps<{
        attr?: keyof typeof attributeMap;
        label?: string;
        icon?: string;
    }>();

    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const src = computed(() => {
        return `/assets/prefab/variantplatform/${icon ?? attr}.png`;
    });

    const color = computed(() => {
        switch (fleetStore.attrFlag) {
            case FleetAttrFlag.Equip: return "text-green-600";
            case FleetAttrFlag.Technology: return "text-orange-500";
            case FleetAttrFlag.Commander: return "text-purple-500";
            default: return "text-red-500";
        }
    });

    const value = computed(() => {
        return attr && ship.value ? Math.floor(ship.value[attr].value) : "";
    });

    const equipValue = computed(() => {
        return ship.value?.equipAttrs.value[attr as keyof Attributes] ?? 0;
    });

    const technologyValue = computed(() => {
        return ship.value?.techAttrs.value[attr as keyof Attributes] ?? 0;
    });

    const commanderValue = computed(() => {
        return ship.value?.commanderAttrs.value[attr as keyof Attributes] ?? 0;
    });

    const additionalValue = computed(() => {
        let value = 0;
        if (fleetStore.attrFlag & FleetAttrFlag.Equip) {
            value += equipValue.value;
        }
        if (fleetStore.attrFlag & FleetAttrFlag.Technology) {
            value += technologyValue.value;
        }
        if (fleetStore.attrFlag & FleetAttrFlag.Commander) {
            value += commanderValue.value;
        }
        return value;
    });
</script>

<template>
    <li
        flex="~ gap-1"
        h="7"
        bg="slate-500/20"
        leading="loose"
    >
        <i
            grid="~ place-items-center"
            w="7"
            bg="slate-500/40"
        >
            <nuxt-img w="6" max-h="7" :src/>
        </i>
        <span>{{ label ?? (attr ? attributeMap[attr] : "") }}</span>
        <span m="l-auto r-1">
            <span>{{ value }}</span>
            <span v-if="additionalValue" :class="color">
                {{ (additionalValue > 0 ? "+" : "") + additionalValue }}
            </span>
        </span>
    </li>
</template>
