import { useRef, useState } from "react"
import PageHeader from "../../../components/common/PageHeader"
import Button from "../../../components/ui/Button"
import WorkflowTable from "../components/details/WorkflowTable"
import WorkflowKPIs from "../components/summary/WorkflowKPIs"
import type { WorkflowStatusFilter } from "../types/workflow.types"
import { useAnchoredMenu } from "../../../hooks/useAnchoredMenu"
import WorkflowActionsMenu from "../components/details/WorkflowActionsMenu"
import type { DrawerMode } from "../../../types/drawer.type"
import WorkflowDrawer from "../components/form/WorkflowDrawer"
import { useGetWorkflows } from "../hooks/useGetWorkflows"
import { useDebouncedValue } from "../../../hooks/useDebouncedValue"
import { toWorkflowPayload, type WorkflowFormValues } from "../schemas/workflow.schema"
import Icon from "../../../components/ui/Icon"
import EmptyWorkflows from "../components/list/EmptyWorkflows"
import { Pagination } from "../../../components/common/Pagination"
import { useEscapeKey } from "../../../hooks/useEscapeKey"
import { useSaveWorkflow } from "../hooks/useSaveWorkflow"
import { STACKED_LAYOUT_BREAKPOINT } from "../../../const"
import { useNavigate } from "react-router-dom"

export const WORKFLOW_PAGE_SIZES = [8, 10, 20];
export const MEMBER_PAGE_SIZES = [5, 10, 20];

const Workflows = () => {
    const navigate = useNavigate();
    // ── Filtros y paginación de la lista ─────────────────
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<WorkflowStatusFilter>("active");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(WORKFLOW_PAGE_SIZES[0]);

    // ── Selección y formularios ──────────────────────────
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [drawer, setDrawer] = useState<DrawerMode>(null);
    const detailRef = useRef<HTMLElement | null>(null);

    // ── Datos ────────────────────────────────────────────
    const debouncedSearch = useDebouncedValue(search, 150);
    const { data, isLoading, isError, refetch } = useGetWorkflows({
        page,
        pageSize,
        search: debouncedSearch,
        isActive: status === "all" ? undefined : status === "active",
    });

    const menu = useAnchoredMenu();
    const workflows = data?.data?.results ?? [];
    const total = data?.data?.count ?? 0;
    const menuMember = menu.anchor ? workflows.find(w => w.id === menu.anchor?.id) : undefined
    const selected = workflows.find(item => item.id === selectedId) ?? workflows[0] ?? null;

    const hasFilters = search.trim() !== "" || status !== "all";

    // ── Mutaciones ───────────────────────────────────────
    const saveWorkflow = useSaveWorkflow();
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

    const handleSave = async (values: WorkflowFormValues, configure = false) => {
        const editing = drawer === "edit" && selected !== null;
    
        const response = await saveWorkflow.mutateAsync({
            id: editing ? selected.id : undefined,
            payload: toWorkflowPayload(values),
        });
    
        if (!editing && response.data) {
            const workflowId = response.data.id;

            clearFilters();
            setSelectedId(response.data.id);

            if (configure) {
                const versionId = response.data.version_number;

                if (!versionId) {
                    throw new Error(
                        "El workflow se creó, pero no se recibió el ID de su versión."
                    );
                }

                navigate(
                    `/workflows/${workflowId}/version/${versionId}/builder`
                );

                return;
            }
        }
    
        setDrawer(null);
    };

    

    return (
        <>
            <PageHeader
                title="Workflows" 
                subtitle="Administra los flujos de trabajo que coordinan los procesos de la clínica." 
                actions={
                    <Button variant="primary" icon="plus" onClick={() => setDrawer("create")} >
                        Crear workflow
                    </Button>
                }
            />

            {/* POR REVISAR */}
            <WorkflowKPIs />


            <section className="panel workflow-admin">
                <div className="flex justify-between items-center pr-4 border-b border-(--line)">
                    <div className="workflow-filters">
                        <div className="search small-search">
                            <Icon name="search"/>
                            <input 
                                placeholder="Buscar por nombre o código..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                            
                        <select 
                            className="select-pill"
                            value={status}
                            onChange={e => {
                                setStatus(e.target.value as WorkflowStatusFilter);
                                setPage(1);
                            }}
                        >
                            <option value="all">Todos</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                    <div>
                        <Button icon="settings" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <p className="ivr-form-lead mt-4">Cargando workflows...</p>
                ) : isError ? (
                    <div className="panel mt-4" role="alert">
                        <p>No se pudieron cargar los workflows.</p>
                        <button type="button" onClick={() => refetch()}>Reintentar</button>
                    </div>
                ) : workflows.length === 0 ? (
                    <EmptyWorkflows 
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        onCreate={() => setDrawer("create")}
                    />
                ) : (
                    <WorkflowTable 
                        workflow={workflows}
                        onOpenMenu={menu.toggle}
                    />
                )}

                <Pagination
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPage={setPage}
                    onSize={size => { setPageSize(size); setPage(1); }}
                    sizes={WORKFLOW_PAGE_SIZES}
                    label="workflows"
                />
            </section>


            {menu.anchor && menuMember && (
                <WorkflowActionsMenu
                    top={menu.anchor.top}
                    right={menu.anchor.right}
                    onClose={menu.close}
                    menuMember={menuMember}
                    onEdit={() => setDrawer("edit")}
                    onSelect={handleSelect}
                />
            )}

            {drawer !== null && (
                <WorkflowDrawer
                    key={drawer === "edit" ? `edit-${selected?.id}` : "create"}
                    workflow={drawer === "edit" ? selected : null}
                    existing={workflows}
                    onClose={() => setDrawer(null)}
                    onSave={handleSave}
                />
            )}

        </>
    )
}

export default Workflows