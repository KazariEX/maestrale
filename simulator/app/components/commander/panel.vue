<script lang="ts" setup>
    const commanderStore = useCommanderStore();
    const {
        currentCommander: commander,
        currentIdx: index,
    } = storeToRefs(commanderStore);

    const commanderAttrs = [
        "durability",
        "cannon",
        "torpedo",
        "antiaircraft",
        "air",
        "antisub",
    ] as const;

    async function remove() {
        if (await requireConfirm(`是否删除指挥喵：${commander.value!.name.value}？`)) {
            commanderStore.remove(index.value!);
        }
    }
</script>

<template>
    <div v-if="commander" grid="~ gap-6" w="86">
        <form grid="~ cols-[1fr_auto] gap-2">
            <prime-input-text
                text="center"
                size="small"
                v-model="commander.name.value"
            />
            <prime-input-number
                input-class="w-18 text-center"
                size="small"
                :min="1"
                :max="commander.maxLevel"
                :allow-empty="false"
                show-buttons
                button-layout="horizontal"
                v-model="commander.level.value"
            />
        </form>
        <ul grid="~ gap-2">
            <commander-ability-item v-for="i in 5" v-model="commander.abilities[i - 1]"/>
        </ul>
        <prime-fieldset m="t--4.5" legend="能力加成">
            <ul flex="~ justify-between" p="x-1 b-1" leading="loose">
                <commander-status-item label="后勤" :value="commander.support.value"/>
                <commander-status-item label="指挥" :value="commander.command.value"/>
                <commander-status-item label="战术" :value="commander.tactic.value"/>
            </ul>
            <ul grid="~ gap-1">
                <commander-attribute-item
                    v-for="attr in commanderAttrs"
                    :attr
                    :value="commander.attrRates.value[attr]"
                />
            </ul>
        </prime-fieldset>
        <prime-button
            size="small"
            severity="danger"
            variant="outlined"
            @click="remove"
        >喂作猫粮</prime-button>
    </div>
</template>
