import { computed, type ComputedRef, ref, type Ref, shallowRef, watch } from "@vue/reactivity";
import { ShipFleetKey } from "../utils";
import type { Commander } from "./commander";
import type { Ship } from "./ship";

export abstract class Fleet {
    constructor(name: string) {
        this.name = ref(name);
    }

    // 名称
    name: Ref<string>;

    // 舰船
    abstract ships: ComputedRef<(Ship | null)[]>;

    // 指挥喵
    commander1 = shallowRef<Commander | null>(null);
    commander2 = shallowRef<Commander | null>(null);
    commanders = computed(() => [
        this.commander1.value,
        this.commander2.value,
    ]);
}

export class SurfaceFleet extends Fleet {
    constructor(name: string) {
        super(name);
        track(this);
    }

    ships = computed(() => [
        this.main1.value,
        this.main2.value,
        this.main3.value,
        this.vanguard1.value,
        this.vanguard2.value,
        this.vanguard3.value,
    ]);

    // 主力：旗舰
    main1 = shallowRef<Ship | null>(null);
    // 主力：僚舰
    main2 = shallowRef<Ship | null>(null);
    // 主力：僚舰
    main3 = shallowRef<Ship | null>(null);

    // 先锋：领舰
    vanguard1 = shallowRef<Ship | null>(null);
    // 先锋：中位
    vanguard2 = shallowRef<Ship | null>(null);
    // 先锋：尾舰
    vanguard3 = shallowRef<Ship | null>(null);
}

export class SubmarineFleet extends Fleet {
    constructor(name: string) {
        super(name);
        track(this);
    }

    ships = computed(() => [
        this.submarine1.value,
        this.submarine2.value,
        this.submarine3.value,
    ]);

    // 潜艇：旗舰
    submarine1 = shallowRef<Ship | null>(null);
    // 潜艇：僚舰
    submarine2 = shallowRef<Ship | null>(null);
    // 潜艇：僚舰
    submarine3 = shallowRef<Ship | null>(null);
}

export function createFleet(type: "surface" | "submarine", name: string = "新编队") {
    switch (type) {
        case "surface":
            return new SurfaceFleet(name);
        case "submarine":
            return new SubmarineFleet(name);
    }
}

function track<T extends Fleet>(fleet: T) {
    watch(fleet.ships, (newVal: (Ship | null)[], oldVal: (Ship | null)[]) => {
        for (let i = 0; i < newVal.length; i++) {
            const oldShip = oldVal[i];
            const newShip = newVal[i];
            if (oldShip === newShip) {
                continue;
            }
            if (oldShip && !fleet.ships.value.includes(oldShip)) {
                oldShip[ShipFleetKey].value = null;
            }
            if (newShip) {
                newShip[ShipFleetKey].value = fleet;
            }
        }
    });
}
