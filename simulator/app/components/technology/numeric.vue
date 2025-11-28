<script lang="ts" setup>
    defineProps<{
        label: string;
        value: number;
        selector?: boolean;
        selected?: boolean;
    }>();
    defineEmits<{
        select: [];
    }>();
</script>

<template>
    <li flex="~ items-center">
        <span :class="{ [`text-primary`]: selected }">{{ label }}</span>
        <prime-input-number
            input-class="w-23 text-center"
            m="l-4 r-2"
            size="small"
            readonly
            :use-grouping="false"
            :model-value="value"
        />
        <span
            v-if="selector"
            v-ripple
            :class="{ [`op-25`]: !selected }"
            grid="~ place-items-center"
            size="8"
            rounded="full"
            text="5 "
            cursor="pointer"
            @click="$emit(`select`)"
        >
            <iconify name="lsicon:filter-filled"/>
        </span>
    </li>
</template>
