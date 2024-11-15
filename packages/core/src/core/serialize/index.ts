import { isRef, toRaw, toValue } from "@vue/reactivity";
import { createEquip, Equip } from "../equip";
import { createShip, Ship } from "../ship";
import { createSPWeapon, SPWeapon } from "../spweapon";
import { createClone } from "./clone";
import type { ITechnology } from "../technology";

type ConstructRegistration = {
    name: string;
    structure: any;
} & ReturnType<typeof register>;

const registry: ConstructRegistration[] = [];

register("ship", Ship, {
    paths: [
        "id",
        "level",
        "favor",
        "breakout",
        "strengthen.adjustAttrs",
        "strengthen.blueprint",
        "transform.matrix[][][].enable",
        "equip1",
        "equip2",
        "equip3",
        "equip4",
        "equip5",
        "spweapon"
    ],
    initialize(options, raw) {
        return createShip(raw.id, {
            technology: options.technology
        });
    }
});

register("equip", Equip, {
    paths: [
        "id",
        "level"
    ],
    initialize(_, raw) {
        return createEquip(raw.id);
    }
});

register("spweapon", SPWeapon, {
    paths: [
        "id",
        "level"
    ],
    initialize(_, raw) {
        return createSPWeapon(raw.id);
    }
});

interface RegisterConstructOptions {
    paths: string[];
    initialize: (options: DeserializeOptions, raw: Record<string, any>) => any;
}

function register(name: string, structure: any, options: RegisterConstructOptions) {
    const {
        paths,
        initialize
    } = options;

    const parsedPaths = paths.map((path) => path.split(/\.|(?=\[\])/));

    function serialize(ctx: SerializeContext, source: object) {
        const normalizedPaths = parsedPaths.flatMap((path) => [...normalizePath(source, path)]);

        const raw: Record<string, unknown> = {};
        const key = ctx.track(name, source, raw);

        for (const path of normalizedPaths) {
            let srcObj: any = source;
            let rawObj: any = raw;

            for (let i = 0; i < path.length; i++) {
                const key = path[i];
                const nextKey = path[i + 1];

                srcObj = srcObj[key];
                if (nextKey !== void 0) {
                    rawObj = rawObj[key] ??= /\d+/.test(nextKey) ? [] : {};
                }
                else if (srcObj === void 0) {
                    break;
                }
                else {
                    const val = toRaw(toValue(srcObj));
                    rawObj[key] = ctx.resolve(val);
                }
            }
        }
        return key;
    }

    function deserialize(options: DeserializeOptions, ctx: DeserializeContext, raw: object, id: number) {
        const source = initialize(options, raw);
        const normalizedPaths = parsedPaths.flatMap((path) => [...normalizePath(source, path)]);

        const key = ctx.track(id, name, source);

        for (const path of normalizedPaths) {
            let srcObj: any = source;
            let rawObj: any = raw;

            for (let i = 0; i < path.length; i++) {
                const key = path[i];
                const nextKey = path[i + 1];

                rawObj = rawObj[key];
                if (nextKey === void 0) {
                    const val = ctx.resolve(rawObj);

                    if (isRef(srcObj[key])) {
                        srcObj[key].value = val;
                    }
                    else {
                        srcObj[key] = val;
                    }
                }
                srcObj = srcObj[key];
            }
        }
        return key;
    }

    registry.push({
        name,
        structure,
        serialize,
        deserialize
    });

    return {
        serialize,
        deserialize
    };
}

interface SerializeContext {
    resolve: (source: unknown) => unknown;
    track: (name: string, source: object, raw: object) => string;
}

export function createSerializer() {
    const internalKeys = new WeakMap<object, string>();
    const serialized = new Set<object>();
    const mapping: Record<string, object> = {};
    let curId = 0;

    const ctx: SerializeContext = {
        resolve(source) {
            if (source && serialized.has(source)) {
                return internalKeys.get(source)!;
            }
            for (const reg of registry) {
                if (source instanceof reg.structure) {
                    return reg.serialize(ctx, source as any);
                }
            }
            return source;
        },
        track(name, source, raw) {
            serialized.add(source);
            let id: number;
            let key: string;
            if (!internalKeys.has(source)) {
                id = curId++;
                key = resolveInternalKey(id, name);
                internalKeys.set(source, key);
            }
            else {
                key = internalKeys.get(source)!;
                id = parseInternalKey(key).id;
            }
            mapping[id] = raw;
            return key;
        }
    };

    const clone = createClone({
        handlers: registry.map(
            (reg) => [reg.structure, (obj) => reg.serialize(ctx, obj)]
        )
    });

    function serialize(source: object) {
        serialized.clear();
        return JSON.stringify(clone(source));
    }

    return {
        mapping,
        serialize
    };
}

interface DeserializeOptions {
    technology: ITechnology;
}

interface DeserializeContext {
    resolve: (raw: unknown) => unknown;
    track: (id: number, name: string, source: object) => object;
}

export function createDeserializer(mapping: Record<string, object>, options: DeserializeOptions) {
    const sources: Record<string, object> = {};

    const ctx: DeserializeContext = {
        resolve(raw) {
            if (typeof raw !== "string") {
                return raw;
            }
            if (raw in sources) {
                return sources[raw];
            }
            try {
                const { name, id } = parseInternalKey(raw);
                const obj = mapping[id];
                const { deserialize } = registry.find((r) => r.name === name)!;
                return deserialize(options, ctx, obj, id);
            }
            catch {
                return raw;
            }
        },
        track(id, name, source) {
            const key = resolveInternalKey(id, name);
            sources[key] = source;
            return source;
        }
    };

    const clone = createClone({
        handlers: [
            [String, ctx.resolve]
        ]
    });

    function deserialize(data: string) {
        return clone(JSON.parse(data));
    }

    return {
        deserialize
    };
}

function* normalizePath(obj: any, path: string[]): Generator<string[]> {
    if (obj === void 0 || !path.length) {
        yield [];
        return;
    }
    const key = path[0];
    if (key === "[]") {
        for (let j = 0; j < obj.length; j++) {
            for (const res of normalizePath(obj[j], path.slice(1))) {
                yield [j.toString(), ...res];
            }
        }
    }
    else {
        for (const res of normalizePath(obj[key], path.slice(1))) {
            yield [key, ...res];
        }
    }
}

function resolveInternalKey(id: number, name: string) {
    return `id(${name}):${id}`;
}

function parseInternalKey(key: string) {
    const match = key.match(/^id\((?<name>\w+)\):(?<id>\d+)$/);
    if (!match) {
        throw 0;
    }
    const { name, id } = match.groups!;
    return {
        name,
        id: Number(id)
    };
}