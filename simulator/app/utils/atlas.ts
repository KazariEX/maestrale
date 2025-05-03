export function getCommanderIconAtlas(name: string) {
    return `/assets/artresource/atlas/commandericon/${name}.png`;
}

export function getCommanderTalentIconAtlas(name: string) {
    return `/assets/artresource/atlas/commandertalenticon/${name}.png`;
}

export function getEquipIconAtlas(name: string) {
    return `/assets/artresource/atlas/equips/${name}.png`;
}

export function getRarityBackgroundAtlas(rarity: number, meta = false) {
    return `/assets/artresource/atlas/weaponframes/bg${meta ? "1" : ""}${rarity}.png`;
}

export function getRarityFrameAtlas(rarity: number) {
    return `/assets/artresource/atlas/weaponframes/frame_${rarity}.png`;
}

export function getSPWeaponIconAtlas(name: string) {
    return `/assets/artresource/atlas/spweapon/${name}.png`;
}

export function getSquareIconAtlas(name: string) {
    return `/assets/artresource/atlas/squareicon/${name}.png`;
}

export function getTransformIconAtlas(name: string) {
    return `/assets/artresource/atlas/modicon/${name}.png`;
}
