import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

// Debe coincidir con el breakpoint donde tu CSS oculta el sidebar
const MOBILE_QUERY = "(max-width: 1200px)";

interface LayoutContextValue {
    isMobile: boolean;
    sidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            if (!e.matches) setSidebarOpen(false); // al volver a desktop se resetea
        };
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    // Escape cierra el sidebar y se bloquea el scroll del body mientras está abierto en móvil
    useEffect(() => {
        if (!isMobile || !sidebarOpen) return;

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
        document.addEventListener("keydown", onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [isMobile, sidebarOpen]);

    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

    const value = useMemo(
        () => ({ isMobile, sidebarOpen, openSidebar, closeSidebar, toggleSidebar }),
        [isMobile, sidebarOpen, openSidebar, closeSidebar, toggleSidebar]
    );

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
    const ctx = useContext(LayoutContext);
    if (!ctx) throw new Error("useLayout debe usarse dentro de <LayoutProvider>");
    return ctx;
};