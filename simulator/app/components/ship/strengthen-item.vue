<script lang="ts" setup>
    const { max, rate = 1 } = defineProps<{
        label: string;
        max: number;
        rate?: number;
    }>();
    const modelValue = defineModel<number>({
        required: true,
    });

    const disabled = computed(() => {
        return max === 0;
    });

    const limit = computed(() => {
        return Math.floor(max * rate);
    });

    const range = computed(() => {
        return limit.value / max * 100 + "%";
    });

    const displayValue = ref(modelValue.value);
    watch([modelValue, displayValue, limit], (newVal, oldVal) => {
        if (newVal[0] !== oldVal[0]) {
            displayValue.value = modelValue.value;
        }
        else {
            modelValue.value = Math.min(...newVal.slice(1));
        }
    });
</script>

<template>
    <li flex="~ gap-6 items-center">
        <span>{{ label }}</span>
        <prime-slider
            flex="1"
            :min="0"
            :max="max || 1"
            :disabled
            v-model="displayValue"
        />
        <prime-input-number
            input-class="w-18 text-center"
            size="small"
            :min="0"
            :max="limit"
            :allow-empty="false"
            :disabled
            show-buttons
            button-layout="horizontal"
            v-model="modelValue"
        />
    </li>
</template>

<style lang="scss" scoped>
    :deep(.p-slider-range) {
        max-width: v-bind(range);
    }
</style>
