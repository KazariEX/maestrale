<script setup>
    import { HomeFilled, InfoFilled, Operation } from "@element-plus/icons-vue";

    const navs = [
        {
            to: "/",
            title: "编队",
            icon: HomeFilled
        },
        {
            to: "/technology",
            title: "舰队科技",
            icon: Operation
        },
        {
            to: "/help",
            title: "帮助",
            icon: InfoFilled
        }
    ];
</script>

<template>
    <div class="mae-navbar">
        <nuxt-link v-for="{ to, title, icon } in navs" class="nav-item" :to="to">
            <el-icon><component :is="icon"/></el-icon>
            <span>{{ title }}</span>
        </nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .mae-navbar {
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100vw;
        height: 64px;
        box-shadow: var(--el-box-shadow);
        background-color: var(--el-bg-color);
    }

    .nav-item {
        display: grid;
        flex: 1;
        place-items: center;
        align-content: center;
        gap: 4px;
        font-size: 12px;

        > i {
            font-size: 24px;
        }
    }
</style>