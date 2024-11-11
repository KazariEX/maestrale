export interface UseRarityStyleOptions {
    mode?: "general" | "spweapon";
}

export function useRarityStyle(getter: MaybeRefOrGetter<number>, options?: UseRarityStyleOptions) {
    const {
        mode = "general"
    } = options ?? {};

    const rarity = computed(() => {
        return Math.max(2, toValue(getter)) - (mode === "general" ? 1 : 0);
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