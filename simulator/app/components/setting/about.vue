<script lang="ts" setup>
    const currentYear = new Date().getFullYear();
</script>

<template>
    <article max-w="142">
        <p>西北风模拟器（<nuxt-link to="https://github.com/KazariEX/maestrale" target="_blank">Maestrale Simulator</nuxt-link>），主要用于模拟碧蓝航线中<mark>舰船面板属性的计算</mark>、<mark>编队配置</mark>等。可调整舰船的等级、突破等级、好感、强化值、改造进度等所有参与白值运算的数值，可携带装备与兵装，可自由调整舰队科技提供的属性值，并实时计算舰船的最终面板。</p>
        <p>为了保证代码的简洁和可维护性，本工具将暂时不在舰船的<mark>等级</mark>、<mark>突破等级</mark>和<mark>改造进度</mark>这三个参数之间做任何相互的约束；同时，可携带装备种类也可能因突破等级和舰种的变化而产生差异，请自行调整以符合实际情况。</p>
        <p p="t-8" text="center">Copyright © 2023-{{ currentYear }} <nuxt-link to="https://github.com/KazariEX" target="_blank">KazariEX</nuxt-link></p>
    </article>
</template>

<style lang="scss" scoped>
    p {
        --uno: "m-(t-2 b-4) leading-loose";
    }

    a {
        --uno: "underline-(~ slate/40 dashed offset-4)";

        &:hover {
            --uno: "text-primary";
        }
    }
</style>
