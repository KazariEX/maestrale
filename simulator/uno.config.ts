import { defineConfig, presetAttributify, presetUno, transformerDirectives } from "unocss";

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify()
    ],
    transformers: [
        transformerDirectives()
    ],
    theme: {
        colors: {
            primary: {
                50: "var(--p-primary-50)",
                100: "var(--p-primary-100)",
                200: "var(--p-primary-200)",
                300: "var(--p-primary-300)",
                400: "var(--p-primary-400)",
                500: "var(--p-primary-500)",
                600: "var(--p-primary-600)",
                700: "var(--p-primary-700)",
                800: "var(--p-primary-800)",
                900: "var(--p-primary-900)",
                DEFAULT: "var(--p-primary-500)"
            }
        }
    }
});