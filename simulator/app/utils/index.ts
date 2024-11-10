export function delay(duration: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function constraintToOptions(table: Record<string, string>) {
    return Object.entries(table).map(([key, value]) => ({
        label: value,
        value: Number(key)
    }));
}