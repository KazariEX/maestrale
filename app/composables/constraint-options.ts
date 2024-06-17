interface ConstraintTable {
    [T: number]: string
}

export function useConstraintOptions(table: ConstraintTable, {
    total = false
} = {}) {
    const res = Object.entries(table).map(([key, value]) => ({
        value: Number(key),
        label: value
    }));

    if (total) {
        res.unshift({
            value: 0,
            label: "全部"
        });
    }

    return res;
}