import antfu from "@antfu/eslint-config";
import zin from "@zinkawaii/eslint-config";

export default antfu({
    ignores: [
        "packages/data/{generated,resources}/**/*.json",
    ],
    pnpm: true,
    rules: {
        ...zin.standard,
        ...zin.recommended,
        ...zin.stylistic,
        ...zin.vue,
        ...zin.patch,
        "no-useless-constructor": "off",
        "ts/no-namespace": "off",
        "vue/prefer-import-from-vue": "off",
    },
});
