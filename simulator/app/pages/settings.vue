<script lang="ts" setup>
    useHead({
        title: "设置",
    });
</script>

<template>
    <div max-w="150" m="x-auto">
        <prime-tabs value="fleet">
            <prime-tab-list>
                <prime-tab value="fleet">编队</prime-tab>
                <prime-tab value="advanced">高级</prime-tab>
                <prime-tab m="l-auto" value="about">关于</prime-tab>
            </prime-tab-list>
            <prime-tab-panels>
                <prime-tab-panel value="fleet">
                    <setting-fleet />
                </prime-tab-panel>
                <prime-tab-panel value="advanced">
                    <setting-advanced />
                </prime-tab-panel>
                <prime-tab-panel value="about">
                    <setting-about />
                </prime-tab-panel>
            </prime-tab-panels>
        </prime-tabs>
    </div>
</template>
