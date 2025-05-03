<script lang="ts" setup>
    import { createSPWeapon, type ShipType, type SPWeapon } from "maestrale";

    const { shipId, shipType } = defineProps<{
        shipId: number;
        shipType: ShipType;
    }>();
    const spweapon = defineModel<SPWeapon | null>();

    function adjustLevel(event: WheelEvent) {
        if (spweapon.value) {
            const level = spweapon.value.level.value + (event.deltaY < 0 ? 1 : -1);
            spweapon.value.level.value = Math.max(0, Math.min(spweapon.value.maxLevel, level));
            event.preventDefault();
        }
    }

    async function select() {
        const id = await selectSPWeapon(shipId, shipType, !!spweapon.value);
        if (id === -1) {
            spweapon.value = null;
        }
        else if (id) {
            spweapon.value = createSPWeapon(id);
        }
    }
</script>

<template>
    <div
        position="relative"
        size="13"
        cursor="pointer"
        @click="select"
        @wheel="adjustLevel"
    >
        <template v-if="spweapon">
            <rarity-icon
                b="rounded-full"
                mode="spweapon"
                :rarity="spweapon.rarity"
                :icon="getSPWeaponIconAtlas(spweapon.icon)"
                :show-frame="false"
                padding
            />
            <label
                flex="~ gap-1.5px"
                position="absolute bottom-0 left-0"
                b="rounded-full"
                bg="black op-50"
                font="mono bold"
                text="3 white"
                @click.stop
            >
                <prime-input-number
                    input-class="size-5 outline-none bg-transparent text-inherit text-center"
                    unstyled
                    :min="0"
                    :max="spweapon.maxLevel"
                    :allow-empty="false"
                    v-model="spweapon.level.value"
                />
            </label>
        </template>
    </div>
</template>
