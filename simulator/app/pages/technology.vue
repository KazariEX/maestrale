<script lang="ts" setup>
    import type { ShipType } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";
    import { shipTypeOptions } from "~/data/constraint/ship-type";

    useHead({
        title: "舰队科技"
    });

    const technology = useTechnology();

    const options = shipTypeOptions
        .filter(({ value }) => ![20, 21, 23, 24].includes(value))
        .map((option) => {
            return option.value === 22 ? {
                label: "风帆",
                value: 22
            } : option;
        });

    const currentShipType = ref<ShipType>(1);
</script>

<template>
    <prime-select-button
        size="small"
        :options
        option-label="label"
        option-value="value"
        :allow-empty="false"
        v-model="currentShipType"
    />
    <ul grid="~ gap-4" m="t-8 x-auto" max-w="120">
        <ship-strengthen-item
            v-for="(_, attr) in technology.maxAttrs[1]"
            :label="attributeMap[attr]"
            :max="technology.maxAttrs[currentShipType]![attr]"
            v-model="technology.attrs.value[currentShipType]![attr]"
        />
    </ul>
</template>