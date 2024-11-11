<script lang="ts" setup>
    import { createEquip, type Equip, type EquipType, type ShipType } from "maestrale";

    const { allowTypes, shipType } = defineProps<{
        allowTypes: EquipType[];
        shipType: ShipType;
    }>();
    const equip = defineModel<Equip | null>();

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
    <div size="14" m="t-0.5 l-0.5" cursor="pointer" @click="select">
        <template v-if="equip">
            <rarity-icon
                icon-class="size-max-12"
                :rarity="equip.rarity"
                :icon="`/image/artresource/atlas/equips/${equip.icon}.png`"
                shrink
            />
        </template>
    </div>
</template>