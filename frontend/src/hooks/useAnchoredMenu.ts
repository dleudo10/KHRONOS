import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { useEscapeKey } from "./useEscapeKey";

type MenuAnchor = { id: number; top: number; right: number };

const MENU_HEIGHT = 110;
const GAP = 6;
const EDGE = 8;

/** Menú contextual anclado al botón que lo abre; se cierra con scroll, resize o Esc. */
export function useAnchoredMenu() {
    const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
    const close = useCallback(() => setAnchor(null), []);

    useEffect(() => {
        if (!anchor) return;

        window.addEventListener("scroll", close, true);
        window.addEventListener("resize", close);
        return () => {
            window.removeEventListener("scroll", close, true);
            window.removeEventListener("resize", close);
        };
    }, [anchor, close]);

    useEscapeKey(anchor !== null, close);

    const toggle = (e: MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();

        if (anchor?.id === id) {
            close();
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const below = rect.bottom + GAP;

        setAnchor({
            id,
            right: Math.max(EDGE, window.innerWidth - rect.right),
            top: below + MENU_HEIGHT > window.innerHeight
                ? Math.max(EDGE, rect.top - GAP - MENU_HEIGHT)
                : below,
        });
    };

    return { anchor, toggle, close };
}
