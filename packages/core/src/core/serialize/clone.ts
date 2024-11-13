/* eslint-disable ts/no-unsafe-function-type */

interface CreateCloneOptions {
    handlers: [Function, (obj: any) => any][];
}

export function createClone(options: CreateCloneOptions) {
    const handlers = new Map(options.handlers);

    return clone;

    function clone(obj: unknown): unknown {
        if (obj === null || obj === void 0) {
            return obj;
        }
        if (handlers.has(obj.constructor)) {
            const handler = handlers.get(obj.constructor)!;
            return handler(obj);
        }
        if (typeof obj !== "object") {
            return obj;
        }
        if (Array.isArray(obj)) {
            return cloneArray(obj);
        }
        return cloneObject(obj);
    }

    function cloneArray(arr: unknown[]) {
        const res: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            const cur = arr[i];
            res[i] = clone(cur);
        }
        return res;
    }

    function cloneObject(obj: object) {
        const res: any = {};
        for (const key in obj) {
            const cur = Reflect.get(obj, key);
            res[key] = clone(cur);
        }
        return res;
    }
}