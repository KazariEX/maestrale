<script lang="ts" setup>
    import { shipTypeTechOptions } from "~/data/constants/ship-type";

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
    <div
        :class="{
            [`h-[calc(100vh-4rem)] lt-lg:h-[calc(100vh-8rem)]`]: technology.mode === `simulator`,
        }"
        grid="~ rows-[auto_1fr]"
        w="fit"
        m="x-auto"
    >
        <div flex="~ gap-6" text="nowrap">
            <prime-select-button
                grid="~ cols-2"
                w="40"
                size="small"
                :options="modeOptions"
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
        </div>
        <technology-controller v-if="technology.mode === `controller`"/>
        <technology-simulator v-else/>
    </div>
</template>
