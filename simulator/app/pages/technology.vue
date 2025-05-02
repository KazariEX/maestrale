<script lang="ts" setup>
    import { shipTypeTechOptions } from "~/data/constraint/ship-type";

    useHead({
        title: "舰队科技",
    });

    const technology = useTechnologyStore();

    const modeOptions = [
        {
            label: "控制器",
            value: "controller",
        },
        {
            label: "模拟器",
            value: "simulator",
        },
    ];
</script>

<template>
    <div flex="~ wrap justify-center gap-4">
        <prime-select-button
            size="small"
            :options="modeOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            v-model="technology.mode"
        />
        <prime-select-button
            flex="wrap justify-center gap-row-2"
            size="small"
            :options="shipTypeTechOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            v-model="technology.currentShipType"
        />
    </div>
    <keep-alive>
        <technology-controller v-if="technology.mode === `controller`"/>
        <technology-simulator v-else/>
    </keep-alive>
</template>
