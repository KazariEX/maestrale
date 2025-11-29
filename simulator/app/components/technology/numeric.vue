<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
        attr?: string;
        disabled?: boolean;
    }>();
</script>

<template>
    <div flex="~ items-center gap-3">
        <span text="nowrap">{{ label }}</span>
        <prime-input-number
            input-class="text-center"
            size="small"
            fluid
            readonly
            :use-grouping="false"
            :model-value="value"
        />
        <prime-checkbox v-if="attr !== void 0" :value="attr" :disabled>
            <template #icon="{ checked, ...props }">
                <iconify v-if="checked" :class="props.class" name="prime:filter"/>
            </template>
        </prime-checkbox>
    </div>
</template>
