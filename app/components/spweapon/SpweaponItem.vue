<script setup>
    const props = defineProps({
        ship: Ship
    });

    const spweapon = computed(() => {
        return props.ship?.spweapon;
    });

    const spweaponSelectorStore = useSpweaponSelectorStore();
    const { backgroundStyle } = useRarityStyle(() => spweapon.value?.rarity + 1);

    //打开兵装选择器
    async function openSelector() {
        if (!props.ship) return;

        const id = await spweaponSelectorStore.open(props.ship);
        if (id !== 0) {
            props.ship.spweapon = (id !== -1) ? createSPWeapon(id) : null;
        }
    }

    //鼠标滚轮时
    function onMouseWheel(event) {
        if (!spweapon.value) return;
        event.preventDefault();

        const level = spweapon.value.level + (event.deltaY > 0 ? -1 : 1);
        spweapon.value.level = Math.max(0, Math.min(10, level));
    }
</script>

<template>
    <div class="spweapon-item">
        <div
            class="spweapon-wrapper"
            :style="backgroundStyle"
            @click="openSelector"
            @wheel="onMouseWheel"
            ><template v-if="spweapon">
                <nuxt-img class="spweapon-icon" :src="`/image/artresource/atlas/spweapon/${spweapon.icon}.png`"/>
            </template>
        </div>
        <span class="mask-text spweapon-level">{{ spweapon?.level }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .spweapon-item {
        position: relative;
        width: 64px;
        height: 64px;
        margin-left: 16px;
        background-image: url("/image/artresource/ui/shipinfoui/slot_bg.png");
    }

    .spweapon-wrapper {
        display: flex;
        position: absolute;
        overflow: hidden;
        inset: 6px;
        border-radius: 100%;
        cursor: pointer;
    }

    .spweapon-icon {
        max-width: 44px;
        max-height: 44px;
        margin: auto;
    }

    .spweapon-level {
        $s: 22px;

        bottom: 7px;
        width: $s;
        border-radius: 100%;
        line-height: $s;
    }
</style>