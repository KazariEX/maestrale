<script setup>
    const fleetStore = useFleetStore();

    //时间
    const time = ref(0);

    //战力
    const powers = computed(() => {
        return [
            ...fleetStore.main,
            ...fleetStore.vanguard
        ].reduce((res, ship) => {
            return res + Math.floor(ship?.power || 0);
        }, 0);
    });

    //分数
    const score = computed(() => {
        return Math.floor((5000 / Math.pow(time.value + 50, 0.36) - Math.pow(powers.value, 0.6)) * 10);
    });
</script>

<template>
    <el-card shadow="never">
        <el-form class="ex-score-panel">
            <el-form-item label="时间">
                <el-input-number
                    v-model="time"
                    :min="0"
                />
            </el-form-item>
            <el-form-item label="分数">
                <el-input-number
                    v-model="score"
                    :controls="false"
                    readonly
                />
            </el-form-item>
        </el-form>
    </el-card>
</template>

<style lang="scss" scoped>
    .ex-score-panel {
        display: flex;
        gap: 20px;

        .el-form-item {
            flex: 1;
            margin-bottom: 0;
        }

        .el-input-number {
            width: 100%;
        }
    }
</style>