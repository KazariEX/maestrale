interface RarityGetter {
    (): number
}

export function useRarityStyle(getter: RarityGetter) {
    return {
        backgroundStyle: computed(() => {
            const rarity = transform(getter);
            return rarity ? {
                backgroundImage: `url(/image/artresource/atlas/weaponframes/bg${rarity}.png)`
            } : {};
        }),
        frameStyle: computed(() => {
            const rarity = transform(getter);
            return rarity ? {
                backgroundImage: `url(/image/artresource/atlas/weaponframes/frame_${rarity}.png)`
            } : {};
        })
    }
}

function transform(getter: RarityGetter) {
    return Math.max(2, getter()) - 1;
}