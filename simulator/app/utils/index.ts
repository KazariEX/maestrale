export function delay(duration: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function constraintToOptions<K extends number, V>(table: Record<K, V>) {
    return Object.entries(table).map(([key, value]) => ({
        label: value,
        value: Number(key)
    } as {
        label: V;
        value: K;
    }));
}