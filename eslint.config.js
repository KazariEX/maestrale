import zin from "@zinkawaii/eslint-config";

export default zin({
    ignores: [
        "packages/data/{generated,resources}/**/*.json",
        "packages/data/scripts/*.js",
    ],
    rules: {
        "no-useless-constructor": "off",
        "ts/no-namespace": "off",
        "vue/prefer-import-from-vue": "off",
    },
});
