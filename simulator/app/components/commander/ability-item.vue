<script lang="ts" setup>
    import { type CommanderAbility, createCommanderAbility, ShareCfg } from "maestrale";

    const ability = defineModel<CommanderAbility>();

    const invalidIds = [2151, 2152, 2153, 2171, 2172, 2173, 2181, 2182, 2183, 2191, 2192, 2193];
    const options = Object.entries(ShareCfg.commander_ability_template)
        .filter(([id]) => !invalidIds.includes(Number(id)))
        .map(([id, { name, icon }]) => ({
            label: name,
            icon: `/image/artresource/atlas/commandertalenticon/${icon}.png`,
            value: Number(id)
        }));

    const desc = computed(() => {
        return ability.value?.desc.replaceAll(
            /<color=#\w+>(?<text>[^<]*)<\/color>/g,
            (_, text) => `<mark>${text}</mark>`
        );
    });

    function update(id: number) {
        ability.value = createCommanderAbility(id) ?? void 0;
    }
</script>

<template>
    <li
        flex="~ gap-2"
        position="relative"
        h="16"
        p="2"
        b="~ solid slate op-40 rounded-md"
    >
        <a
            position="relative"
            grid="~"
            size="11.5"
        >
            <nuxt-img
                v-if="ability"
                size="inherit"
                :src="`/image/artresource/atlas/commandertalenticon/${ability.icon}.png`"
            />
            <div
                v-else
                grid="~ place-items-center"
                b="2 dashed slate op-40 rounded-md"
                text="5 slate op-40"
            >
                <iconify name="fa6-solid:plus"/>
            </div>
            <prime-select
                position="absolute inset-0"
                op="0"
                panel-class="min-w-48!"
                :options
                option-label="label"
                option-value="value"
                :virtual-scroller-options="{ itemSize: 40 }"
                @update:model-value="update"
            >
                <template #option="{ option }">
                    <nuxt-img
                        size="8"
                        m="r-1"
                        :src="option.icon"
                    />
                    <span>{{ option.label }}</span>
                </template>
            </prime-select>
        </a>
        <div v-if="ability" grid="~ items-center" p="t-0.5">
            <button
                position="absolute top-2 right-2"
                size="4"
                text="slate @hover:primary"
                @click="ability = void 0"
            >
                <iconify name="fa6-solid:xmark"/>
            </button>
            <span>{{ ability.name }}</span>
            <p leading="6" text="3 slate-600 truncate" v-html="desc"></p>
        </div>
        <div
            v-else
            flex="1"
            b="2 dashed slate op-40 rounded-2"
        ></div>
    </li>
</template>