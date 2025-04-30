<script lang="ts" setup>
    defineProps<{
        content: string;
    }>();
    const emit = defineEmits<{
        close: [value: boolean];
    }>();
</script>

<template>
    <lib-dialog title="确认" @close="emit(`close`, false)">
        <p
            m="t-3 b-5"
            w="64"
        >{{ content }}</p>
        <footer flex="~ justify-end gap-2">
            <prime-button
                w="21"
                size="small"
                severity="danger"
                variant="outlined"
                @click="emit(`close`, false)"
            >取消</prime-button>
            <prime-button
                w="21"
                size="small"
                severity="info"
                variant="outlined"
                @click="emit(`close`, true)"
            >确定</prime-button>
        </footer>
    </lib-dialog>
</template>
