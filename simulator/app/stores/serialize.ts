import { createDeserializer, createSerializer } from "maestrale";

export const useSerializeStore = defineStore("serialize", () => {
    const technology = useTechnology();
    const mapping = useLocalStorage("mapping", {});

    const serializer = createSerializer();
    const deserializer = createDeserializer(mapping.value, {
        technology
    });

    function serialize(key: string, source: object) {
        const data = serializer.serialize(source);
        localStorage.setItem(key, data);
        localStorage.setItem("mapping", JSON.stringify(serializer.mapping));
    }

    function deserialize(key: string) {
        const data = localStorage.getItem(key);
        return data && deserializer.deserialize(data);
    }

    return {
        serialize,
        deserialize
    };
});