<script lang="ts" setup>
    import type { Ship } from "maestrale";

    const ship = defineModel<Ship | null>({
        required: true
    });

    const backgroundStyle = `background-image: url("/image/artresource/ui/shipinfoui/sucai_button.png")`;
</script>

<template>
    <ul flex="~">
        <li
            v-for="i in 5"
            size="16"
            m="l--1px"
            :style="backgroundStyle"
        >
            <equip-item
                v-if="ship"
                :allow-types="ship.equipSlotTypes.value[i - 1]!"
                :ship-type="ship.type.value"
                v-model="ship[`equip${i as 1 | 2 | 3 | 4 | 5}`].value"
            />
        </li>
    </ul>
</template>