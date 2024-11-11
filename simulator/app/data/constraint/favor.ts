import type { Favor } from "maestrale";

export const favorMap: Record<Favor, string> = {
    0: "失望",
    1: "陌生",
    2: "友好",
    3: "喜欢",
    4: "爱",
    5: "誓约",
    6: "誓约+"
};

export const favorOptions = resolveConstraintOptions(favorMap);