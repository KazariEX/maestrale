<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
        attr?: string;
        disabled?: boolean;
    }>();
</script>

<template>
    <li flex="~ items-center gap-3" w="34">
        <span text="nowrap">{{ label }}</span>
        <prime-input-number
            input-class="text-center"
            size="small"
            fluid
            readonly
            :use-grouping="false"
            :model-value="value"
        />
        <prime-checkbox v-if="attr !== void 0" :value="attr" :disabled/>
    </li>
</template>
