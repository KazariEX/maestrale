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
    import { Nationality } from "maestrale";
    import type { Filter } from "~/components/lib-filter.vue";
    import type { RarityIconProps } from "~/components/rarity-icon.vue";

    interface SpecialFilter {
        label: string;
        exec: (item: T) => unknown;
    }

    const { selectors, data } = defineProps<{
        title: string;
        selectors: (Filter | SpecialFilter)[];
        data: T[];
        canClear?: boolean;
        iconPadding?: boolean;
        rarityMode?: RarityIconProps["mode"] | "commander";
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [id: number];
    }>();

    const sortedData = computed(() => {
        return [...data].sort((a, b) => b.rarity - a.rarity);
    });

    const filterWord = ref("");

    const localSelectors = ref(
        selectors
            .filter((selector) => "id" in selector)
            .map((selector) => ({
                ...selector,
                value: -1
            }))
    );

    const additionalSelector = ref({
        options: selectors
            .filter((selector) => "exec" in selector)
            .map((selector) => ({
                ...selector,
                value: selector.label
            })),
        value: ""
    });

    function filterItem(item: T) {
        return (!filterWord.value || item.name.includes(filterWord.value))
            && localSelectors.value.every(({ id, value }) => {
                return value === -1 || value === item[id];
            })
            && additionalSelector.value.options.every(({ exec, value }) => {
                return value !== additionalSelector.value.value || exec(item);
            });
    }
</script>

<template>
    <transition>
        <div
            v-if="isOpening"
            class="lib-selector"
            flex="~ col gap-4"
            position="fixed inset-0"
            w="128"
            max-w="full"
            m="l-auto"
            p="t-4 l-4"
            bg="white"
        >
            <header
                grid="~ cols-[1fr_auto]"
                p="r-4"
            >
                <h2 text="4 slate-600">{{ title }}</h2>
                <button
                    size="5"
                    text="5 slate @hover:primary"
                    @click="emit(`close`, 0)"
                >
                    <iconify name="fa6-solid:xmark"/>
                </button>
            </header>
            <div grid="~ gap-row-8 gap-col-4 rows-2 cols-3" p="t-6 r-8">
                <lib-filter
                    v-for="{ label, id, options }, i in localSelectors"
                    :key="id"
                    :id
                    :label
                    :options
                    v-model="localSelectors[i]!.value"
                />
                <prime-float-label grid="row-start-2 col-span-2">
                    <prime-input-text w="full" size="small" v-model.trim="filterWord"/>
                    <label>名称</label>
                </prime-float-label>
                <lib-filter
                    id="additional"
                    grid="row-start-2"
                    label="附加索引"
                    :options="additionalSelector.options"
                    v-model="additionalSelector.value"
                />
            </div>
            <ul
                class="[scrollbar-gutter:stable]"
                grid="~ cols-[repeat(auto-fill,minmax(64px,1fr))] gap-4"
                overflow="y-auto"
                p="r-4 b-4"
            >
                <li
                    v-if="canClear"
                    grid="~ place-items-center"
                    size="16"
                    b="2 dashed slate op-40 rounded-md"
                    cursor="pointer"
                    @click="emit(`close`, -1)"
                >
                    <iconify text="8 slate op-60" name="fa6-solid:trash-can"/>
                </li>
                <li
                    v-for="item in sortedData"
                    v-show="filterItem(item)"
                    :key="item.id"
                    grid="~ justify-center gap-0.5"
                    w="16"
                    cursor="pointer"
                    :title="item.name"
                    @click="emit(`close`, item.id)"
                >
                    <commander-icon v-if="rarityMode === `commander`" :icon="item.icon"/>
                    <rarity-icon
                        v-else
                        size="16"
                        :mode="rarityMode"
                        :rarity="item.rarity"
                        :icon="item.icon"
                        :padding="iconPadding"
                        :is-meta="item.nationality === Nationality.META"
                    />
                    <span text="3 center truncate">{{ item.name }}</span>
                </li>
            </ul>
        </div>
    </transition>
</template>

<style lang="scss">
    .lib-selector {
        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
            translate: 100% 0;
        }
    }
</style>