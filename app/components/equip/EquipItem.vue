<script setup>
    const props = defineProps({
        ship: Ship,
        slot: Number
    });

    const equip = computed(() => {
        return props.ship?.equips?.[props.slot];
    });

    const equipSelectorStore = useEquipSelectorStore();
    const { backgroundStyle, frameStyle } = useRarityStyle(() => equip.value?.rarity);

    //打开装备选择器
    async function openSelector() {
        if (!props.ship) return;

        const id = await equipSelectorStore.open(props.ship, props.slot);
        if (id !== 0) {
            props.ship.equips[props.slot] = (id !== -1) ? createEquip(id) : null;
        }
    }

    //鼠标滚轮时
    function onMouseWheel(event) {
        if (!equip.value) return;
        event.preventDefault();

        const level = equip.value.level + (event.deltaY > 0 ? -1 : 1);
        equip.value.level = Math.max(0, Math.min(level, equip.value.levelMax));
    }
</script>

<template>
    <div class="equip-item">
        <div
            class="equip-wrapper"
            :style="backgroundStyle"
            @click="openSelector"
            @wheel="onMouseWheel"
            ><template v-if="equip">
                <nuxt-img class="equip-icon" :src="`/image/artresource/atlas/equips/${equip.icon}.png`"/>
                <span class="mask-text equip-level">+{{ equip.level }}</span>
            </template>
            <div class="equip-frame" :style="frameStyle"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .equip-item {
        position: relative;
        width: 64px;
        height: 64px;
        background-image: url("/image/artresource/ui/shipinfoui/sucai_button.png");

        & + & {
            margin-left: -1px;
        }
    }

    .equip-wrapper {
        display: flex;
        position: absolute;
        inset: 2px 6px 6px 2px;
        cursor: pointer;
    }

    .equip-icon {
        max-width: 48px;
        max-height: 48px;
        margin: auto;
    }

    .equip-level {
        $s: 8px;

        bottom: 4px;
        padding-inline: 2px 10px;
        clip-path:
            polygon(
                0 0,
                calc(100% - $s) 0,
                100% 50%,
                calc(100% - $s) 100%,
                0 100%
            );
        line-height: 16px;
    }

    .equip-frame {
        position: absolute;
        inset: 0;
    }
</style>