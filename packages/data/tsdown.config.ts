import { defineConfig } from "tsdown";

export default defineConfig([{
    entry: [
        "./src/index.ts",
    ],
}, {
    entry: [
        "./src/scripts/index.ts",
    ],
    outDir: "./scripts",
    dts: false,
    external: [
        "undici",
    ],
}]);
