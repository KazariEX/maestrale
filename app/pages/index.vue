<script setup>
    const fleetStore = useFleetStore();

    fleetStore.$patch({
        main: [
            null,
            createShip(60501),
            null
        ],
        vanguard: [
            createShip(60104),
            createShip(60105),
            null
        ]
    });

    fleetStore.curShip = fleetStore.vanguard[0];
</script>

<template>
    <div class="mae-index">
        <el-radio-group class="ship-fleet-display" v-model="fleetStore.displayMode">
            <el-radio-button :label="false">装备显示</el-radio-button>
            <el-radio-button :label="true">舰船详情</el-radio-button>
        </el-radio-group>
        <div class="ship-fleet-wrapper">
            <div class="ship-fleet">
                <ShipItem
                    v-for="(ship, i) in fleetStore.main"
                    fleet="main"
                    :order="i"
                    :ship="ship"
                />
            </div>
            <div class="ship-fleet">
                <ShipItem
                    v-for="(ship, i) in fleetStore.vanguard"
                    fleet="vanguard"
                    :order="i"
                    :ship="ship"
                />
            </div>
            <ExScorePanel />
        </div>
        <div class="ship-details">
            <EquipBar :ship="fleetStore.curShip"/>
            <ShipStatus />
            <el-tabs type="border-card">
                <el-tab-pane label="强化">
                    <ShipStrengthen />
                </el-tab-pane>
                <el-tab-pane v-if="fleetStore.curShip?.canTransform" label="改造">
                    <ShipTransform />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mae-index {
        display: grid;
        grid-template:
            "A A"
            "B C";
        gap: 2em;
    }

    .ship-fleet-display {
        grid-area: A;
        justify-self: center;
    }

    .ship-fleet-wrapper, .ship-details {
        width: 486px;
    }

    .ship-fleet-wrapper {
        display: grid;
        gap: 2em;
    }

    .ship-fleet {
        display: grid;
        gap: 0.5em;
    }

    .ship-details {
        display: flex;
        flex-direction: column;
        gap: 2em;
    }

    @media (width >= 1024px) {
        .mae-index {
            justify-content: center;
        }
    }

    @media (width < 1024px) {
        .mae-index {
            grid-template-areas: "A" "B" "C";
            justify-items: center;
        }
    }
</style>