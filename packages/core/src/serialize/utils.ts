export function parsePath(path: string) {
    return path.split(/\.|(?=\[\])/);
}

export function* normalizePath(obj: any, path: string[]): Generator<string[]> {
    const key = path[0];
    if (obj === void 0 || !path.length) {
        if (key !== "[]") {
            yield [];
        }
    }
    else if (key === "[]") {
        for (const [key, value] of Object.entries(obj)) {
            for (const res of normalizePath(value, path.slice(1))) {
                yield [key, ...res];
            }
        }
    }
    else {
        for (const res of normalizePath(obj[key], path.slice(1))) {
            yield [key, ...res];
        }
    }
}
