import { promiseTimeout } from "@vueuse/core";

interface DialogContext {
    vnode: VNode;
    zIndex: number;
    duration: number;
    isOpening: Ref<boolean>;
    close: () => any;
}

interface UseDialogOptions {
    duration?: number;
    immediate?: boolean;
    unique?: boolean;
}

export const useDialogStore = defineStore("dialog", () => {
    const dialogs = shallowReactive<DialogContext[]>([]);

    function use(render: () => VNode, options: UseDialogOptions = {}) {
        const {
            duration = 400,
            immediate = false,
            unique = false,
        } = options;

        let ctx: DialogContext;

        const isOpening = ref(false);

        immediate && open();

        function open() {
            if (unique && indexOf() !== -1) {
                return;
            }

            const vnode = render();
            const last = dialogs.at(-1);
            const zIndex = (last?.zIndex ?? 510) + 2;

            ctx = {
                vnode,
                zIndex,
                duration,
                isOpening,
                close: (vnode.props ??= {}).onClose ??= close,
            };

            dialogs.push(ctx);
            vnode.props.onVnodeMounted = () => {
                isOpening.value = true;
            };
        }

        async function close() {
            isOpening.value = false;
            await promiseTimeout(duration);

            const i = indexOf();
            if (i !== -1) {
                dialogs.splice(i, 1);
            }
        }

        function indexOf() {
            return dialogs.indexOf(ctx);
        }

        return {
            open,
            close,
        };
    }

    return {
        dialogs,
        use,
    };
});
