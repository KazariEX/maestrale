import { describe, expect, it } from "vitest";
import { normalizePath, parsePath } from "../src/serialize/utils";

describe("path", () => {
    it("parse", () => {
        const parsed = parsePath("foo.bar[].baz[][].qux");
        expect(parsed).toEqual(["foo", "bar", "[]", "baz", "[]", "[]", "qux"]);
    });

    it("normalize", () => {
        const normalized = normalizePath({
            foo: {
                bar: [
                    { baz: [
                        [{ qux: "val" }],
                    ] },
                    { baz: [
                        [{ qux: "val" }],
                        [{ qux: "val" }, { qux: "val" }],
                    ] },
                ],
            },
        }, ["foo", "bar", "[]", "baz", "[]", "[]", "qux"]);

        expect([...normalized]).toEqual([
            ["foo", "bar", "0", "baz", "0", "0", "qux"],
            ["foo", "bar", "1", "baz", "0", "0", "qux"],
            ["foo", "bar", "1", "baz", "1", "0", "qux"],
            ["foo", "bar", "1", "baz", "1", "1", "qux"],
        ]);
    });

    it("normalize w/ non-existent key", () => {
        const normalized = normalizePath({
            foo: {},
        }, ["foo", "bar", "baz"]);

        expect([...normalized]).toEqual([
            ["foo", "bar"],
        ]);
    });
});
