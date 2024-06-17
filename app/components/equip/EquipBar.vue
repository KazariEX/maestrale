<script setup>
    const props = defineProps({
        ship: Ship
    });
</script>

<template>
    <div class="equip-bar">
        <EquipItem v-for="i in 5" :slot="i - 1" :ship="ship"/>
        <SpweaponItem :ship="ship"/>
    </div>
</template>

<style lang="scss" scoped>
    .equip-bar {
        display: flex;
    }
</style>