import Icon from "../../../../components/ui/Icon";
import type { IntervenorStatusFilter, IntervenorView } from "../../types/intervenor.types";

type IntervenorsToolbarProps = {
    search: string;
    onSearch: (value: string) => void;
    status: IntervenorStatusFilter;
    onStatus: (value: IntervenorStatusFilter) => void;
    /** Totales globales (vienen del summary, no de la página actual). */
    counts: Record<IntervenorStatusFilter, number | undefined>;
    view: IntervenorView;
    onView: (value: IntervenorView) => void;
};

const STATUS_TABS: [IntervenorStatusFilter, string][] = [
    ["all", "Todos"],
    ["active", "Activos"],
    ["inactive", "Inactivos"],
];

export function IntervenorsToolbar({ search, onSearch, status, onStatus, counts, view, onView }: IntervenorsToolbarProps) {
    return (
        <div className="ivr-toolbar">
            <div className="search small-search ivr-search">
                <Icon name="search" size={16} />
                <input
                    placeholder="Buscar equipo, código o líder..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                />
            </div>

            <div className="ivr-seg" role="tablist" aria-label="Estado">
                {STATUS_TABS.map(([key, label]) => (
                    <button
                        type="button"
                        role="tab"
                        key={key}
                        aria-selected={status === key}
                        className={status === key ? "active" : ""}
                        onClick={() => onStatus(key)}
                    >
                        {label}<b>{counts[key] ?? "—"}</b>
                    </button>
                ))}
            </div>

            <div className="ivr-view" aria-label="Vista">
                <button
                    type="button"
                    className={view === "cards" ? "active" : ""}
                    onClick={() => onView("cards")}
                    title="Vista de tarjetas"
                    aria-label="Vista de tarjetas"
                >
                    <Icon name="grid" size={16} />
                    <span>Tarjetas</span>
                </button>

                <button
                    type="button"
                    className={view === "list" ? "active" : ""}
                    onClick={() => onView("list")}
                    title="Vista compacta"
                    aria-label="Vista compacta"
                >
                    <Icon name="menu" size={16} />
                    <span>Lista</span>
                </button>
            </div>
        </div>
    );
}
