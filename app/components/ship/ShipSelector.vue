<script setup>
    import nationalityTable from "~~/data/constraint/nationality";
    import rarityTable from "~~/data/constraint/rarity";
    import shipTypeTable from "~~/data/constraint/ship-type";
    import ship_data_statistics from "~~/data/ShareCfg(VVVIP)/ship_data_statistics.json";
    import ship_skin_template from "~~/data/ShareCfg(VVVIP)/ship_skin_template.json";

    const shipSelectorStore = useShipSelectorStore();

    const nationalityOptions = useConstraintOptions(nationalityTable, { total: true });
    const rarityOptions = useConstraintOptions(rarityTable, { total: true });
    const shipTypeOptions = useConstraintOptions(shipTypeTable, { total: true });

    //筛选ID
    const ids = new Set(
        Object.keys(ship_data_statistics)
        .map((id) => id.slice(0, id.length - 1))
        .filter((id) => !id.startsWith("900"))
    );

    //获取数据体
    const statis = {};
    for (const id of ids) {
        const obj = ship_data_statistics[id + "1"];
        if (obj !== void(0)) {
            statis[id] = obj;
        }
    }

    const filter = ref({
        rarity: 0,
        type: 0,
        nationality: 0
    });

    //关闭抽屉时
    function onClose() {
        shipSelectorStore.resolve(0);
    }

    //移除舰娘
    function removeShip() {
        shipSelectorStore.resolve(-1);
        shipSelectorStore.close();
    }

    //选择舰娘，返回ID
    function selectShip(id) {
        shipSelectorStore.resolve(id);
        shipSelectorStore.close();
    }
</script>

<template>
    <el-drawer
        v-model="shipSelectorStore.openState"
        title="选择舰船"
        size="520px"
        @close="onClose"
        ><div class="mae-selector">
            <el-form class="selector-filter" label-position="top">
                <el-form-item label="稀有度">
                    <el-select v-model="filter.rarity">
                        <el-option
                            v-for="item in rarityOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="舰种">
                    <el-select v-model="filter.type">
                        <el-option
                            v-for="item in shipTypeOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="阵营">
                    <el-select v-model="filter.nationality">
                        <el-option
                            v-for="item in nationalityOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="selector-list">
                <a class="selector-remove" @click="removeShip">
                    <el-icon><Delete /></el-icon>
                </a>
                <template v-for="(item, id) in statis" :key="id">
                    <div v-show="
                        shipSelectorStore.curTypes.includes(item.type) &&
                        (filter.rarity === 0 || item.rarity === filter.rarity) &&
                        (filter.type === 0 || item.type === filter.type) &&
                        (filter.nationality === 0 || item.nationality === filter.nationality)"
                        class="selector-item"
                        :title="item.name"
                        @click="selectShip(id)"
                        ><div :style="useRarityStyle(() => item.rarity).backgroundStyle.value">
                            <nuxt-img
                                class="selector-icon"
                                loading="lazy"
                                :src="`/image/artresource/atlas/squareicon/${
                                    ship_skin_template[id + `0`].painting
                                }.png`"
                            />
                        </div>
                        <span class="name">{{ item.name }}</span>
                    </div>
                </template>
            </div>
        </div>
    </el-drawer>
</template>

<style lang="scss">
    .mae-selector {
        display: grid;
        grid-template-rows: auto 1fr;
        max-height: calc(100% + 40px);
        margin: -20px;
        padding-left: 20px;
    }

    .selector-filter, .selector-list {
        gap: 16px;
        overflow: auto;
        padding-right: 20px;
        scrollbar-gutter: stable;
    }

    .selector-filter {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    .selector-list {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        justify-items: center;
        gap: 16px;
        padding-bottom: 20px;
        font-size: 14px;
    }

    .selector-remove {
        display: flex;
        width: 64px;
        aspect-ratio: 1;
        padding: 7px;
        border: 1px solid var(--el-border-color);
        font-size: 48px;
    }

    .selector-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 64px;
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }

        > div {
            display: flex;
            height: 64px;
        }

        .name {
            overflow: hidden;
            font-size: 12px;
            text-align: center;
            text-overflow: ellipsis;
            text-wrap: nowrap;
        }
    }

    .selector-icon {
        max-width: 100%;
        max-height: 100%;
    }
</style>