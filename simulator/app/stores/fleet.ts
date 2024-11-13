import { createShip, deserialize, serialize, type Ship } from "maestrale";
import type { ShallowRef, UnwrapRef } from "vue";

interface Fleet {
    name: string;
}

type FleetShip = ShallowRef<Ship | null>;

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
    const surfaceFleets = ref<SurfaceFleet[]>([]);
    const submarineFleets = ref<SubmarineFleet[]>([]);

    const technology = useTechnology();
    const storage = useLocalStorage("fleet", "");

    const currentSurfaceIdx = ref(0);
    const currentSurfaceFleet = computed(() => {
        return surfaceFleets.value[currentSurfaceIdx.value]!;
    });

    const currentSubmarineIdx = ref(0);
    const currentSubmarineFleet = computed(() => {
        return submarineFleets.value[currentSubmarineIdx.value]!;
    });

    try {
        const res = deserialize(storage.value, {
            technology
        }) as {
            surfaceFleets: UnwrapRef<SurfaceFleet[]>;
            submarineFleets: UnwrapRef<SubmarineFleet[]>;
        };

        for (const raw of res.surfaceFleets) {
            addSurfaceFleet(raw.name, [
                raw.main1,
                raw.main2,
                raw.main3,
                raw.vanguard1,
                raw.vanguard2,
                raw.vanguard3
            ]);
        }

        for (const raw of res.submarineFleets) {
            addSubmarineFleet(raw.name, [
                raw.submarine1,
                raw.submarine2,
                raw.submarine3
            ]);
        }
    }
    catch {
        addSurfaceFleet("初始编队", [
            null,
            60501,
            null,
            60104,
            60105,
            null
        ]);
        addSubmarineFleet("初始编队", [
            null,
            null,
            null
        ]);
    }

    watchImmediate([surfaceFleets, submarineFleets], () => {
        storage.value = serialize({
            surfaceFleets: surfaceFleets.value,
            submarineFleets: submarineFleets.value
        });
    }, {
        deep: true
    });

    function addSurfaceFleet(name: string = "新编队", ids: (Ship | number | null)[] = []) {
        surfaceFleets.value.push({
            name,
            main1: createShallowShip(ids[0]),
            main2: createShallowShip(ids[1]),
            main3: createShallowShip(ids[2]),
            vanguard1: createShallowShip(ids[3]),
            vanguard2: createShallowShip(ids[4]),
            vanguard3: createShallowShip(ids[5])
        } as any);
        currentSurfaceIdx.value = surfaceFleets.value.length - 1;
    }

    function removeSurfaceFleet() {
        surfaceFleets.value.splice(currentSurfaceIdx.value, 1);
        currentSurfaceIdx.value = Math.min(currentSurfaceIdx.value, surfaceFleets.value.length - 1);
    }

    function addSubmarineFleet(name: string = "新编队", ids: (Ship | number | null)[] = []) {
        submarineFleets.value.push({
            name,
            submarine1: createShallowShip(ids[0]),
            submarine2: createShallowShip(ids[1]),
            submarine3: createShallowShip(ids[2])
        } as any);
        currentSubmarineIdx.value = submarineFleets.value.length - 1;
    }

    function removeSubmarineFleet() {
        submarineFleets.value.splice(currentSubmarineIdx.value, 1);
        currentSubmarineIdx.value = Math.max(0, currentSubmarineIdx.value - 1);
    }

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
        surfaceFleets,
        submarineFleets,
        currentSurfaceIdx,
        currentSurfaceFleet,
        currentSubmarineIdx,
        currentSubmarineFleet,
        currentShip,
        attrMode,
        infoMode,
        panelTab,
        addSurfaceFleet,
        removeSurfaceFleet,
        addSubmarineFleet,
        removeSubmarineFleet,
        setCurrentShip
    };
});

function createShallowShip(id: Ship | number | null | undefined) {
    const technology = useTechnology();
    const ship = typeof id === "number" ? createShip(id, { technology }) : id;
    return shallowRef(ship ?? null);
}