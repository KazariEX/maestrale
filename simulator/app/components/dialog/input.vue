<script lang="ts" setup>
    const { defaultValue } = defineProps<{
        title: string;
        defaultValue?: string;
    }>();
    const emit = defineEmits<{
        close: [value?: string];
    }>();

    const text = ref(defaultValue);
</script>

<template>
    <libeccio-dialog :title @close="emit(`close`)">
        <prime-input-text
            m="y-4"
            w="64"
            size="small"
            v-model="text"
        />
        <footer flex="~ justify-end gap-2">
            <prime-button
                w="21"
                size="small"
                severity="danger"
                variant="outlined"
                @click="emit(`close`)"
            >取消</prime-button>
            <prime-button
                w="21"
                size="small"
                severity="info"
                variant="outlined"
                @click="emit(`close`, text)"
            >确定</prime-button>
        </footer>
    </libeccio-dialog>
</template>
