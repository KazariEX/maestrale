<script lang="ts" setup>
    import { createShip, type Ship } from "maestrale";
    import { breakoutOptions } from "~/data/constraint/breakout";
    import { favorOptions } from "~/data/constraint/favor";
    import type { Fleet } from "~/data/constraint/fleet";

    const { fleet } = defineProps<{
        fleet: Fleet;
    }>();
    const ship = defineModel<Ship | null>({
        required: true
    });

    const fleetStore = useFleetStore();
    const technology = useTechnology();

    const squareicon = computed(() => {
        return ship.value?.painting.value
            ? `/image/artresource/atlas/squareicon/${ship.value.painting.value}.png`
            : "/image/artresource/ui/levelfleetselectview/blank_icon_light.png";
    });

    const power = computed(() => {
        return Math.floor(ship.value?.power.value ?? 0);
    });

    const limitedBreakoutOptions = computed(() => {
        return breakoutOptions.filter(({ value }) => {
            return value <= (ship.value?.breakoutMax ?? 0 + 1);
        });
    });

    async function select() {
        const id = await selectShip(fleet, !!ship.value);
        if (id === -1) {
            ship.value = null;
        }
        else if (id) {
            ship.value = createShip(id, {
                technology
            });
        }
        await nextTick();
        fleetStore.currentShip = ship.value;
    }
</script>

<template>
    <div
        grid="~ cols-[auto_1fr] gap-2"
        p="2"
        b="~ solid gray op-40 rounded-1"
        outline="2 primary offset--1"
        :class="{
            [`outline`]: ship && fleetStore.currentShip === ship
        }"
        @click="fleetStore.currentShip = ship"
    >
        <rarity-icon
            size="16"
            :rarity="ship?.rarity.value"
            :icon="squareicon"
            @click="select"
        />
        <template v-if="ship">
            <div
                v-if="fleetStore.infoMode === `details`"
                grid="~ content-between"
            >
                <div flex="~ justify-between items-center" h="6.5">
                    <span>
                        <span text="gray">名称：</span>
                        <span>{{ ship.name }}</span>
                    </span>
                    <span>
                        <span>{{ power }}</span>
                        <span m="l-1.5" text="gray">战力</span>
                    </span>
                </div>
                <div flex="~ gap-2">
                    <prime-input-number
                        input-class="w-24 text-center"
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
                </div>
            </div>
            <equip-list v-else v-model="ship"/>
        </template>
        <div v-else flex="1" grid="~ place-items-center">
            <span font="mono bold" text="12 gray op-40">NO SHIP</span>
        </div>
    </div>
</template>