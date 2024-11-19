<script lang="ts" generic="T extends Fleet" setup>
    import { VueDraggable } from "vue-draggable-plus";
    import type { Fleet, Ship } from "maestrale";
    import type { ShallowRef } from "vue";
    import type { FleetType } from "~/data/constraint/fleet";

    const { fleet, items } = defineProps<{
        fleet: T;
        type: FleetType;
        items: {
            key: keyof T;
            role: string;
        }[];
    }>();

    const draggableItems = shallowRef(items);

    function change() {
        const entries = draggableItems.value.map(({ key }, i) => [
            items[i]!.key,
            getShipRef(fleet, key).value
        ] as const);

        for (const [key, ship] of entries) {
            const shipRef = getShipRef(fleet, key);
            shipRef.value = ship;
        }
        draggableItems.value = items;
    }

    function getShipRef(fleet: T, key: keyof T) {
        return fleet[key] as ShallowRef<Ship | null>;
    }
</script>

<template>
    <vue-draggable
        grid="~ gap-2"
        tag="ul"
        handle=".ship-icon"
        v-model="draggableItems"
        @end="change"
    >
        <ship-card
            v-for="{ key, role } in items"
            :key
            :fleet="type"
            :role
            v-model="getShipRef(fleet, key).value"
        />
    </vue-draggable>
</template>