export const ShipFleetKey = Symbol();

export function notNullish<T>(obj: T): obj is NonNullable<T> {
    return obj !== null && obj !== void 0;
}

export function objectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof T)[];
}

export function defineLazyProperty<T>(obj: object, key: string, getter: () => T) {
    let cache: T;
    Object.defineProperty(obj, key, {
        get: () => cache ??= getter(),
    });
}
