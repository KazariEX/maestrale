import { createFleet, createShip, type Fleet, type Ship, type SubmarineFleet, type SurfaceFleet } from "maestrale";
import type { ShallowRef } from "vue";

export const useFleetStore = defineStore("fleet", () => {
    const surface = useSerializableFleets<SurfaceFleet>("surface", {
        schema: {
            main1: null,
            main2: 60501,
            main3: null,
            vanguard1: 60104,
            vanguard2: 60105,
            vanguard3: null
        }
    });
    const submarine = useSerializableFleets<SubmarineFleet>("submarine", {
        schema: {
            submarine1: null,
            submarine2: null,
            submarine3: null
        }
    });

    const currentShip = shallowRef<Ship | null>(null);
    const attrMode = ref<"equips" | "tech" | "commanders">("equips");
    const infoMode = ref<"details" | "equips">("details");
    const panelTab = ref<"strengthen" | "transform">("strengthen");

    function setCurrentShip(ship: Ship | null) {
        if (currentShip.value === ship) {
            currentShip.value = null;
        }
        else {
            currentShip.value = ship;
            panelTab.value = "strengthen";
        }
    }

    return {
        surface,
        submarine,
        currentShip,
        attrMode,
        infoMode,
        panelTab,
        setCurrentShip
    };
});

export type SerializableFleets<T extends Fleet> = ReturnType<typeof useSerializableFleets<T>>;

interface UseSerializableFleetsOptions<T> {
    initialName?: string;
    defaultName?: string;
    schema: Partial<Record<keyof T, number | null>>;
}

function useSerializableFleets<T extends Fleet>(
    type: "surface" | "submarine",
    options: UseSerializableFleetsOptions<T>
) {
    const {
        initialName = "初始编队",
        defaultName,
        schema
    } = options;

    const storageKey = type + "-fleets";

    const serializeStore = useSerializeStore();
    const technology = useTechnology();

    const fleets = shallowReactive<T[]>([]);
    const currentIdx = ref(0);
    const currentFleet = computed(() => fleets[currentIdx.value]!);

    serializeStore.use(storageKey, fleets);

    try {
        const localFleets = serializeStore.deserialize(storageKey) as T[];
        fleets.push(...localFleets);
    }
    catch {
        add(initialName, schema);
    }

    function add(name = defaultName, schema: typeof options.schema = {}) {
        const fleet = createFleet(type, name);
        for (const key in schema) {
            const shipRef = Reflect.get(fleet, key) as ShallowRef<Ship | null>;
            shipRef.value = normalizeShip(schema[key]);
        }
        fleets.push(fleet as any);
        currentIdx.value = fleets.length - 1;
    }

    function remove() {
        fleets.splice(currentIdx.value, 1);
        currentIdx.value = Math.min(currentIdx.value, fleets.length - 1);
    }

    function normalizeShip(value: Ship | number | null | undefined) {
        const ship = typeof value === "number" ? createShip(value, { technology }) : value;
        return ship ?? null;
    }

    return {
        fleets,
        currentIdx,
        currentFleet,
        add,
        remove
    };
}