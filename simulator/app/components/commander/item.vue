<script lang="ts" setup>
    const { index } = defineProps<{
        index: number;
    }>();

    const commanderStore = useCommanderStore();
    const { commanders, currentCommander } = storeToRefs(commanderStore);

    const commander = computed(() => {
        return commanders.value[index]!;
    });

    function clickIcon() {
        commanderStore.toggle(index);
        window.scrollTo({
            top: 0,
        });
    }
</script>

<template>
    <li
        v-ripple
        grid="~ gap-0.5"
        position="relative"
        p="y-1"
        b="rounded"
        cursor="pointer"
        :class="{
            [`text-primary`]: currentCommander === commander,
        }"
        @click="clickIcon"
    >
        <commander-icon :icon="getCommanderIconAtlas(commander.painting)"/>
        <span text="center truncate">{{ commander.name }}</span>
    </li>
</template>
