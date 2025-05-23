<script lang="ts" setup>
    const excalcStore = useExcalcStore();
    const { infos, currentIdx, currentInfo } = storeToRefs(excalcStore);

    const infoOptions = computed(() => {
        return infos.value.map(({ name }, i) => ({
            label: `[${i + 1}] ${name}`,
            value: i,
        }));
    });
</script>

<template>
    <div grid="~ gap-4" h="fit">
        <excalc-form label="参数">
            <prime-select
                flex="1"
                size="small"
                :options="infoOptions"
                option-label="label"
                option-value="value"
                v-model="currentIdx"
            />
            <fieldset flex="~ gap-2">
                <prime-button
                    size="small"
                    severity="info"
                    variant="outlined"
                    @click="excalcStore.addInfo()"
                >添加</prime-button>
                <prime-button
                    size="small"
                    severity="danger"
                    variant="outlined"
                    @click="excalcStore.removeInfo()"
                >删除</prime-button>
            </fieldset>
        </excalc-form>
        <excalc-form label="名称">
            <prime-input-text
                text="center"
                size="small"
                fluid
                :options="infoOptions"
                option-label="label"
                option-value="value"
                v-model="currentInfo.name"
            />
        </excalc-form>
        <excalc-form label="后排">
            <prime-input-number
                v-for="i in 3"
                input-class="text-center"
                size="small"
                fluid
                :min="0"
                :allow-empty="false"
                :use-grouping="false"
                v-model="currentInfo.main[i - 1]"
            />
        </excalc-form>
        <excalc-form label="前排">
            <prime-input-number
                v-for="i in 3"
                input-class="text-center"
                size="small"
                fluid
                :min="0"
                :allow-empty="false"
                :use-grouping="false"
                v-model="currentInfo.pioneer[i - 1]"
            />
        </excalc-form>
    </div>
</template>
