import { createSerializer } from "maestrale";

export const useSerializeStore = defineStore("serialize", () => {
    const technology = useTechnology();
    const mapping = useLocalStorage("mapping", {});

    const serializer = createSerializer({
        technology,
        mapping: mapping.value
    });

    const storageKeys = [
        "commanders",
        "surface-fleets",
        "submarine-fleets"
    ] as const;

    function use(key: (typeof storageKeys)[number], source: object) {
        watchDebounced(source, (value) => {
            serialize(key, value);
        }, {
            deep: true,
            debounce: 1000
        });
    }

    function serialize(key: string, source: object) {
        const raw = serializer.serialize(source);
        mapping.value = serializer.mapping;
        localStorage.setItem(key, JSON.stringify(raw));
    }

    function deserialize(key: string) {
        const data = localStorage.getItem(key);
        return data && serializer.deserialize(JSON.parse(data));
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
        serialize,
        deserialize,
        cleanup,
        clear
    };
});