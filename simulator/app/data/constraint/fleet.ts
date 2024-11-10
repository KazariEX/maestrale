const table = {
    main: [
        4,
        5,
        6,
        7,
        10,
        12,
        13,
        21,
        24
    ],
    vanguard: [
        1,
        2,
        3,
        18,
        19,
        20,
        23
    ],
    submarine: [
        8,
        17,
        22
    ]
};

export type Fleet = keyof typeof table;

export const fleetMap = Object.fromEntries(
    Object.entries(table).flatMap(([fleet, types]) => types.map((type) => [type, fleet as Fleet]))
);