import { useRef, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/Button";
import IntervenorDetail from "../components/detail/IntervenorDetail";
import { IntervenorDrawer } from "../components/form/IntervenorDrawer";
import EmptyIntervenors from "../components/list/EmptyIntervenors";
import { IntervenorCards } from "../components/list/IntervenorCards";
import { IntervenorList } from "../components/list/IntervenorList";
import { IntervenorsToolbar } from "../components/list/IntervenorsToolbar";
import { Pagination } from "../components/shared/Pagination";
import IntervenorKPIs from "../components/summary/IntervenorKPIs";
import { INTERVENOR_PAGE_SIZES } from "../constants";
import { useChangeIntervenorStatus } from "../hooks/useChangeIntervenorStatus";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useGetIntervenors } from "../hooks/useGetIntervenors";
import { useGetIntervenorsSummary } from "../hooks/useGetIntervenorsSummary";
import { useSaveIntervenor } from "../hooks/useSaveIntervenor";
import { toIntervenorPayload, type IntervenorFormValues } from "../schemas/intervenor.schema";
import type { IntervenorStatusFilter, IntervenorView } from "../types/intervenor.types";

type DrawerMode = null | "create" | "edit";

const MOBILE_LIST_BREAKPOINT = 640;
const STACKED_LAYOUT_BREAKPOINT = 1000;

const initialView = (): IntervenorView =>
    typeof window !== "undefined" && window.innerWidth < MOBILE_LIST_BREAKPOINT ? "list" : "cards";

const IntervenorsPage = () => {
    // ── Filtros y paginación de la lista ─────────────────
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<IntervenorStatusFilter>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(INTERVENOR_PAGE_SIZES[0]);
    const [view, setView] = useState<IntervenorView>(initialView);
    
    // ── Selección y formularios ──────────────────────────
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [drawer, setDrawer] = useState<DrawerMode>(null);
    const detailRef = useRef<HTMLElement | null>(null);
    
    // ── Datos ────────────────────────────────────────────
    const debouncedSearch = useDebouncedValue(search, 150);
    const { data, isLoading, isError, refetch } = useGetIntervenors({
        page,
        pageSize,
        search: debouncedSearch,
        isActive: status === "all" ? undefined : status === "active",
    });
    const summaryQuery = useGetIntervenorsSummary();

    const intervenors = data?.data?.results ?? [];
    const total = data?.data?.count ?? 0;
    const summary = summaryQuery.data?.success ? summaryQuery.data.data : undefined;

    // Si no hay selección válida en la página actual, se muestra el primero.
    const selected = intervenors.find(item => item.id === selectedId) ?? intervenors[0] ?? null;

    const counts: Record<IntervenorStatusFilter, number | undefined> = {
        all: summary?.total_intervenors,
        active: summary?.active_intervenors,
        inactive: summary ? summary.total_intervenors - summary.active_intervenors : undefined,
    };

    const hasFilters = search.trim() !== "" || status !== "all";

    // ── Mutaciones ───────────────────────────────────────
    const saveIntervenor = useSaveIntervenor();
    const changeStatus = useChangeIntervenorStatus();

    useEscapeKey(drawer !== null, () => setDrawer(null));

    // ── Handlers ─────────────────────────────────────────
    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPage(1);
    };

    const handleSelect = (id: number) => {
        setSelectedId(id);

        if (window.innerWidth < STACKED_LAYOUT_BREAKPOINT) {
            window.setTimeout(
                () => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                60,
            );
        }
    };

    const handleSave = async (values: IntervenorFormValues) => {
        const editing = drawer === "edit" && selected !== null;

        const response = await saveIntervenor.mutateAsync({
            id: editing ? selected.id : undefined,
            payload: toIntervenorPayload(values),
        });

        if (!editing && response.data) {
            clearFilters();
            setSelectedId(response.data.id);
        }

        setDrawer(null);
    };

    const handleChangeStatus = async () => {
        if (!selected) return;

        await changeStatus.mutateAsync({ id: selected.id, isActive: !selected.is_active });
        setDrawer(null);
    };

    // ── Render ───────────────────────────────────────────
    return (
        <>
            <PageHeader
                title="Interventores"
                subtitle="Gestiona equipos, usuarios, disponibilidad y desempeño operativo."
                actions={
                    <Button variant="primary" icon="plus" onClick={() => setDrawer("create")}>
                        Nuevo interventor
                    </Button>
                }
            />

            <IntervenorKPIs />

            <IntervenorsToolbar
                search={search}
                onSearch={value => { setSearch(value); setPage(1); }}
                status={status}
                onStatus={value => { setStatus(value); setPage(1); }}
                counts={counts}
                view={view}
                onView={setView}
            />

            {isLoading ? (
                <p className="ivr-form-lead">Cargando interventores...</p>
            ) : isError ? (
                <div className="panel" role="alert">
                    <p>No se pudieron cargar los interventores.</p>
                    <button type="button" onClick={() => refetch()}>Reintentar</button>
                </div>
            ) : intervenors.length === 0 ? (
                <EmptyIntervenors
                    hasFilters={hasFilters}
                    onClearFilters={clearFilters}
                    onCreate={() => setDrawer("create")}
                />
            ) : (
                <>
                    {view === "cards" ? (
                        <IntervenorCards intervenors={intervenors} selectedId={selected?.id ?? null} onSelect={handleSelect} />
                    ) : (
                        <IntervenorList intervenors={intervenors} selectedId={selected?.id ?? null} onSelect={handleSelect} />
                    )}

                    <Pagination
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPage={setPage}
                        onSize={size => { setPageSize(size); setPage(1); }}
                        sizes={INTERVENOR_PAGE_SIZES}
                        label="interventores"
                    />
                </>
            )}

            {selected && (
                <IntervenorDetail
                    key={selected.id}
                    intervenor={selected}
                    detailRef={detailRef}
                    onEdit={() => setDrawer("edit")}
                />
            )}

            {drawer !== null && (
                <IntervenorDrawer
                    key={drawer === "edit" ? `edit-${selected?.id}` : "create"}
                    intervenor={drawer === "edit" ? selected : null}
                    existing={intervenors}
                    onClose={() => setDrawer(null)}
                    onSave={handleSave}
                    onChangeStatus={drawer === "edit" && selected ? handleChangeStatus : undefined}
                    statusLoading={changeStatus.isPending}
                />
            )}
        </>
    );
};

export default IntervenorsPage;
