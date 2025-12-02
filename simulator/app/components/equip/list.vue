<script lang="ts" setup>
    import type { Ship } from "maestrale";

    const ship = defineModel<Ship | null>({
        required: true,
    });

    const equipStyle = {
        backgroundImage: `url("/assets/artresource/ui/shipinfoui/sucai_button.png")`,
    };

    const spweaponStyle = {
        backgroundImage: `url("/assets/artresource/ui/shipinfoui/slot_bg.png")`,
    };
</script>

<template>
    <ul flex="~">
        <li
            v-for="i in 5"
            size="16"
            m="r--1px"
            :style="equipStyle"
        >
            <equip-item
                v-if="ship"
                :allow-types="ship.equipTypes.value[i - 1]!"
                :ship-type="ship.type.value"
                v-model="ship[`equip${i as 1 | 2 | 3 | 4 | 5}`].value"
            />
        </li>
        <li
            size="16"
            m="l-4"
            p="1.5"
            bg="center no-repeat contain"
            :style="spweaponStyle"
        >
            <spweapon-item
                v-if="ship"
                :ship-id="ship.id"
                :ship-type="ship.type.value"
                v-model="ship.spweapon.value"
            />
        </li>
    </ul>
</template>
