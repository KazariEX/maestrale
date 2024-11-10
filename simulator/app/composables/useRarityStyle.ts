export function useRarityStyle(getter: MaybeRefOrGetter<number>) {
    const rarity = computed(() => {
        return Math.max(2, toValue(getter)) - 1;
    });

    const backgroundStyle = computed(() => {
        return rarity.value ? {
            backgroundImage: `url(/image/artresource/atlas/weaponframes/bg${rarity.value}.png)`
        } : {};
    });

    const frameStyle = computed(() => {
        return rarity.value ? {
            backgroundImage: `url(/image/artresource/atlas/weaponframes/frame_${rarity.value}.png)`
        } : {};
    });

    return {
        backgroundStyle,
        frameStyle
    };
}