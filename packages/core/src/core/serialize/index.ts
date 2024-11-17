import { isRef, toRaw, toValue } from "@vue/reactivity";
import { Commander, CommanderAbility, createCommander, createCommanderAbility } from "../commander";
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

register("commander", Commander, {
    paths: [
        "id",
        "level",
        "name",
        "abilities[]"
    ],
    initialize(_, raw) {
        return createCommander(raw.id);
    }
});

register("commander-ability", CommanderAbility, {
    paths: [
        "id"
    ],
    initialize(_, raw) {
        return createCommanderAbility(raw.id);
    }
});

interface RegisterConstructOptions {
    paths: string[];
    initialize: (options: CreateSerializerOptions, raw: Record<string, any>) => any;
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
                    rawObj = rawObj[key] ??= {};
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

    function deserialize(options: CreateSerializerOptions, ctx: DeserializeContext, raw: object, id: number) {
        const source = initialize(options, raw);
        const normalizedPaths = parsedPaths.flatMap((path) => [...normalizePath(raw, path)]);

        ctx.track(id, name, source);

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
        return source;
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

interface DeserializeContext {
    resolve: (raw: unknown) => unknown;
    track: (id: number, name: string, source: object) => object;
}

export interface CreateSerializerOptions {
    technology: ITechnology;
    mapping?: Record<string, object>;
}

export function createSerializer(options: CreateSerializerOptions) {
    const internalKeys = new WeakMap<object, string>();
    const mapping = options.mapping ?? {};
    let curId = 0;

    function serialize(source: object) {
        const serialized = new WeakSet();

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

        curId = Number(Object.keys(mapping).at(-1) ?? -1) + 1;
        return JSON.stringify(clone(source));
    }

    function deserialize(data: string) {
        const sources: Record<number, unknown> = {};

        const ctx: DeserializeContext = {
            resolve(raw) {
                if (typeof raw !== "string") {
                    return raw;
                }
                try {
                    const { name, id } = parseInternalKey(raw);
                    if (id in sources) {
                        return sources[id];
                    }
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
                internalKeys.set(source, key);
                sources[id] = source;
                return source;
            }
        };

        const clone = createClone({
            handlers: [
                [String, (raw) => ctx.resolve(raw)]
            ]
        });

        return clone(JSON.parse(data));
    }

    return {
        mapping,
        serialize,
        deserialize
    };
}

function* normalizePath(obj: any, path: string[]): Generator<string[]> {
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

function resolveInternalKey(id: number, name: string) {
    return `id(${name}):${id}`;
}

function parseInternalKey(key: string) {
    const match = key.match(/^id\((?<name>[-\w]+)\):(?<id>\d+)$/);
    if (!match) {
        throw 0;
    }
    const { name, id } = match.groups!;
    return {
        name,
        id: Number(id)
    };
}