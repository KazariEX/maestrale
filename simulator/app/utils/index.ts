export function createConstraintOptions<K extends number, V>(table: Record<K, V>) {
    return Object.entries(table).map(([key, value]) => ({
        label: value,
        value: Number(key),
    } as {
        label: V;
        value: K;
    }));
}
