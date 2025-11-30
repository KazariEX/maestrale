<script lang="ts" setup>
    import { shipTypeTechOptions } from "~/data/constants/ship-type";

    useHead({
        title: "舰队科技",
    });

    const technology = useTechnologyStore();

    const options = [
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
    <div
        grid="~ rows-[auto_1fr] cols-[auto_1fr] gap-(row-4 col-6)"
        w="fit"
        h="[calc(100vh-4rem)] lt-lg:[calc(100vh-8rem)]"
        m="x-auto"
    >
        <prime-select-button
            grid="~ cols-2"
            w="40"
            size="small"
            :options
            option-label="label"
            option-value="value"
            :allow-empty="false"
            v-model="technology.mode"
        />
        <prime-tabs v-model:value="technology.currentShipType">
            <prime-tab-list>
                <prime-tab
                    v-for="{ label, value } in shipTypeTechOptions"
                    p="x-4"
                    :value
                >{{ label }}</prime-tab>
            </prime-tab-list>
        </prime-tabs>
        <technology-controller v-if="technology.mode === `controller`"/>
        <technology-simulator v-else/>
    </div>
</template>
