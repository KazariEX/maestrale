import { createShip, type Ship } from "maestrale";
import type { Raw } from "vue";

interface Fleet {
    name: string;
}

type FleetShip = Raw<Ship | null>;

interface SurfaceFleet extends Fleet {
    main1: FleetShip;
    main2: FleetShip;
    main3: FleetShip;
    vanguard1: FleetShip;
    vanguard2: FleetShip;
    vanguard3: FleetShip;
}

interface SubmarineFleet extends Fleet {
    submarine1: FleetShip;
    submarine2: FleetShip;
    submarine3: FleetShip;
}

export const useFleetStore = defineStore("fleet", () => {
    const surface = useFleets<SurfaceFleet>("surface-fleets", {
        main1: null,
        main2: 60501,
        main3: null,
        vanguard1: 60104,
        vanguard2: 60105,
        vanguard3: null
    });
    const submarine = useFleets<SubmarineFleet>("submarine-fleets", {
        submarine1: null,
        submarine2: null,
        submarine3: null
    });

    const currentShip = shallowRef<Ship | null>(null);
    const attrMode = ref<"equips" | "tech">("equips");
    const infoMode = ref<"details" | "equips">("details");
    const panelTab = ref<"strengthen" | "transform">("strengthen");

    function setCurrentShip(ship: Ship | null) {
        if (currentShip.value !== ship) {
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

function useFleets<T extends Fleet>(
    key: string,
    schema: Record<Exclude<keyof T, keyof Fleet>, number | null>
) {
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
        add("初始编队", Object.values(schema));
    }

    function add(name: string = "新编队", ids: (Ship | number | null)[] = []) {
        const fleet = shallowReactive({
            name,
            ...Object.fromEntries(
                keys.map((key, i) => [key, createShallowShip(ids[i])])
            )
        });
        fleets.push(fleet as any);
        currentIdx.value = fleets.length - 1;
    }

    function remove() {
        fleets.splice(currentIdx.value, 1);
        currentIdx.value = Math.min(currentIdx.value, fleets.length - 1);
    }

    function createShallowShip(id: Ship | number | null | undefined) {
        const ship = typeof id === "number" ? createShip(id, { technology }) : id;
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