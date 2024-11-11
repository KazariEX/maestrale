<script lang="ts" setup>
    import { createShip } from "maestrale";

    definePageMeta({
        alias: "/"
    });

    useHead({
        title: "编队"
    });

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    const maestrale = createShip(60104, {
        technology
    });

    fleetStore.vanguard1 = maestrale;
    fleetStore.setCurrentShip(maestrale);

    const infoModeOptions = [
        { label: "舰船详情", value: "details" },
        { label: "装备列表", value: "equips" }
    ];
</script>

<template>
    <div grid="~ gap-8">
        <prime-select-button
            m="x-auto"
            size="small"
            :options="infoModeOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            v-model="fleetStore.infoMode"
        />
        <div flex="~ gap-8">
            <div grid="~ gap-8" w="121.5">
                <div grid="~ gap-2">
                    <ship-card fleet="main" v-model="fleetStore.main1"/>
                    <ship-card fleet="main" v-model="fleetStore.main2"/>
                    <ship-card fleet="main" v-model="fleetStore.main3"/>
                </div>
                <div grid="~ gap-2">
                    <ship-card fleet="vanguard" v-model="fleetStore.vanguard1"/>
                    <ship-card fleet="vanguard" v-model="fleetStore.vanguard2"/>
                    <ship-card fleet="vanguard" v-model="fleetStore.vanguard3"/>
                </div>
            </div>
            <div grid="~ gap-8 content-start" w="121.5">
                <equip-list v-model="fleetStore.currentShip"/>
                <ship-status />
                <prime-tabs v-model:value="fleetStore.panelTab">
                    <prime-tab-list>
                        <prime-tab value="strengthen">强化</prime-tab>
                        <prime-tab value="transform" :disabled="!fleetStore.currentShip?.canTransform()">改造</prime-tab>
                    </prime-tab-list>
                    <prime-tab-panels>
                        <prime-tab-panel value="strengthen">
                            <ship-strengthen />
                        </prime-tab-panel>
                        <prime-tab-panel value="transform">
                            <ship-transform />
                        </prime-tab-panel>
                    </prime-tab-panels>
                </prime-tabs>
            </div>
        </div>
    </div>
</template>