<script lang="ts" setup>
    import { createSPWeapon, type ShipType, type SPWeapon } from "maestrale";

    const { shipId, shipType } = defineProps<{
        shipId: number;
        shipType: ShipType;
    }>();
    const spweapon = defineModel<SPWeapon | null>();

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
        overflow="hidden"
        size="13"
        b="rounded-full"
        cursor="pointer"
        @click="select"
    >
        <template v-if="spweapon">
            <rarity-icon
                mode="spweapon"
                :rarity="spweapon.rarity"
                :icon="`/image/artresource/atlas/spweapon/${spweapon.icon}.png`"
                :show-frame="false"
                padding
            />
        </template>
    </div>
</template>