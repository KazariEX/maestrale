<script lang="ts" setup>
    defineProps<{
        label: string;
        max: number;
    }>();
    const modelValue = defineModel<number>();
</script>

<template>
    <li flex="~ gap-6 items-center">
        <span>{{ label }}</span>
        <prime-slider
            flex="1"
            :min="0"
            :max
            v-model="modelValue"
        />
        <prime-input-number
            input-class="w-18 text-center"
            size="small"
            :min="0"
            :max
            :allow-empty="false"
            show-buttons
            button-layout="horizontal"
            v-model="modelValue"
        />
    </li>
</template>