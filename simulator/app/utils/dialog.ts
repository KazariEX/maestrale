import { DialogConfirm, DialogInput } from "#components";

export function requireConfirm(content: string) {
    return new Promise<boolean | undefined>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogConfirm, {
            content,
            onClose(val) {
                close();
                resolve(val);
            }
        }), {
            immediate: true
        });
    });
}

interface RequireInputOptions {
    title: string;
    defaultValue?: string;
}

export function requireInput(options: RequireInputOptions) {
    const {
        title,
        defaultValue = ""
    } = options;

    return new Promise<string | undefined>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogInput, {
            title,
            defaultValue,
            onClose(val) {
                close();
                resolve(val);
            }
        }), {
            immediate: true
        });
    });
}