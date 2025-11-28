<script lang="ts" setup generic="T">
    export interface Filter<T = unknown> {
        label: string;
        id: string;
        options: {
            label: string;
            value: T;
        }[];
    }

    const { options } = defineProps<Filter<T>>();
    const modelValue = defineModel<T>();

    const fullOptions = computed(() => {
        return [
            { label: "全部", value: -1 },
            ...options,
        ];
    });
</script>

<template>
    <prime-float-label>
        <prime-select
            w="full"
            size="small"
            :disabled="!options.length"
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
