<script lang="ts" generic="T extends { name: string }" setup>
    const { label } = defineProps<{
        label: string;
    }>();
    const model = defineModel<{
        fleets: T[];
        currentIdx: number;
        currentFleet: T;
        add: () => void;
        remove: () => void;
    }>({
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
            defaultValue: model.value.currentFleet.name
        });
        if (newName) {
            model.value.currentFleet.name = newName;
        }
    }

    async function removeFleet() {
        if (await requireConfirm(`是否删除编队：${model.value.currentFleet.name}？`)) {
            model.value.remove();
        }
    }
</script>

<template>
    <div grid="~ gap-4">
        <form flex="~ gap-2">
            <prime-float-label flex="1">
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
        <slot :fleet="model.currentFleet"></slot>
    </div>
</template>