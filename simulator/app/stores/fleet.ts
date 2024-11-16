import { createShip, type Ship } from "maestrale";

export interface BaseFleet {
    name: string;
}

interface SurfaceFleet extends BaseFleet {
    main1: Ship | null;
    main2: Ship | null;
    main3: Ship | null;
    vanguard1: Ship | null;
    vanguard2: Ship | null;
    vanguard3: Ship | null;
}

interface SubmarineFleet extends BaseFleet {
    submarine1: Ship | null;
    submarine2: Ship | null;
    submarine3: Ship | null;
}

export const useFleetStore = defineStore("fleet", () => {
    const surface = useSerializableFleets<SurfaceFleet>("surface-fleets", {
        schema: {
            main1: null,
            main2: 60501,
            main3: null,
            vanguard1: 60104,
            vanguard2: 60105,
            vanguard3: null
        }
    });
    const submarine = useSerializableFleets<SubmarineFleet>("submarine-fleets", {
        schema: {
            submarine1: null,
            submarine2: null,
            submarine3: null
        }
    });

    const currentShip = shallowRef<Ship | null>(null);
    const attrMode = ref<"equips" | "tech">("equips");
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

export type SerializableFleets<T extends BaseFleet> = ReturnType<typeof useSerializableFleets<T>>;

interface UseSerializableFleetsOptions<T> {
    initialName?: string;
    defaultName?: string;
    schema: Partial<Record<keyof T, number | null>>;
}

function useSerializableFleets<T extends BaseFleet>(
    key: string,
    options: UseSerializableFleetsOptions<T>
) {
    const {
        initialName = "初始编队",
        defaultName = "新编队",
        schema
    } = options;

    const keys = Object.keys(schema);

    const serializeStore = useSerializeStore();
    const technology = useTechnology();

    const fleets = shallowReactive<T[]>([]);
    const currentIdx = ref(0);
    const currentFleet = computed(() => fleets[currentIdx.value]!);

    watchDeep(fleets, () => {
        serializeStore.serialize(key, fleets);
    });

    try {
        const localFleets = serializeStore.deserialize(key) as T[];
        for (const fleet of localFleets) {
            add(fleet.name, keys.map((key) => Reflect.get(fleet, key) as Ship));
        }
    }
    catch {
        add(initialName, Object.values(schema));
    }

    function add(name = defaultName, values: (Ship | number | null)[] = []) {
        const fleet = shallowReactive({
            name,
            ...Object.fromEntries(
                keys.map((key, i) => [key, normalizeShip(values[i])])
            )
        });
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