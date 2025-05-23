<script lang="ts" setup>
    const excalcStore = useExcalcStore();
    const { currentInfo } = storeToRefs(excalcStore);
</script>

<template>
    <div>
        <prime-data-table :value="currentInfo.bukis" scrollable>
            <prime-column body-class="min-w-40" header="武器名称">
                <template #body="{ index }">
                    <prime-input-text
                        text="center"
                        size="small"
                        fluid
                        v-model="currentInfo.bukis[index]!.name"
                    />
                </template>
            </prime-column>
            <prime-column body-class="min-w-24" header="伤害">
                <template #body="{ index }">
                    <prime-input-number
                        input-class="text-center"
                        size="small"
                        fluid
                        :min="0"
                        :allow-empty="false"
                        :use-grouping="false"
                        v-model="currentInfo.bukis[index]!.damage"
                    />
                </template>
            </prime-column>
            <prime-column body-class="min-w-24" header="Hit">
                <template #body="{ index }">
                    <prime-input-number
                        input-class="text-center"
                        size="small"
                        fluid
                        :min="0"
                        :allow-empty="false"
                        :use-grouping="false"
                        v-model="currentInfo.bukis[index]!.hit"
                    />
                </template>
            </prime-column>
            <prime-column body-class="min-w-24" header="命中率">
                <template #body="{ index }">
                    <prime-input-number
                        input-class="text-center"
                        size="small"
                        fluid
                        :min="0"
                        :min-fraction-digits="2"
                        :max-fraction-digits="2"
                        :allow-empty="false"
                        :use-grouping="false"
                        v-model="currentInfo.bukis[index]!.accuracyRate"
                    />
                </template>
            </prime-column>
            <prime-column body-class="min-w-24" header="暴击率">
                <template #body="{ index }">
                    <prime-input-number
                        input-class="text-center"
                        size="small"
                        fluid
                        :min="0"
                        :min-fraction-digits="2"
                        :max-fraction-digits="2"
                        :allow-empty="false"
                        :use-grouping="false"
                        v-model="currentInfo.bukis[index]!.critRate"
                    />
                </template>
            </prime-column>
            <prime-column body-class="min-w-24" header="暴击伤害">
                <template #body="{ index }">
                    <prime-input-number
                        input-class="text-center"
                        size="small"
                        fluid
                        :min="0"
                        :min-fraction-digits="2"
                        :max-fraction-digits="2"
                        :allow-empty="false"
                        :use-grouping="false"
                        v-model="currentInfo.bukis[index]!.critDamage"
                    />
                </template>
            </prime-column>
            <prime-column header="其他">
                <template #body="{ index }">
                    <prime-button
                        un-text="nowrap"
                        size="small"
                        severity="danger"
                        variant="outlined"
                        :disabled="currentInfo.bukis.length <= 1"
                        @click="excalcStore.removeBuki(index)"
                    >删除</prime-button>
                </template>
            </prime-column>
        </prime-data-table>
        <prime-button
            w="full"
            m="t-2"
            bg="@hover:slate/5"
            un-text="border"
            size="small"
            variant="text"
            @click="excalcStore.addBuki()"
        >
            <iconify name="fa6-solid:plus"/>
        </prime-button>
    </div>
</template>

<style scoped>
    :deep(.p-datatable-column-header-content) {
        --uno: "justify-center";
    }

    :deep(td) {
        --uno: "px-2";
    }
</style>
