<script lang="ts" setup>
    import { createCommander } from "maestrale";

    const commanderStore = useCommanderStore();
    const { commanders } = storeToRefs(commanderStore);

    async function select() {
        const id = await selectCommander();
        const commander = createCommander(id);
        if (commander) {
            commanderStore.add(commander);
        }
    }
</script>

<template>
    <ul grid="~ cols-[repeat(4,80px)] gap-2" h="fit">
        <commander-item v-for="_, i in commanders" :index="i"/>
        <li grid="~" p="y-1">
            <commander-icon @click="select"/>
        </li>
    </ul>
</template>
