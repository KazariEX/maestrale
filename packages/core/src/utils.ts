export const ShipFleetKey = Symbol();

export function notNullish<T>(obj: T): obj is NonNullable<T> {
    return obj !== null && obj !== void 0;
}

export function objectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof T)[];
}
