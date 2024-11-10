export function constraintToOptions(table: Record<string, string>) {
    return Object.entries(table).map(([key, value]) => ({
        label: value,
        value: Number(key)
    }));
}