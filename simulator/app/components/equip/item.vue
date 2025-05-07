<script lang="ts" setup>
    import { createEquip, type Equip, type EquipType, type ShipType } from "maestrale";

    const { allowTypes, shipType } = defineProps<{
        allowTypes: EquipType[];
        shipType: ShipType;
    }>();
    const equip = defineModel<Equip | null>();

    function adjustLevel(event: WheelEvent) {
        if (equip.value) {
            const level = equip.value.level.value + (event.deltaY < 0 ? 1 : -1);
            equip.value.level.value = Math.max(0, Math.min(equip.value.maxLevel, level));
            event.preventDefault();
        }
    }

    async function select() {
        const id = await selectEquip(allowTypes, shipType, !!equip.value);
        if (id === -1) {
            equip.value = null;
        }
        else if (id) {
            equip.value = createEquip(id);
        }
    }
</script>

<template>
    <div
        position="relative"
        size="14"
        m="t-0.5 l-0.5"
        cursor="pointer"
        @click="select"
        @wheel="adjustLevel"
    >
        <template v-if="equip">
            <rarity-icon
                :rarity="equip.rarity"
                :icon="getEquipIconAtlas(equip.icon)"
                padding
            />
            <label
                class="equip-level"
                flex="~ gap-1.5px"
                position="absolute bottom-1 left-1px"
                p="l-1"
                bg="black/50"
                font="mono bold"
                tracking="-1px"
                text="3 white"
                @click.stop
            >+
                <prime-input-number
                    input-class="w-5.5 h-3.5 outline-none bg-transparent text-inherit"
                    unstyled
                    :min="0"
                    :max="equip.maxLevel"
                    :allow-empty="false"
                    v-model="equip.level.value"
                />
            </label>
        </template>
    </div>
</template>

<style lang="scss">
    .equip-level {
        clip-path:
            polygon(
                0% 0%,
                calc(100% - 7px) 0%,
                100% 50%,
                calc(100% - 7px) 100%,
                0 100%
            );
    }
</style>
