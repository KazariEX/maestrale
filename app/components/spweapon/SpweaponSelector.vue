<script setup>
    import spweaponRarityTable from "~~/data/constraint/spweapon-rarity";
    import spweapon_data_statistics from "~~/data/ShareCfg(VVVIP)/spweapon_data_statistics.json";
    import spweapon_type from "~~/data/ShareCfg(VVVIP)/spweapon_type.json";

    const spweaponSelectorStore = useSpweaponSelectorStore();

    const rarityOptions = useConstraintOptions(spweaponRarityTable, { total: true });

    //筛选ID
    const ids = Object.entries(spweapon_data_statistics)
        .filter(([id, item]) => item.name)
        .map(([id, item]) => id);

    //获取数据体
    const statistics = {};
    for (const id of ids) {
        statistics[id] = spweapon_data_statistics[id];
    }

    const filter = ref({
        rarity: 0
    });

    //关闭抽屉时
    function onClose() {
        spweaponSelectorStore.resolve(0);
    }

    //卸下装备
    function removeSpweapon() {
        spweaponSelectorStore.resolve(-1);
        spweaponSelectorStore.close();
    }

    //选择装备，返回ID
    function selectSpweapon(id) {
        spweaponSelectorStore.resolve(id);
        spweaponSelectorStore.close();
    }
</script>

<template>
    <el-drawer
        v-model="spweaponSelectorStore.openState"
        title="选择兵装"
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
            </el-form>
            <div class="selector-list">
                <a class="selector-remove" @click="removeSpweapon">
                    <el-icon><Delete /></el-icon>
                </a>
                <template v-for="(stat, id) in statistics" :key="id">
                    <div v-show="
                        spweapon_type[stat.type].ship_type.includes(spweaponSelectorStore.curShip.type) &&
                        (stat.unique === 0 || stat.unique === spweaponSelectorStore.curShip.id) &&
                        (filter.rarity === 0 || stat.rarity === filter.rarity)"
                        class="selector-item"
                        :title="stat.name"
                        @click="selectSpweapon(id)"
                        ><div :style="useRarityStyle(() => stat.rarity + 1).backgroundStyle.value">
                            <nuxt-img
                                class="selector-icon"
                                loading="lazy"
                                :src="`/image/artresource/atlas/spweapon/${stat.icon}.png`"
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