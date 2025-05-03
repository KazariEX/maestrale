<script lang="ts" setup>
    import type { Attributes } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";
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
            case FleetAttrFlag.Tech: return "text-orange-500";
            case FleetAttrFlag.Commander: return "text-purple-500";
            default: return "text-red-500";
        }
    });

    const value = computed(() => {
        return attr && ship.value ? Math.floor(ship.value[attr].value) : "";
    });

    const equipValue = computed(() => {
        return isGeneralAttr(attr)
            && ship.value?.equipAttrs.value[attr]
            || 0;
    });

    const techValue = computed(() => {
        return isGeneralAttr(attr)
            && ship.value?.techAttrs.value[attr]
            || 0;
    });

    const commanderValue = computed(() => {
        return isGeneralAttr(attr)
            && ship.value?.commanderAttrs.value[attr]
            || 0;
    });

    const additionalValue = computed(() => {
        let value = 0;
        if (fleetStore.attrFlag & FleetAttrFlag.Equip) {
            value += equipValue.value;
        }
        if (fleetStore.attrFlag & FleetAttrFlag.Tech) {
            value += techValue.value;
        }
        if (fleetStore.attrFlag & FleetAttrFlag.Commander) {
            value += commanderValue.value;
        }
        return value;
    });

    function isGeneralAttr(attr: string | undefined): attr is keyof Attributes {
        return attr !== void 0 && !["ammo", "oil", "oxy_max"].includes(attr);
    }
</script>

<template>
    <li
        flex="~ gap-1"
        h="7"
        bg="slate-500/20"
        leading="7"
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
