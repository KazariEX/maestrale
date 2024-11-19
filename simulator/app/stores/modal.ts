import { promiseTimeout } from "@vueuse/core";
import type { Raw } from "vue";

interface ModalContext {
    component: VNode;
    zIndex: number;
    duration: number;
    isOpening: Ref<boolean>;
    close: () => any;
}

interface UseModalOptions {
    duration?: number;
    immediate?: boolean;
    unique?: boolean;
}

export const useModalStore = defineStore("modal", () => {
    const modals = ref<Raw<ModalContext>[]>([]);

    function use(render: () => VNode, options: UseModalOptions = {}) {
        const {
            duration = 400,
            immediate = false,
            unique = false
        } = options;

        let ctx: ModalContext;

        const isOpening = ref(false);

        immediate && open();

        function open() {
            if (unique && indexOf() !== -1) return;

            const component = render();
            const last = modals.value.at(-1);
            const zIndex = (last?.zIndex ?? 510) + 2;

            ctx = {
                component,
                zIndex,
                duration,
                isOpening,
                close: (component.props ??= {}).onClose ??= close
            };

            modals.value.push(ctx);
            nextTick(() => {
                isOpening.value = true;
            });
        }

        async function close() {
            isOpening.value = false;
            await promiseTimeout(duration);

            const i = indexOf();
            if (i !== -1) {
                modals.value.splice(i, 1);
            }
        }

        function indexOf() {
            return modals.value.indexOf(ctx);
        }

        return {
            open,
            close
        };
    }

    return {
        modals,
        use
    };
});