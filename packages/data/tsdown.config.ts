import { defineConfig } from "tsdown";

export default defineConfig([{
    entry: [
        "./src/index.ts",
    ],
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
