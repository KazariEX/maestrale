<script lang="ts" setup>
    import { type CommanderAbility, createCommanderAbility, ShareCfg } from "maestrale";

    const ability = defineModel<CommanderAbility>();

    const invalidIds = [2151, 2152, 2153, 2171, 2172, 2173, 2181, 2182, 2183, 2191, 2192, 2193];
    const options = Object.entries(ShareCfg.commander_ability_template)
        .filter(([id]) => !invalidIds.includes(Number(id)))
        .map(([id, { name, icon }]) => ({
            label: name,
            icon: getCommanderTalentIconAtlas(icon),
            value: Number(id),
        }));

    const desc = computed(() => {
        return ability.value?.desc.replaceAll(
            /<color=#\w+>(?<text>[^<]*)<\/color>/g,
            (_, text) => `<mark>${text}</mark>`,
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
        b="~ solid border rounded-md"
    >
        <a
            position="relative"
            grid="~"
            size="11.5"
        >
            <nuxt-img
                v-if="ability"
                size="inherit"
                :src="getCommanderTalentIconAtlas(ability.icon)"
            />
            <div
                v-else
                grid="~ place-items-center"
                b="2 dashed border rounded-md"
                text="5 slate/40"
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
                :model-value="ability?.id"
                @update:model-value="update"
            >
                <template #option="{ option }">
                    <nuxt-img size="8" m="r-1" :src="option.icon"/>
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
            <p leading="relaxed" text="3 slate-600 truncate dark:slate-300" v-html="desc"></p>
        </div>
        <div
            v-else
            flex="1"
            b="2 dashed border rounded-lg"
        ></div>
    </li>
</template>
