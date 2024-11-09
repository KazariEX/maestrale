export function walk<T extends object>(
    obj: T,
    func: (key: keyof T, value: NonNullable<T[keyof T]>) => boolean | void
) {
    for (const key in obj) {
        const res = func(key, obj[key]!);
        if (res === false) {
            break;
        }
    }
}