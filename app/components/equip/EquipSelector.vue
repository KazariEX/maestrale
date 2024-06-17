<script setup>
    import equipTypeTable from "~~/data/constraint/equip-type";
    import nationalityTable from "~~/data/constraint/nationality";
    import rarityTable from "~~/data/constraint/rarity";
    import equip_data_statistics from "~~/data/ShareCfg(VVVIP)/equip_data_statistics.json";
    import equip_data_template from "~~/data/ShareCfg(VVVIP)/equip_data_template.json";

    const equipSelectorStore = useEquipSelectorStore();

    const equipTypeOptions = useConstraintOptions(equipTypeTable, { total: true });
    const nationalityOptions = useConstraintOptions(nationalityTable, { total: true });
    const rarityOptions = useConstraintOptions(rarityTable, { total: true });

    //筛选ID
    const ids = Object.entries(equip_data_template)
        .filter(([id, item]) => item.prev === 0)
        .map(([id, item]) => id);

    //获取数据体
    const data = {};
    for (const id of ids) {
        const stat = equip_data_statistics[id];
        const temp = equip_data_template[id];
        data[id] = {
            stat,
            temp
        };
    }

    const filter = ref({
        rarity: 0,
        type: 0,
        nationality: 0
    });

    //关闭抽屉时
    function onClose() {
        equipSelectorStore.resolve(0);
    }

    //卸下装备
    function removeEquip() {
        equipSelectorStore.resolve(-1);
        equipSelectorStore.close();
    }

    //选择装备，返回ID
    function selectEquip(id) {
        equipSelectorStore.resolve(id);
        equipSelectorStore.close();
    }
</script>

<template>
    <el-drawer
        v-model="equipSelectorStore.openState"
        title="选择装备"
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
                <el-form-item label="类型">
                    <el-select v-model="filter.type">
                        <el-option
                            v-for="item in equipTypeOptions"
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
                <a class="selector-remove" @click="removeEquip">
                    <el-icon><Delete /></el-icon>
                </a>
                <template v-for="({ stat, temp }, id) in data" :key="id">
                    <div v-show="
                        equipSelectorStore.curShip.equipSlotTypes[equipSelectorStore.curSlot].includes(stat.type) &&
                        !temp.ship_type_forbidden.includes(equipSelectorStore.curShip.type) &&
                        (filter.rarity === 0 || (stat.rarity === 1 && filter.rarity === 2) || stat.rarity === filter.rarity) &&
                        (filter.type === 0 || stat.type === filter.type) &&
                        (filter.nationality === 0 || stat.nationality === filter.nationality)"
                        class="selector-item"
                        :title="stat.name"
                        @click="selectEquip(id)"
                        ><div :style="useRarityStyle(() => stat.rarity).backgroundStyle.value">
                            <nuxt-img
                                class="selector-icon"
                                loading="lazy"
                                :src="`/image/artresource/atlas/equips/${stat.icon}.png`"
                            />
                        </div>
                        <span class="name">{{ stat.name }}</span>
                    </div>
                </template>
            </div>
        </div>
    </el-drawer>
</template>

<style lang="scss" scoped>
    .selector-icon {
        margin: auto;
    }
</style>