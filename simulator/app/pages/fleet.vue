<script lang="ts" setup>
    definePageMeta({
        alias: "/"
    });

    useHead({
        title: "编队"
    });

    const fleetStore = useFleetStore();

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
        <div flex="~ gap-8 lt-lg:col">
            <div grid="~ gap-8" w="121.5">
                <fleet-surface />
                <fleet-submarine />
            </div>
            <div
                grid="~ gap-8 content-start"
                position="sticky top-8"
                w="121.5"
                h="fit"
            >
                <equip-list v-model="fleetStore.currentShip"/>
                <ship-status />
                <prime-tabs v-model:value="fleetStore.panelTab">
                    <prime-tab-list>
                        <prime-tab value="strengthen">强化</prime-tab>
                        <prime-tab value="transform" :disabled="!fleetStore.currentShip?.transform">改造</prime-tab>
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