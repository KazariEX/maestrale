<script lang="ts" setup>
    defineProps<{
        options: {
            label: string;
            value: number;
        }[];
        removeDisabled: boolean;
    }>();
    const currentIdx = defineModel<number>({
        required: true
    });
    const emit = defineEmits<{
        add: [];
        remove: [];
    }>();
</script>

<template>
    <form flex="~ gap-2">
        <prime-select
            flex="1"
            size="small"
            :options
            option-label="label"
            option-value="value"
            :allow-empty="false"
            v-model="currentIdx"
        />
        <prime-button
            size="small"
            severity="info"
            variant="outlined"
            @click="emit(`add`)"
        >添加编队</prime-button>
        <prime-button
            size="small"
            severity="danger"
            variant="outlined"
            :disabled="removeDisabled"
            @click="emit(`remove`)"
        >删除编队</prime-button>
    </form>
    <slot></slot>
</template>