import { computed, type ComputedRef, ref, type Ref, shallowRef } from "@vue/reactivity";
import type { Commander } from "./commander";
import type { Ship } from "./ship";

export abstract class Fleet {
    name: Ref<string>;
    abstract ships: ComputedRef<(Ship | null)[]>;

    constructor(
        name: string
    ) {
        // 名称
        this.name = ref(name);
    }

    // 指挥喵
    commander1 = shallowRef<Commander | null>(null);
    commander2 = shallowRef<Commander | null>(null);
    commander3 = shallowRef<Commander | null>(null);
    commanders = computed(() => [
        this.commander1.value,
        this.commander2.value,
        this.commander3.value
    ]);
}

export class SurfaceFleet extends Fleet {
    ships = computed(() => [
        this.main1.value,
        this.main2.value,
        this.main3.value,
        this.vanguard1.value,
        this.vanguard2.value,
        this.vanguard3.value
    ]);

    // 主力
    main1 = shallowRef<Ship | null>(null);
    main2 = shallowRef<Ship | null>(null);
    main3 = shallowRef<Ship | null>(null);

    // 先锋
    vanguard1 = shallowRef<Ship | null>(null);
    vanguard2 = shallowRef<Ship | null>(null);
    vanguard3 = shallowRef<Ship | null>(null);
}

export class SubmarineFleet extends Fleet {
    ships = computed(() => [
        this.submarine1.value,
        this.submarine2.value,
        this.submarine3.value
    ]);

    // 潜艇
    submarine1 = shallowRef<Ship | null>(null);
    submarine2 = shallowRef<Ship | null>(null);
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