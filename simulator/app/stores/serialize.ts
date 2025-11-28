import { createSerializer } from "maestrale";

export const useSerializeStore = defineStore("serialize", () => {
    const technology = useTechnologyStore();
    const mapping = useLocalStorage("mapping", {});

    const serializer = createSerializer({
        technology,
        mapping: mapping.value,
    });

    const storageKeys = [
        "commanders",
        "surface-fleets",
        "submarine-fleets",
    ] as const;

    function use<T extends object>(
        key: typeof storageKeys[number],
        source: T,
        initialize: (storeValue: T) => void,
        fallback?: () => void,
    ) {
        const data = localStorage.getItem(key);
        if (data === null) {
            fallback?.();
        }
        // eslint-disable-next-line curly
        else try {
            const storeValue = serializer.deserialize(JSON.parse(data)) as T;
            initialize?.(storeValue as T);
        }
        catch {
            fallback?.();
        }

        watchDebounced(source, (value) => {
            const raw = serializer.serialize(value);
            mapping.value = serializer.mapping;
            localStorage.setItem(key, JSON.stringify(raw));
        }, {
            deep: true,
            debounce: 1000,
        });
    }

    function cleanup() {
        const raw = storageKeys.map((key) => JSON.parse(localStorage.getItem(key) ?? "0"));
        serializer.cleanup(raw);
        mapping.value = serializer.mapping;
    }

    function clear() {
        for (const key of storageKeys) {
            localStorage.removeItem(key);
        }
        mapping.value = {};
    }

    return {
        mapping,
        use,
        cleanup,
        clear,
    };
});
