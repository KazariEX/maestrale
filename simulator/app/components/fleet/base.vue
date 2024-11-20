<script lang="ts" generic="T extends Fleet" setup>
    import type { Fleet } from "maestrale";
    import type { UnwrapRef } from "vue";
    import type { SerializableFleets } from "~/stores/fleet";

    const { label } = defineProps<{
        label: string;
    }>();
    const model = defineModel<UnwrapRef<SerializableFleets<T>>>({
        required: true
    });

    const options = computed(() => {
        return model.value.fleets.map(({ name }, i) => ({
            label: name,
            value: i
        }));
    });

    async function modifyName() {
        const newName = await requireInput({
            title: "修改名称",
            defaultValue: model.value.currentFleet.name.value
        });
        if (newName) {
            model.value.currentFleet.name.value = newName;
        }
    }

    async function removeFleet() {
        if (await requireConfirm(`是否删除编队：${model.value.currentFleet.name.value}？`)) {
            model.value.remove();
        }
    }
</script>

<template>
    <div grid="~ gap-4">
        <div grid="~ cols-[1fr_auto] gap-4">
            <form grid="~ rows-2 cols-3 gap-2">
                <prime-float-label grid="col-start-1 col-end-4" flex="1">
                    <label>{{ label }}</label>
                    <prime-select
                        w="full"
                        size="small"
                        :options
                        option-label="label"
                        option-value="value"
                        :allow-empty="false"
                        v-model="model.currentIdx"
                    />
                </prime-float-label>
                <prime-button
                    size="small"
                    severity="help"
                    variant="outlined"
                    @click="modifyName"
                >修改名称</prime-button>
                <prime-button
                    size="small"
                    severity="info"
                    variant="outlined"
                    @click="model.add()"
                >添加编队</prime-button>
                <prime-button
                    size="small"
                    severity="danger"
                    variant="outlined"
                    :disabled="model.fleets.length <= 1"
                    @click="removeFleet"
                >删除编队</prime-button>
            </form>
            <ul grid="~ cols-2 items-center gap-1">
                <fleet-commander :fleet="model.currentFleet" v-model="model.currentFleet.commander1.value"/>
                <fleet-commander :fleet="model.currentFleet" v-model="model.currentFleet.commander2.value"/>
            </ul>
        </div>
        <slot></slot>
    </div>
</template>