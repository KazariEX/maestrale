import { ShareCfg } from "@maestrale/data";
import { ref, type Ref, watch } from "@vue/reactivity";
import type { Ship } from "./index";

export interface TransformMatrixItem {
    template: ShareCfg.TransformDataTemplate;
    isEnabled: Ref<boolean>;
}

export interface Transform {
    matrix: [
        TransformMatrixItem[],
        TransformMatrixItem[],
        TransformMatrixItem[],
    ][];
    isModernized: Ref<boolean>;
    modernizedId: Ref<number>;
}

// 改造
export function useTransform(ship: Ship) {
    const items: Record<string, TransformMatrixItem> = {};

    // 构建三行六列的改造矩阵
    const matrix = ShareCfg.ship_data_trans[ship.id].transform_list.map((transform) => {
        const column: Transform["matrix"][number] = [[], [], []];

        for (const [index, id] of transform) {
            const item: TransformMatrixItem = {
                template: ShareCfg.transform_data_template[id],
                isEnabled: ref(true),
            };
            column[index - 2].push(item);
            items[id] = item;
        }
        return column;
    });

    // 获取展平的有效槽位
    const slots = matrix.flat(1).filter((slot) => slot.length);

    // 反向记录后续节点
    const nexts = new Map<TransformMatrixItem, TransformMatrixItem[]>(
        slots.map((slot) => [slot[0], []]),
    );
    for (const slot of slots) {
        for (const id of slot[0].template.condition_id) {
            const prev = items[id];
            nexts.get(prev)!.push(...slot);
        }
    }

    // 递归计算祖先和后代节点
    const ancestors = new Map<TransformMatrixItem, Set<TransformMatrixItem>>();
    const descendants = new Map<TransformMatrixItem, Set<TransformMatrixItem>>();

    for (const slot of slots) {
        track(slot[0], (it) => nexts.get(it) ?? [], descendants);
        track(slot[0], (it) => it.template.condition_id.map((id) => items[id]), ancestors);
    }

    const isModernized = ref(false);
    const modernizedId = ref<number>(null!);

    // 初始化更新
    for (const slot of slots) {
        for (let i = 0; i < slot.length; i++) {
            updateItem(slot[i], i === 0);
        }
    }

    let running = false;
    const keys = Object.keys(items);
    const source = Object.values(items).map((item) => item.isEnabled);

    watch(source, (newList: boolean[], oldList: boolean[]) => {
        // 单次批量更新，避免链式监听
        if (running) {
            return;
        }
        running = true;

        const i = newList.findIndex((value, index) => value !== oldList[index]);
        const item = items[keys[i]];
        const slot = slots.find((slot) => slot.includes(item))!;

        if (item.isEnabled.value) {
            // 1. 祖先节点
            for (const item of ancestors.get(slot[0])!) {
                updateItem(item, true);
            }

            // 2. 同槽节点
            if (slot.length > 1) {
                for (const sibling of slot.filter((it) => it.isEnabled.value && it !== item)) {
                    updateItem(sibling, false);
                }
            }

            // 3. 自身节点
            updateItem(item, true);
        }
        else {
            // 1. 后代节点
            for (const item of descendants.get(slot[0])!) {
                updateItem(item, false);
            }

            // 2. 自身节点
            updateItem(item, false);

            // 3. 同槽节点
            if (slot.length > 1) {
                const i = (slot.indexOf(item) + 1) % slot.length;
                updateItem(slot[i], true);
            }
        }

        setTimeout(() => {
            running = false;
        }, 0);
    });

    function updateItem(item: TransformMatrixItem, value: boolean) {
        item.isEnabled.value = value;

        if (item.template.name === "近代化改造") {
            isModernized.value = value;
        }

        if (item.template.ship_id.length) {
            const [from, to] = item.template.ship_id[0];
            modernizedId.value = value ? to : from;
        }
    }

    return {
        matrix,
        isModernized,
        modernizedId,
    };
}

function track<T extends object>(item: T, getter: (it: T) => T[], cache: Map<T, Set<T>>) {
    if (cache.has(item)) {
        return cache.get(item)!;
    }

    const result = new Set<T>();
    for (const adjacent of getter(item)) {
        result.add(adjacent);
        for (const neighbor of track(adjacent, getter, cache)) {
            result.add(neighbor);
        }
    }

    cache.set(item, result);
    return result;
}
