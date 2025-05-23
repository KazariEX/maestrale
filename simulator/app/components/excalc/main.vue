<script lang="ts" setup>
    const excalcStore = useExcalcStore();
    const { currentInfo } = storeToRefs(excalcStore);

    const killRate = ref(0);

    const score = computed(() => {
        const powers = Math.max(
            currentInfo.value.main.reduce((prev, ship) => {
                return prev + ship;
            }, 0) +
            currentInfo.value.pioneer.reduce((prev, ship) => {
                return prev + ship;
            }, 0),
            0,
        );
        return Math.floor((5000 / (currentInfo.value.time + 50) ** 0.36 - powers ** 0.6) * 10);
    });

    async function roll() {
        const { roll } = await import("@maestrale/excalc");
        killRate.value = roll(currentInfo.value);
    }
</script>

<template>
    <div grid="~ gap-4">
        <excalc-form label="血量">
            <prime-input-number
                input-class="text-center"
                size="small"
                fluid
                :min="0"
                :allow-empty="false"
                :use-grouping="false"
                v-model="currentInfo.health"
            />
        </excalc-form>
        <excalc-form label="次数">
            <prime-input-number
                input-class="text-center"
                size="small"
                fluid
                :min="0"
                :allow-empty="false"
                :use-grouping="false"
                v-model="currentInfo.times"
            />
        </excalc-form>
        <prime-button
            size="small"
            severity="info"
            variant="outlined"
            @click="roll"
        >Roll</prime-button>
        <excalc-form label="斩杀率">
            <prime-input-number
                input-class="text-center"
                size="small"
                fluid
                readonly
                :use-grouping="false"
                :model-value="killRate"
            />
        </excalc-form>
        <div h="1px" m="y-2" bg="border"></div>
        <excalc-form label="时间">
            <prime-input-number
                input-class="text-center"
                size="small"
                fluid
                :min="0"
                :allow-empty="false"
                :use-grouping="false"
                v-model="currentInfo.time"
            />
        </excalc-form>
        <excalc-form label="分数">
            <prime-input-number
                input-class="text-center"
                size="small"
                fluid
                readonly
                :use-grouping="false"
                :model-value="score"
            />
        </excalc-form>
    </div>
</template>
