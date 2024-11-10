<script lang="ts" setup>
    import { FloatLabel } from "primevue";

    export interface Selector {
        label: string;
        id: string;
        options: {
            label: string;
            value: number;
        }[];
    }

    const { options } = defineProps<Selector>();
    const modelValue = defineModel<number>();

    const fullOptions = computed(() => {
        return [
            { label: "全部", value: -1 },
            ...options
        ];
    });
</script>

<template>
    <float-label>
        <prime-select
            w="full"
            :input-id="`picker_${id}`"
            :options="fullOptions"
            option-label="label"
            option-value="value"
            :default-value="-1"
            v-model="modelValue"
        />
        <label :for="`picker_${id}`">{{ label }}</label>
    </float-label>
</template>