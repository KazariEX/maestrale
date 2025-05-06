<script lang="ts" setup>
    const serializeStore = useSerializeStore();

    const cacheSize = computed(() => {
        return Object.keys(serializeStore.mapping).length;
    });

    async function clear() {
        if (await requireConfirm("是否清空所有数据？")) {
            serializeStore.clear();
        }
    }
</script>

<template>
    <ul>
        <setting-item title="数据" :desc="`共 ${cacheSize} 个缓存项`">
            <div flex="~ items-center gap-2">
                <prime-button
                    size="small"
                    severity="help"
                    variant="outlined"
                    @click="serializeStore.cleanup()"
                >修剪</prime-button>
                <prime-button
                    size="small"
                    severity="danger"
                    variant="outlined"
                    @click="clear"
                >清空</prime-button>
            </div>
        </setting-item>
    </ul>
</template>
