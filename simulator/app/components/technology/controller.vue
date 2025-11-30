<script lang="ts" setup>
    import { attributeMap } from "~/data/constants/attribute";

    const technology = useTechnologyStore();
</script>

<template>
    <ul grid="~ col-(start-1 end-3) self-start gap-4" m="t-4 x-auto" w="120">
        <ship-strengthen-item
            v-for="(_, attr) in technology.maxAttrs[1]"
            :label="attributeMap[attr]"
            :max="technology.maxAttrs[technology.currentShipType][attr]"
            v-model="technology.controlledAttrs[technology.currentShipType][attr]"
        />
    </ul>
</template>
