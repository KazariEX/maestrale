<script lang="ts" setup>
    import { breakoutOptions } from "~/data/constants/breakout";
    import { favorOptions } from "~/data/constants/favor";

    const settingStore = useSettingStore();
</script>

<template>
    <ul>
        <setting-item title="默认等级" desc="创建新舰船时的初始等级">
            <prime-input-number
                w="36"
                input-class="text-center"
                size="small"
                :min="1"
                :max="125"
                fluid
                show-buttons
                button-layout="horizontal"
                v-model="settingStore.defaults.level"
            />
        </setting-item>
        <setting-item title="默认突破等级" desc="创建新舰船时的初始突破等级">
            <prime-select
                w="36"
                size="small"
                :options="breakoutOptions"
                option-label="label"
                option-value="value"
                v-model="settingStore.defaults.breakout"
            />
        </setting-item>
        <setting-item title="默认好感度" desc="创建新舰船时的初始好感度">
            <prime-select
                w="36"
                size="small"
                :options="favorOptions"
                option-label="label"
                option-value="value"
                v-model="settingStore.defaults.favor"
            />
        </setting-item>
    </ul>
</template>
