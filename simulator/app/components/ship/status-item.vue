<script lang="ts" setup>
    import type { Attributes } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";

    const { attr, label, icon } = defineProps<{
        attr?: keyof typeof attributeMap;
        label?: string;
        icon?: string;
    }>();

    const fleetStore = useFleetStore();
    const { currentShip: ship } = storeToRefs(fleetStore);

    const colors = {
        equips: "text-green-600",
        tech: "text-orange-500",
        commanders: "text-purple-500",
    };

    const src = computed(() => {
        return `/assets/prefab/variantplatform/${icon ?? attr}.png`;
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
        return fleetStore.attrMode === "equips" && equipValue.value
            || fleetStore.attrMode === "tech" && techValue.value
            || fleetStore.attrMode === "commanders" && commanderValue.value;
    });

    function isGeneralAttr(attr: string | undefined): attr is keyof Attributes {
        return attr !== void 0 && !["ammo", "oil", "oxy_max"].includes(attr);
    }
</script>

<template>
    <li
        flex="~ gap-1"
        h="7"
        bg="slate op-33"
        leading="7"
    >
        <i
            grid="~ place-items-center"
            w="7"
            bg="slate op-80"
        >
            <nuxt-img w="6" max-h="7" :src/>
        </i>
        <span>{{ label ?? (attr ? attributeMap[attr] : "") }}</span>
        <span m="l-auto r-1">
            <span>{{ value }}</span>
            <span
                v-if="additionalValue"
                :class="colors[fleetStore.attrMode]"
            >{{ (additionalValue > 0 ? "+" : "") + additionalValue }}</span>
        </span>
    </li>
</template>
