<script lang="ts" setup>
    import { ShareCfg } from "maestrale";
    import { attributeMap } from "~/data/constraint/attribute";
    import { nationalityMap } from "~/data/constraint/nationality";
    import type { AchieveAdditional, AchieveItem, AchievePhase } from "~/types/technology";

    const technology = useTechnologyStore();

    interface ClassData extends Omit<ShareCfg.FleetTechShipClass, "ships"> {
        id: string;
        nationality: string;
        ships: ShipData[];
    }

    interface ShipData {
        item: AchieveItem;
        additional: AchieveAdditional;
    }

    const selectedData = ref<ShipData[]>([]);
    const extendedData = computed<ShipData[]>(() => {
        return technology.achieveItems.map((item) => ({
            item,
            additional: technology.getAdditional(item)!,
        }));
    });

    const expendedClasses = ref<ClassData[]>([]);
    const filteredClasses = computed<ClassData[]>(() => {
        return Object.entries(ShareCfg.fleet_tech_ship_class)
            .filter(([, item]) => item.shiptype === technology.currentShipType)
            .map(([id, item]) => ({
                ...item,
                id,
                nationality: nationalityMap[item.nation],
                ships: extendedData.value.filter(({ item: { id } }) => item.ships.includes(id)),
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
    <div flex="~ items-start gap-4" m="t-4">
        <ul grid="~ gap-4" m="2">
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
            paginator
            :rows="12"
            scrollable
            scroll-height="727px"
            sort-mode="single"
            sort-field="t_level"
            :sort-order="-1"
            removable-sort
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
                <template #body="{ data }: { data: ClassData }">
                    <div flex="~ justify-between items-center">
                        <span>T{{ data.t_level }}</span>
                        <prime-avatar-group>
                            <prime-avatar
                                v-for="{ additional } in data.ships.slice(0, data.ships.length > 7 ? 6 : 7)"
                                :image="additional.icon"
                                shape="circle"
                            />
                            <prime-avatar
                                v-if="data.ships.length > 7"
                                p="r-1px"
                                text="xs slate"
                                :label="`+${data.ships.length - 6}`"
                                shape="circle"
                            />
                        </prime-avatar-group>
                    </div>
                </template>
            </prime-column>
            <template #expansion="props">
                <prime-data-table
                    m="b-4"
                    :value="props.data.ships"
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
