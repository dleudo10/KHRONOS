import { useState } from "react";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { MEMBER_PAGE_SIZES } from "../../constants";
import { useAddMember } from "../../hooks/useAddMember";
import { useAnchoredMenu } from "../../hooks/useAnchoredMenu";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useGetMembers } from "../../hooks/useGetMembers";
import { useRemoveMember } from "../../hooks/useRemoveMember";
import { useSetLeader } from "../../hooks/useSetLeader";
import type { Intervenor } from "../../types/intervenor.types";
import type { AddMemberPayload, IntervenorMember, MemberStatusFilter } from "../../types/member.types";
import { Pagination } from "../shared/Pagination";
import EmptyMembers from "./EmptyMembers";
import { MemberActionsMenu } from "./MemberActionsMenu";
import { MemberDrawer } from "./MemberDrawer";
import MembersTable from "./MembersTable";

type MembersPanelProps = {
    intervenor: Intervenor;
};

/**
 * Usuarios asociados a un interventor. Aquí viven las 3 funcionalidades:
 *   1. agregar miembro (con opción de líder)  → useAddMember
 *   2. nombrar / quitar líder                 → useSetLeader
 *   3. quitar miembro                         → useRemoveMember
 */
export function MembersPanel({ intervenor }: MembersPanelProps) {
    // Filtros (se reinician solos: el padre usa key={intervenor.id})
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<MemberStatusFilter>("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(MEMBER_PAGE_SIZES[0]);

    // UI
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<IntervenorMember | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const menu = useAnchoredMenu();

    // Datos
    const debouncedSearch = useDebouncedValue(search.trim());
    const { data, isLoading, isError } = useGetMembers(intervenor.id, {
        page,
        pageSize,
        search: debouncedSearch,
        status,
    });
    const members = data?.data?.results ?? [];
    const total = data?.data?.count ?? 0;

    // Mutaciones
    const addMember = useAddMember(intervenor.id);
    const setLeader = useSetLeader(intervenor.id);
    const removeMember = useRemoveMember(intervenor.id);

    useEscapeKey(drawerOpen, () => setDrawerOpen(false));
    useEscapeKey(memberToRemove !== null, () => setMemberToRemove(null));

    const hasFilters = search.trim() !== "" || status !== "all";
    const menuMember = menu.anchor ? members.find(m => m.id === menu.anchor?.id) : undefined;

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPage(1);
    };

    /** Ejecuta una acción y deja el mensaje de error visible si falla. */
    const runAction = async (action: () => Promise<unknown>, errorMessage: string) => {
        setActionError(null);
        try {
            await action();
        } catch {
            setActionError(errorMessage);
        }
    };

    // 1. Agregar miembro. El drawer captura el error y lo muestra dentro del formulario.
    const handleAdd = async (payload: AddMemberPayload) => {
        await addMember.mutateAsync(payload);
        setActionError(null);
        clearFilters();
        setDrawerOpen(false);
    };

    // 2. Nombrar / quitar líder
    const handleToggleLeader = (member: IntervenorMember) =>
        runAction(
            () => setLeader.mutateAsync({membership_id: member.id, is_leader: member.is_leader ? false : true}),
            "No se pudo actualizar el liderazgo.",
        );

    // 3. Quitar miembro
    const handleRemove = async () => {
        if (!memberToRemove) return;

        const target = memberToRemove;
        const wasLastOnPage = members.length === 1 && page > 1;

        setMemberToRemove(null);
        await runAction(async () => {
            await removeMember.mutateAsync(target.id);
            if (wasLastOnPage) setPage(page - 1);
        }, "No se pudo quitar al usuario del equipo.");
    };

    return (
        <>
            <div className="detail-section-head ivr-members-head">
                <div>
                    <h3>Usuarios asociados</h3>
                    <span>Disponibilidad del turno actual</span>
                </div>

                <div className="ivr-members-tools">
                    <div className="search small-search">
                        <Icon name="search" />
                        <input
                            placeholder="Buscar usuario..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    <select
                        className="ivr-select"
                        value={status}
                        onChange={e => { setStatus(e.target.value as MemberStatusFilter); setPage(1); }}
                        aria-label="Filtrar usuarios"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Disponibles</option>
                        <option value="inactive">No disponibles</option>
                        <option value="leader">Líder</option>
                    </select>

                    <Button variant="primary" icon="plus" onClick={() => setDrawerOpen(true)}>
                        Asociar usuario
                    </Button>
                </div>
            </div>

            <div className="ivr-members">
                {actionError && <p role="alert" className="form-error">{actionError}</p>}

                {isLoading ? (
                    <p className="ivr-form-lead">Cargando usuarios...</p>
                ) : isError ? (
                    <p role="alert" className="form-error">No se pudieron cargar los usuarios del equipo.</p>
                ) : members.length === 0 ? (
                    <EmptyMembers
                        hasFilters={hasFilters}
                        onAdd={() => setDrawerOpen(true)}
                        onClearFilters={clearFilters}
                    />
                ) : (
                    <MembersTable members={members} onOpenMenu={menu.toggle} /> 
                )}

                {total > 0 && (
                    <Pagination
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPage={setPage}
                        onSize={size => { setPageSize(size); setPage(1); }}
                        sizes={MEMBER_PAGE_SIZES}
                        label="usuarios"
                    />
                )}
            </div>

            {menu.anchor && menuMember && (
                <MemberActionsMenu
                    member={menuMember}
                    top={menu.anchor.top}
                    right={menu.anchor.right}
                    onClose={menu.close}
                    onToggleLeader={() => { 
                        menu.close(); 
                        handleToggleLeader(menuMember); 
                    }}
                    onRemove={() => { 
                        menu.close(); 
                        setMemberToRemove(menuMember); 
                    }}
                />
            )}

            {drawerOpen && (
                <MemberDrawer
                    intervenor={intervenor}
                    onClose={() => setDrawerOpen(false)}
                    onSubmit={handleAdd}
                />
            )}

            {memberToRemove && (
                <ConfirmDialog
                    title="¿Quitar usuario del equipo?"
                    text={`${memberToRemove.user.external_id} dejará de pertenecer a ${intervenor.name} y no recibirá sus tareas.`}
                    confirmLabel="Quitar del equipo"
                    onCancel={() => setMemberToRemove(null)}
                    onConfirm={handleRemove}
                />
            )}
        </>
    );
}
