import type { Attributes } from "../types";

// 创建属性对象
export function createAttributes(options: Partial<Attributes> = {}): Attributes {
    return {
        durability: 0,
        cannon: 0,
        torpedo: 0,
        antiaircraft: 0,
        air: 0,
        reload: 0,
        hit: 0,
        dodge: 0,
        speed: 0,
        luck: 0,
        antisub: 0,
        ...options
    };
}

// 遍历属性对象
export function walkAttributes(attrs: Partial<Attributes>, func: (attr: keyof Attributes, value: number) => void) {
    for (const attr in attrs) {
        func(attr as keyof Attributes, attrs[attr as keyof Attributes]!);
    }
}