import { createShip, deserialize, serialize, type Ship } from "maestrale";

export const useFleetStore = defineStore("fleet", () => {
    const main1 = shallowRef<Ship | null>(null);
    const main2 = shallowRef<Ship | null>(null);
    const main3 = shallowRef<Ship | null>(null);
    const main = computed(() => [
        main1.value,
        main2.value,
        main3.value
    ] as const);

    const vanguard1 = shallowRef<Ship | null>(null);
    const vanguard2 = shallowRef<Ship | null>(null);
    const vanguard3 = shallowRef<Ship | null>(null);
    const vanguard = computed(() => [
        vanguard1.value,
        vanguard2.value,
        vanguard3.value
    ] as const);

    const technology = useTechnology();
    const storage = useLocalStorage("fleet", "");

    try {
        const res = deserialize(storage.value, {
            technology
        }) as {
            main: typeof main.value;
            vanguard: typeof vanguard.value;
        };

        main1.value = res.main[0];
        main2.value = res.main[1];
        main3.value = res.main[2];

        vanguard1.value = res.vanguard[0];
        vanguard2.value = res.vanguard[1];
        vanguard3.value = res.vanguard[2];
    }
    catch {
        main2.value = createShip(60501, {
            technology
        });
        vanguard1.value = createShip(60104, {
            technology
        });
        vanguard2.value = createShip(60105, {
            technology
        });
    }

    watchImmediate([main, vanguard], () => {
        storage.value = serialize({
            main: main.value,
            vanguard: vanguard.value
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
        main1,
        main2,
        main3,
        main,
        vanguard1,
        vanguard2,
        vanguard3,
        vanguard,
        currentShip,
        attrMode,
        infoMode,
        panelTab,
        setCurrentShip
    };
});