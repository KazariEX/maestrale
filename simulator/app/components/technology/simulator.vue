<script lang="ts" setup>
    import { ShareCfg } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";
    import { nationalityMap } from "~/data/constraint/nationality";
    import type { AchieveAdditional, AchieveItem, AchievePhase } from "~/types/technology";

    const technology = useTechnologyStore();

    interface ClassData extends ShareCfg.FleetTechShipClass {
        id: string;
        nationality: string;
    }

    interface ShipData {
        item: AchieveItem;
        additional: AchieveAdditional;
    }

    const expendedClasses = ref<ClassData[]>([]);
    const filteredClasses = computed<ClassData[]>(() => {
        return Object.entries(ShareCfg.fleet_tech_ship_class)
            .filter(([, item]) => item.shiptype === technology.currentShipType)
            .map(([id, item]) => ({
                id,
                ...item,
                nationality: nationalityMap[item.nation],
            }));
    });

    const selectedData = ref<ShipData[]>([]);
    const expendedData = computed<ShipData[]>(() => {
        return technology.achieveItems.map((item) => ({
            item,
            additional: technology.getAdditional(item)!,
        }));
    });

    watch(() => technology.currentShipType, () => {
       selectedData.value = [];
    });

    function toggle(id: number, phase: AchievePhase) {
        const item = technology.achieveItems.find((item) => {
            return item.id === id;
        })!;
        const value = item[phase];

        if (selectedData.value.some((data) => data.item === item)) {
            for (const { item } of selectedData.value) {
                update(item);
            }
        }
        else {
            update(item);
        }

        function update(item: AchieveItem) {
            item[phase] = !value;
            if (phase === "get") {
                if (value) {
                    item.upgrage = false;
                    item.level = false;
                }
            }
            else if (!value) {
                item.get = true;
            }
        }
    }
</script>

<template>
    <div flex="~ items-start gap-8" m="t-4" p="x-2">
        <ul grid="~ gap-4" m="t-3">
            <technology-numeric
                p="b-4"
                b-b="~ solid $p-datatable-border-color"
                label="科技"
                :model-value="technology.point"
            />
            <technology-numeric
                v-for="(_, attr) in technology.maxAttrs[1]"
                :label="attributeMap[attr]"
                v-model="technology.simulatedAttrs[technology.currentShipType][attr]"
            />
        </ul>
        <prime-data-table
            flex="1"
            :value="filteredClasses"
            data-key="id"
            scrollable
            scroll-height="844px"
            sort-mode="multiple"
            v-model:expanded-rows="expendedClasses"
        >
            <prime-column expander header-style="width: 0;"/>
            <prime-column header="舰级" header-style="width: 25%;" field="name" sortable>
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </prime-column>
            <prime-column header="阵营" header-style="width: 20%" field="nation" sortable>
                <template #body="{ data }">
                    {{ data.nationality }}
                </template>
            </prime-column>
            <prime-column header="Tier" field="t_level" sortable>
                <template #body="{ data }">
                    T{{ data.t_level }}
                </template>
            </prime-column>
            <template #expansion="props">
                <prime-data-table
                    m="b-4"
                    :value="expendedData.filter(({ item }) => props.data.ships.includes(item.id))"
                    data-key="item.id"
                    selection-mode="multiple"
                    v-model:selection="selectedData"
                >
                    <prime-column header="舰船">
                        <template #body="{ data }">
                            <technology-ship v-bind="data"/>
                        </template>
                    </prime-column>
                    <prime-column header="获得" header-style="width: 25%;">
                        <template #body="{ data }">
                            <technology-cell phase="get" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                    <prime-column header="LV.120" header-style="width: 25%;">
                        <template #body="{ data }">
                            <technology-cell phase="level" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                    <prime-column header="满星" header-style="width: 10%;">
                        <template #body="{ data }">
                            <technology-cell phase="upgrage" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                </prime-data-table>
            </template>
        </prime-data-table>
    </div>
</template>
