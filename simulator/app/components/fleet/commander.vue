<script lang="ts" setup>
    import type { Commander, Fleet } from "maestrale";

    const { fleet } = defineProps<{
        fleet: Fleet;
    }>();

    const commander = defineModel<Commander | null>({
        required: true
    });

    const commanderStore = useCommanderStore();
    const { commanders } = storeToRefs(commanderStore);

    const icon = computed(() => {
        return commander.value
            ? `/assets/artresource/atlas/commandericon/${commander.value.painting}.png`
            : void 0;
    });

    const index = computed(() => {
        return commanders.value.indexOf(commander.value!);
    });

    async function select() {
        const excludes = fleet.commanders.value.map(
            (commander) => (commander ? commanders.value.indexOf(commander) : -1)
        );

        const i = await selectNestCommander(excludes, !!commander.value);
        if (i === -1) {
            commander.value = null;
        }
        else if (i !== void 0) {
            commander.value = commanders.value[i]!;
        }
    }

    function navigate() {
        if (index.value === -1) {
            return;
        }
        commanderStore.currentIdx = index.value;
        navigateTo({ name: `catlodge` });
    }
</script>

<template>
    <li grid="~" w="16">
        <commander-icon h="14!" :icon @click="select"/>
        <span
            text="3 slate-600 center truncate"
            :class="{
                [`@hover:text-primary cursor-pointer`]: index !== -1,
                [`op-40 select-none`]: index === -1
            }"
            @click="navigate"
        >{{ commander?.name }}</span>
    </li>
</template>