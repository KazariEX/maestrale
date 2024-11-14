<script lang="ts" setup>
    export interface Filter {
        label: string;
        id: string;
        options: {
            label: string;
            value: number;
        }[];
    }

    const { options } = defineProps<Filter>();
    const modelValue = defineModel<number>();

    const fullOptions = computed(() => {
        return [
            { label: "全部", value: -1 },
            ...options
        ];
    });
</script>

<template>
    <prime-float-label>
        <prime-select
            w="full"
            :input-id="`filter_${id}`"
            :options="fullOptions"
            option-label="label"
            option-value="value"
            :default-value="-1"
            v-model="modelValue"
        />
        <label :for="`filter_${id}`">{{ label }}</label>
    </prime-float-label>
</template>