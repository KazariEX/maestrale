import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { updateTechnology } from "./technology";
import { vvvip, type VVVIP } from "./vvvip";

try {
    const { ProxyAgent, setGlobalDispatcher } = await import("undici");
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY!).toString() });
    setGlobalDispatcher(dispatcher);
}
catch {}

const baseUrl = "https://raw.githubusercontent.com/AzurLaneTools/AzurLaneData/refs/heads/main/";
let version = "0.0.0";

// 版本号
const uri = "versions/CN.txt";
const { href } = new URL(uri, baseUrl);
const res = await fetch(href);
if (res.status !== 200) {
    console.error(`✘ Failed to fetch version (${res.status})`);
    process.exit(1);
}
version = await res.text();

const path = resolve(import.meta.dirname, "../package.json");
const file = await readFile(path, "utf-8");
const json = JSON.parse(file);
if (json.version !== version) {
    console.info(`✔ Fetch version "${version}"`);
    await updateData();
    await writeFile(path, file.replace(/"version": ".+"/, `"version": "${version}"`));
}

// 数据生成
await Promise.all(Object.entries(vvvip).map(([key, { folder, props }]) => pick(key, {
    folder,
    props,
})));

// 数据更新
function updateData() {
    return Promise.all(Object.entries(vvvip).map(async ([filename, { folder }]) => {
        const uri = `${folder}/${filename}.json`;
        const { href } = new URL(uri, baseUrl + "CN/");

        try {
            const res = await fetch(href);
            if (res.status !== 200) {
                throw 0;
            }
            const data = await res.text();
            const path = resolve(import.meta.dirname, "../resources", uri);

            await writeFile(path, data);
            console.info(`✔ Fetch "${uri}"`);
        }
        catch (err) {
            console.error(`✘ Failed to fetch "${uri}"`);
            throw err;
        }
    }));
}

// 属性过滤
async function pick(filename: string, { folder, props }: VVVIP) {
    if (!props.length) {
        return;
    }

    const inputPath = resolve(import.meta.dirname, "../resources", folder, filename + ".json");
    const outputPath = resolve(import.meta.dirname, "../generated", filename + ".json");

    const file = await readFile(inputPath);
    const json = JSON.parse(file.toString());

    const data: Record<string, Record<string, unknown>> = {};
    for (const id in json) {
        if (id === "all") {
            continue;
        }
        data[id] = {};
        for (const key of props) {
            if (key in json[id]) {
                data[id][key] = json[id][key];
            }
        }
    }
    await writeFile(outputPath, JSON.stringify(data));
}

// 舰队科技
await updateTechnology();
