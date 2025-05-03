<script lang="ts" setup>
    import { Nationality, type Ship } from "maestrale";
    import { favorMap } from "~/data/constraint/favor";

    defineProps<{
        order: number;
    }>();
    const ship = defineModel<Ship | null>();

    const fleetStore = useFleetStore();

    const squareicon = computed(() => {
        return ship.value?.painting.value
            ? getSquareIconAtlas(ship.value.painting.value)
            : "/assets/artresource/ui/levelfleetselectview/blank_icon_light.png";
    });
</script>

<template>
    <div
        position="relative"
        size="16"
        text="3 white"
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
