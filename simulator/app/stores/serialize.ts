import { createSerializer } from "maestrale";

export const useSerializeStore = defineStore("serialize", () => {
    const technology = useTechnology();
    const mapping = useLocalStorage("mapping", {});

    const serializer = createSerializer({
        technology,
        mapping: mapping.value
    });

    function serialize(key: string, source: object) {
        const data = serializer.serialize(source);
        mapping.value = serializer.mapping;
        localStorage.setItem(key, data);
    }

    function deserialize(key: string) {
        const data = localStorage.getItem(key);
        return data && serializer.deserialize(data);
    }

    return {
        serialize,
        deserialize
    };
});