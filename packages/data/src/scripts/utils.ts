import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function loadData<T>(path: string, generated = false) {
    path = resolve(import.meta.dirname, `../${generated ? "generated" : "resources"}`, path);
    const file = await readFile(path, "utf-8");
    const data = JSON.parse(file) as Record<string, T>;
    delete data.all;
    return data;
}
