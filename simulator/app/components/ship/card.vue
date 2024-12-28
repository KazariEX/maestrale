<script lang="ts" setup>
    import { createShip, Nationality, type Ship } from "maestrale";
    import { breakoutOptions } from "~/data/constraint/breakout";
    import { favorMap, favorOptions } from "~/data/constraint/favor";
    import type { FleetType } from "~/data/constraint/fleet";

    const { fleetType } = defineProps<{
        fleetType: FleetType;
        role: string;
        order: number;
    }>();
    const ship = defineModel<Ship | null>({
        required: true
    });

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    const squareicon = computed(() => {
        return ship.value?.painting.value
            ? `/assets/artresource/atlas/squareicon/${ship.value.painting.value}.png`
            : "/assets/artresource/ui/levelfleetselectview/blank_icon_light.png";
    });

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
                technology
            });
        }
        else return;

        await nextTick();
        fleetStore.setCurrentShip(ship.value);
    }

    function clickIcon() {
        if (ship.value !== null) {
            fleetStore.setCurrentShip(ship.value);
        }
        else {
            select();
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
            [`outline`]: ship && fleetStore.currentShip === ship
        }"
    >
        <div
            position="relative"
            size="16"
            text="3 white"
            @click.stop="clickIcon"
        >
            <rarity-icon
                class="ship-icon"
                :rarity="ship?.rarity.value"
                :icon="squareicon"
                :star="ship?.star.value"
                :max-star="ship?.maxStar.value"
                :is-meta="ship?.nationality.value === Nationality.META"
            />
            <template v-if="ship && fleetStore.infoMode === `equips`">
                <span
                    class="ship-level"
                    position="absolute bottom-4 left-1px"
                    p="l-1 r-2"
                    bg="black op-50"
                    font="mono bold"
                    pointer-events="none"
                >{{ ship.level }}</span>
                <span
                    class="ship-order"
                    grid="~ place-items-end"
                    position="absolute right-1px bottom-1px"
                    p="r-0.5"
                    size="5"
                    bg="black op-50"
                    font="mono bold"
                    pointer-events="none"
                >{{ order }}</span>
                <span
                    position="absolute top-0 right-0"
                    p="r-0.75"
                    text-shadow="md color-black"
                    pointer-events="none"
                >{{ favorMap[ship.favor.value] }}</span>
            </template>
        </div>
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

<style lang="scss">
    .ship-level {
        clip-path:
            polygon(
                0% 0%,
                calc(100% - 7px) 0%,
                100% 50%,
                calc(100% - 7px) 100%,
                0 100%
            );
    }

    .ship-order {
        clip-path:
            polygon(
                100% 0%,
                100% 100%,
                0% 100%
            );
    }
</style>