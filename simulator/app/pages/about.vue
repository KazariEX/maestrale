<script lang="ts" setup>
    useHead({
        title: "关于",
    });

    const serializeStore = useSerializeStore();

    const currentYear = new Date().getFullYear();

    const cacheSize = computed(() => {
        return Object.keys(serializeStore.mapping).length;
    });

    async function clear() {
        if (await requireConfirm("是否清空所有数据？")) {
            serializeStore.clear();
        }
    }
</script>

<template>
    <article max-w="142">
        <h2>介绍</h2>
        <p>西北风模拟器（<nuxt-link to="https://github.com/KazariEX/maestrale" target="_blank">Maestrale Simulator</nuxt-link>），主要用于模拟碧蓝航线中<mark>舰船面板属性的计算</mark>、<mark>编队配置</mark>等。可调整舰船的等级、突破等级、好感、强化值、改造进度等所有参与白值运算的数值，可携带装备与兵装，可自由调整舰队科技提供的属性值，并实时计算舰船的最终面板。</p>
        <h2>特性</h2>
        <p>为了保证代码的简洁和可维护性，本工具将暂时不在舰船的<mark>等级</mark>、<mark>突破等级</mark>和<mark>改造进度</mark>这三个参数之间做任何相互的约束；同时，可携带装备种类也可能因突破等级和舰种的变化而产生差异，请自行调整以符合实际情况。</p>
        <h2>数据</h2>
        <div flex="~ items-center gap-2">
            <prime-button
                size="small"
                severity="help"
                variant="outlined"
                @click="serializeStore.cleanup()"
            >修剪</prime-button>
            <prime-button
                size="small"
                severity="danger"
                variant="outlined"
                @click="clear"
            >清空</prime-button>
            <span text="slate">共 {{ cacheSize }} 个缓存项</span>
        </div>
        <p p="t-8" text="center">Copyright © 2023-{{ currentYear }} <nuxt-link to="https://github.com/KazariEX" target="_blank">KazariEX</nuxt-link></p>
    </article>
</template>

<style lang="scss" scoped>
    h2 {
        --uno: "mt-6 mb-3 font-bold text-6";
    }

    p {
        --uno: "my-2 leading-7";
    }

    a {
        --uno: "underline underline-slate underline-op-40 underline-dashed underline-offset-4";

        &:hover {
            --uno: "text-primary";
        }
    }
</style>
