export const ShipFleetKey = Symbol();

export function nonNullable<T>(obj: T): obj is NonNullable<T> {
    return obj !== null && obj !== void 0;
}

export function* entries<T extends object>(obj: T) {
    for (const key in obj) {
        yield [key, obj[key]!] as const;
    }
}
