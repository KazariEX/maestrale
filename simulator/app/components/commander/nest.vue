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
        <li grid="~" @click="select">
            <nuxt-img
                size="14"
                p="2"
                m="x-auto t-2"
                cursor="pointer"
                src="/image/artresource/ui/commanderui/commandroomui/icon_bg.png"
            />
        </li>
    </ul>
</template>