<script lang="ts" generic="T extends Fleet" setup>
    import { VueDraggable } from "vue-draggable-plus";
    import type { Fleet, Ship } from "maestrale";
    import type { ShallowRef } from "vue";
    import type { FleetType } from "~/data/constraint/fleet";

    const { items } = defineProps<{
        type: FleetType;
        items: {
            key: keyof T;
            role: string;
            order: number;
        }[];
    }>();
    const fleet = defineModel<T>({
        required: true,
    });

    const draggableItems = shallowRef(items);

    function change() {
        const entries = draggableItems.value.map(({ key }, i) => [
            items[i]!.key,
            getShipRef(key).value,
        ] as const);

        for (const [key, ship] of entries) {
            const shipRef = getShipRef(key);
            shipRef.value = ship;
        }
        draggableItems.value = items;
    }

    function getShipRef(key: keyof T) {
        return fleet.value[key] as ShallowRef<Ship | null>;
    }
</script>

<template>
    <vue-draggable
        handle=".ship-icon"
        target=".fleet-group"
        :animation="150"
        v-model="draggableItems"
        @end="change"
    >
        <transition-group
            class="fleet-group"
            grid="~ gap-2"
            tag="ul"
        >
            <ship-card
                v-for="{ key, role, order } in items"
                :key
                :fleet-type="type"
                :role
                :order
                v-model="getShipRef(key).value"
            />
        </transition-group>
    </vue-draggable>
</template>
