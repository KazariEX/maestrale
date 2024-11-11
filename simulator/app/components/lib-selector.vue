<script
    lang="ts"
    generic="T extends Record<string, unknown> & {
        id: number;
        name: string;
        icon: string;
        rarity: number;
    }"
    setup
>
    import type { Selector } from "~/components/lib-select.vue";
    import type { UseRarityStyleOptions } from "~/composables/useRarityStyle";

    const { selectors } = defineProps<{
        title: string;
        selectors: Selector[];
        data: T[];
        canClear: boolean;
        iconPadding?: boolean;
        rarityMode?: UseRarityStyleOptions["mode"];
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [id: number];
    }>();

    const localSelectors = ref(selectors.map((selector) => ({
        ...selector,
        value: -1
    })));
</script>

<template>
    <transition>
        <div
            v-if="isOpening"
            class="dialog-picker"
            flex="~ col gap-4"
            position="fixed inset-0"
            w="128"
            max-w="full"
            m="l-auto"
            p="t-4 l-4"
            bg="white"
        >
            <header
                flex="~ justify-between items-center"
                p="r-4"
            >
                <h2 text="4 gray-600">{{ title }}</h2>
                <icon
                    text="5 gray hover:primary"
                    cursor="pointer"
                    name="fa6-solid:xmark"
                    @click="emit(`close`, 0)"
                />
            </header>
            <div grid="~ gap-4 cols-3" p="t-6 r-8">
                <lib-select
                    v-for="{ label, id, options }, i in localSelectors"
                    :key="id"
                    :id
                    :label
                    :options
                    v-model="localSelectors[i]!.value"
                />
            </div>
            <ul
                class="[scrollbar-gutter:stable]"
                grid="~ gap-4 cols-6 justify-items-center"
                overflow="y-auto"
                p="r-4 b-4"
            >
                <li
                    v-if="canClear"
                    grid="~ place-items-center"
                    size="16"
                    b="~ solid gray op-40"
                    cursor="pointer"
                    @click="emit(`close`, -1)"
                >
                    <iconify op="40" text="8" name="fa6-solid:trash-can"/>
                </li>
                <li
                    v-for="item in data"
                    v-show="localSelectors.every(({ id, value }) => {
                        return value === -1 || value === item[id];
                    })"
                    :key="item.id"
                    grid="~ gap-0.5"
                    w="16"
                    :title="item.name"
                    @click="emit(`close`, item.id)"
                >
                    <rarity-icon
                        size="16"
                        :mode="rarityMode"
                        :rarity="item.rarity"
                        :icon="item.icon"
                        :padding="iconPadding"
                    />
                    <span text="3 center truncate">{{ item.name }}</span>
                </li>
            </ul>
        </div>
    </transition>
</template>

<style lang="scss">
    .dialog-picker {
        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
            translate: 100% 0;
        }
    }
</style>