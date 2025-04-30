<script lang="ts" setup>
    import { createShip, type Ship } from "maestrale";
    import { breakoutOptions } from "~/data/constraint/breakout";
    import { favorOptions } from "~/data/constraint/favor";
    import type { FleetType } from "~/data/constraint/fleet";

    const { fleetType } = defineProps<{
        fleetType: FleetType;
        role: string;
        order: number;
    }>();
    const ship = defineModel<Ship | null>({
        required: true,
    });

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    const limitedBreakoutOptions = computed(() => {
        return breakoutOptions.filter(({ value }) => {
            return value <= (ship.value?.maxBreakout ?? 0 + 1);
        });
    });

    async function select() {
        const id = await selectShip(fleetType, !!ship.value);
        if (id === -1) {
            ship.value = null;
        }
        else if (id) {
            ship.value = createShip(id, {
                technology,
            });
        }
        else return;

        await nextTick();
        fleetStore.setCurrentShip(ship.value);
    }

    function clickIcon() {
        if (ship.value === null || fleetStore.infoMode === "equips" && ship.value === fleetStore.currentShip) {
            select();
        }
        else {
            fleetStore.setCurrentShip(ship.value);
        }
    }

    function rightClickIcon(event: MouseEvent) {
        if (ship.value === fleetStore.currentShip) {
            fleetStore.setCurrentShip(null);
            event.preventDefault();
        }
    }
</script>

<template>
    <li
        grid="~ cols-[auto_1fr] gap-2"
        p="2"
        b="~ solid slate op-40 rounded-1"
        outline="2 primary offset--1"
        :class="{
            [`outline`]: ship && fleetStore.currentShip === ship,
        }"
    >
        <ship-icon
            :order
            v-model="ship"
            @click.stop="clickIcon"
            @contextmenu="rightClickIcon"
        />
        <template v-if="ship">
            <div
                v-if="fleetStore.infoMode === `details`"
                grid="~ content-between"
            >
                <div flex="~ justify-between items-center" h="6.5">
                    <span>
                        <span text="slate">{{ role }}：</span>
                        <span>{{ ship.name }}</span>
                    </span>
                    <span>
                        <span>{{ ship.power }}</span>
                        <span m="l-1.5" text="slate">战力</span>
                    </span>
                </div>
                <div flex="~ gap-2">
                    <prime-input-number
                        input-class="w-18 text-center"
                        size="small"
                        :min="1"
                        :max="125"
                        :allow-empty="false"
                        show-buttons
                        button-layout="horizontal"
                        v-model="ship.level.value"
                    />
                    <prime-select
                        flex="1"
                        size="small"
                        :options="limitedBreakoutOptions"
                        option-label="label"
                        option-value="value"
                        v-model="ship.breakout.value"
                    />
                    <prime-select
                        flex="1"
                        size="small"
                        :options="favorOptions"
                        option-label="label"
                        option-value="value"
                        v-model="ship.favor.value"
                    />
                    <prime-button
                        size="small"
                        severity="help"
                        variant="outlined"
                        @click="select"
                    >更换</prime-button>
                </div>
            </div>
            <equip-list v-else v-model="ship"/>
        </template>
        <div v-else flex="1" grid="~ place-items-center">
            <span
                font="mono bold"
                text="12 slate op-40"
                select="none"
            >NO SHIP</span>
        </div>
    </li>
</template>
