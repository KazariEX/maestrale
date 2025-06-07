import type { Nationality } from "maestrale";

export const nationalityMap: Record<Nationality, string> = {
    0: "通用",
    1: "白鹰",
    2: "皇家",
    3: "重樱",
    4: "铁血",
    5: "东煌",
    6: "撒丁帝国",
    7: "北方联合",
    8: "自由鸢尾",
    9: "维希教廷",
    10: "鸢尾教国",
    11: "郁金王国",
    96: "飓风",
    97: "META",
    101: "海王星",
    102: "哔哩哔哩",
    103: "传颂之物",
    104: "KizunaAI",
    105: "Hololive",
    106: "维纳斯假期",
    107: "偶像大师",
    108: "SSSS",
    109: "Atelier Ryza",
    110: "闪乱神乐NL",
    111: "To LOVE-Ru",
    112: "黑岩射手",
};

export const nationalityOptions = createSelectorOptions(nationalityMap);
