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
                v-if="fleetStore.attrMode === `equips` && equipValue > 0"
                text="green-600"
            >+{{ equipValue }}</span>
            <span
                v-else-if="fleetStore.attrMode === `tech` && techValue > 0"
                text="orange-500"
            >+{{ techValue }}</span>
            <span
                v-else-if="fleetStore.attrMode === `commanders` && commanderValue > 0"
                text="purple-500"
            >+{{ commanderValue }}</span>
        </span>
    </li>
</template>