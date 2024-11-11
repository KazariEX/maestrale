<script lang="ts" setup>
    const { max } = defineProps<{
        label: string;
        max: number;
    }>();
    const modelValue = defineModel<number>();

    const disabled = computed(() => {
        return max === 0;
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
            v-model="modelValue"
        />
        <prime-input-number
            input-class="w-18 text-center"
            size="small"
            :min="0"
            :max
            :allow-empty="false"
            :disabled
            show-buttons
            button-layout="horizontal"
            v-model="modelValue"
        />
    </li>
</template>