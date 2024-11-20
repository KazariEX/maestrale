export const ShipFleetKey = Symbol();

export function* entries<T extends object>(obj: T) {
    for (const key in obj) {
        yield [key, obj[key]!] as const;
    }
}