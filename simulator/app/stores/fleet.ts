import { createShip, deserialize, serialize, type Ship } from "maestrale";
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
    const surface = useFleet<SurfaceFleet>([
        "main1",
        "main2",
        "main3",
        "vanguard1",
        "vanguard2",
        "vanguard3"
    ]);
    const submarine = useFleet<SubmarineFleet>([
        "submarine1",
        "submarine2",
        "submarine3"
    ]);

    const technology = useTechnology();
    const storage = useLocalStorage("fleet", "");

    try {
        const res = deserialize(storage.value, {
            technology
        }) as {
            surfaceFleets: SurfaceFleet[];
            submarineFleets: SubmarineFleet[];
        };

        for (const raw of res.surfaceFleets) {
            surface.add(raw.name, [
                raw.main1,
                raw.main2,
                raw.main3,
                raw.vanguard1,
                raw.vanguard2,
                raw.vanguard3
            ]);
        }

        for (const raw of res.submarineFleets) {
            submarine.add(raw.name, [
                raw.submarine1,
                raw.submarine2,
                raw.submarine3
            ]);
        }
    }
    catch {
        surface.add("初始编队", [
            null,
            60501,
            null,
            60104,
            60105,
            null
        ]);
        submarine.add("初始编队", [
            null,
            null,
            null
        ]);
    }

    watchImmediate([surface.fleets, submarine.fleets], () => {
        storage.value = serialize({
            surfaceFleets: surface.fleets,
            submarineFleets: submarine.fleets
        });
    }, {
        deep: true
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

function useFleet<T>(keys: (keyof T)[]) {
    const technology = useTechnology();

    const fleets = shallowReactive<T[]>([]);
    const currentIdx = ref(0);
    const currentFleet = computed(() => fleets[currentIdx.value]!);

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