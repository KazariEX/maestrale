<script setup>
    import favorTable from "~~/data/constraint/favor";
    import fleetTable from "~~/data/constraint/fleet";
    import breakoutTable from "~~/data/constraint/breakout";

    const props = defineProps({
        ship: Ship,
        fleet: String,
        order: Number
    });

    const fleetStore = useFleetStore();
    const shipSelectorStore = useShipSelectorStore();

    const favorOptions = useConstraintOptions(favorTable);
    const baseBreakoutOptions = useConstraintOptions(breakoutTable);
    const { backgroundStyle, frameStyle } = useRarityStyle(() => props.ship?.rarity);

    //头像链接
    const shipIconSrc = computed(() => {
        return props.ship ?
            `/image/artresource/atlas/squareicon/${props.ship?.painting}.png` :
            `/image/artresource/ui/levelfleetselectview/blank_icon_light.png`;
    });

    //突破选项（根据最大可突破数）
    const breakoutOptions = computed(() => {
        return baseBreakoutOptions.slice(0, props.ship.breakoutMax);
    });

    //打开舰娘选择器
    async function openSelector() {
        const id = await shipSelectorStore.open(fleetTable[props.fleet]);

        if (id !== 0) {
            fleetStore[props.fleet][props.order] = (id !== -1) ? createShip(id) : null;
            switchCurShip();
        }
    }

    //切换当前选中舰娘
    function switchCurShip() {
        fleetStore.curShip = fleetStore[props.fleet][props.order];
    }
</script>

<template>
    <div class="ship-item" :class="{
        selected: ship && ship === fleetStore.curShip
    }" @click="switchCurShip">
        <div
            class="ship-icon-wrapper"
            :style="backgroundStyle"
            @click="openSelector"
            ><nuxt-img class="ship-icon" :src="shipIconSrc"/>
            <div class="ship-frame" :style="frameStyle"></div>
        </div>
        <template v-if="ship">
            <section v-if="fleetStore.displayMode" class="ship-section">
                <div class="ship-info">
                    <div><el-text type="info">名称：</el-text><el-text>{{ ship.name }}</el-text></div>
                    <div><el-text>{{ Math.floor(ship.power) }}</el-text> <el-text type="info">战力</el-text></div>
                </div>
                <div class="ship-props">
                    <el-input-number
                        class="ship-level"
                        v-model="ship.level"
                        :min="1"
                        :max="125"
                    />
                    <el-select v-model="ship.breakout">
                        <el-option
                            v-for="item in breakoutOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                    <el-select v-model="ship.favor">
                        <el-option
                            v-for="item in favorOptions"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                        />
                    </el-select>
                </div>
            </section>
            <EquipBar v-else :ship="ship"/>
        </template>
        <span v-else class="ship-default">NO SHIP</span>
    </div>
</template>

<style lang="scss" scoped>
    .ship-item {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.5em;
        border: 1px solid var(--el-border-color);
        border-radius: var(--el-border-radius-base);
        background-color: var(--el-bg-color);

        &.selected {
            border-color: var(--el-color-primary);
            outline: 1px solid var(--el-color-primary);
        }
    }

    .ship-icon-wrapper {
        display: flex;
        position: relative;
        box-shadow: var(--el-box-shadow);
        cursor: pointer;
    }

    .ship-icon {
        width: 4em;
        height: 4em;
    }

    .ship-frame {
        position: absolute;
        inset: 0;
    }

    .ship-section {
        display: grid;
        grid-template-rows: 1fr 1fr;
        height: 100%;
    }

    .ship-info {
        display: flex;
        justify-content: space-between;
        line-height: 28px;
    }

    .ship-props {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5em;
    }

    .ship-default {
        flex: 1;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        color: var(--el-color-info-light-5);
        user-select: none;
    }
</style>