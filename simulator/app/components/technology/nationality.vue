<script lang="ts" setup>
    import { nationalityMap } from "~/data/constants/nationality";

    defineProps<{
        isOpening: boolean;
    }>();

    const technology = useTechnologyStore();
</script>

<template>
    <libeccio-dialog title="阵营科技" :is-opening>
        <ul flex="~ gap-4" m="t-3 b-1" text="center">
            <li v-for="(max, nationality) in technology.nationalityMaxLevels">
                <prime-knob
                    :size="64"
                    :max
                    v-model="technology.nationalityLevels[nationality]"
                />
                <span>{{ nationalityMap[nationality] }}</span>
            </li>
        </ul>
    </libeccio-dialog>
</template>

