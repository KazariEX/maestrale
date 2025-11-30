<script lang="ts" setup>
    import { ShareCfg } from "maestrale";
    import { nonNullable } from "maestrale/utils";
    import { attributeMap } from "~/data/constants/attribute";
    import { shipTypeTechMap } from "~/data/constants/ship-type";
    import type { AchieveAdditional, AchieveItem, AchievePhase } from "~/types/technology";

    const { phase, additional } = defineProps<{
        phase: AchievePhase;
        item: AchieveItem;
        additional: AchieveAdditional;
    }>();
    defineEmits<{
        toggle: [item: AchieveItem, phase: AchievePhase];
    }>();

    const shipTypes = computed(() => {
        if (phase === "upgrade") {
            return [];
        }
        return additional.template[`add_${phase}_shiptype`]
            .map((type) => shipTypeTechMap[type])
            .filter(nonNullable);
    });

    const attr = computed(() => {
        if (phase === "upgrade") {
            return;
        }
        const { name } = ShareCfg.attribute_info_by_type[additional.template[`add_${phase}_attr`]]!;
        return attributeMap[name];
    });

    const value = computed(() => {
        if (phase === "upgrade") {
            return;
        }
        return additional.template[`add_${phase}_value`];
    });
</script>

<template>
    <div flex="~ items-center" leading="normal" text="3">
        <div position="relative" grid="~ justify-items-center" m="x-1">
            <prime-checkbox
                binary
                :model-value="item[phase]"
                @update:model-value="$emit(`toggle`, item, phase)"
            />
            <span position="absolute top-5.5" text="slate">{{ additional.template[`pt_${phase}`] }}</span>
        </div>
        <span>
            <template v-for="type in shipTypes">
                【{{ type }}】{{ attr }} +{{ value }}<br />
            </template>
        </span>
    </div>
</template>
