import { defineConfig } from "tsdown";

export default defineConfig([{
    exports: {
        devExports: true,
    },
}, {
    entry: {
        postinstall: "./src/scripts/index.ts",
    },
    outDir: "./scripts",
    dts: false,
    external: [
        "undici",
    ],
}]);
