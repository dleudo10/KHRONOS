import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";

// TODO(api): reemplazar por resultados reales del backend
const SUGGESTIONS = [
    { group: "Pacientes", items: ["Buscar por nombre o documento"] },
    { group: "Habitaciones", items: ["Buscar por número o piso"] },
    { group: "Camas", items: ["Buscar por código de cama"] },
];

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

const GlobalSearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
            }
        };

        const onClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onClickOutside);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, []);

    // En móvil el input está oculto hasta que se abre, por eso se enfoca aquí
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    return (
        <div ref={wrapperRef} className={`search-wrap${open ? " open" : ""}`}>
            <div className="search" onClick={() => setOpen(true)}>
                <Icon name="search" size={17} />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder="Buscar paciente, habitación, cama..."
                    aria-label="Buscar"
                />
                <kbd>{isMac ? "⌘ K" : "Ctrl K"}</kbd>
            </div>

            {open && (
                <div className="search-panel">
                    {query.trim() === "" ? (
                        SUGGESTIONS.map((section) => (
                            <div key={section.group} className="px-2 py-1.5">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    {section.group}
                                </p>
                                {section.items.map((item) => (
                                    <p key={item} className="py-1 text-sm text-slate-600">
                                        {item}
                                    </p>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="px-3 py-4 text-sm text-slate-500">
                            Sin resultados para “{query}”. La búsqueda estará disponible pronto.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;