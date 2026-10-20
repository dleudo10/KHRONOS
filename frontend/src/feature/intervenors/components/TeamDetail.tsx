import { Pagination } from './Pagination';
import MembershipsList from './MembershipsList';
import EmptyTeams from './EmptyTeams';
import Icon from '../../../components/ui/Icon';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import type { MemberStatus, TeamDetailProps } from '../intervenors.types';
import { slaTone } from '../utils/slaTone';
import { fmtDate } from '../utils/fmtDate';
import { useGetIntervenorMemberships } from '../hooks/useGetIntervenorMemberships';
import { useMemo, useState } from 'react';
import { stripAccents } from '../../../utils/stripAccents';

const TeamDetail = ({
    team, 
	detailRef, 
	setDrawer, 
	toggleActive, 
	openMenu,
}: TeamDetailProps) => {
	const [mq, setMq] = useState("");
    const [mStatus, setMStatus] = useState<MemberStatus>("all");
    const [mPage, setMPage] = useState(1);
    const [mSize, setMSize] = useState(5);


	const { data, isLoading, isError } = useGetIntervenorMemberships(team.id);
	const list = data?.data?.results;

	// Adapta la respuesta de la API a la forma { m, u } que ya usa MembershipsList
    const allRows = useMemo(
        () =>
            (list ?? []).map(item => ({
                m: {
                    id: item.id,
                    userId: item.user,
                    intervenorId: item.intervenor,
                    isActive: "",
                    isLeader: item.is_leader,
                    createdAt: "",
                },
                u: {
                    id: item.user,
                    name: "",
                    email: "",
                },
            })),
        [list],
    );

    const rows = useMemo(() => {
        const term = stripAccents(mq).toLowerCase();

        return allRows
            .filter(({ m, u }) => {
                const byStatus =
                    mStatus === "all" ||
                    (mStatus === "active" && m.isActive) ||
                    (mStatus === "inactive" && !m.isActive) ||
                    (mStatus === "leader" && m.isLeader);

                const byTerm =
                    !term || stripAccents(`${u.name} ${u.email}`).toLowerCase().includes(term);

                return byStatus && byTerm;
            })
            .sort(
                (a, b) =>
                    Number(b.m.isLeader) - Number(a.m.isLeader) ||
                    a.u.name.localeCompare(b.u.name),
            );
    }, [allRows, mq, mStatus]);

    const pages = Math.max(1, Math.ceil(rows.length / mSize));
    const safeMPage = Math.min(mPage, pages);
    const pagedRows = rows.slice((safeMPage - 1) * mSize, safeMPage * mSize);

    const allMembers = useMemo(() => allRows.map(r => r.m), [allRows]);

    return (
        <section className="panel team-detail" ref={detailRef}>
            <div className="team-detail-head">
                <div>
                    <div className={`team-icon ta-${team.is_active ? slaTone(team.sla) : "neutral"}`}>
                        <Icon name="users" />
                    </div>

                    <div>
                        <span>DETALLE DEL INTERVENTOR · {team.code}</span>
                        <h2>
                            {team.name}
                            <Badge tone={team.is_active ? "success" : "neutral"}>
                                {team.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                        </h2>
                        <p>
                            {team.description || "Sin descripción."} · Líder: {team.leader ?? "Sin asignar"}
                        </p>
                    </div>
                </div>

                <div className="ivr-head-actions">
                    <Button icon="settings" onClick={() => setDrawer({ kind: "team", editing: true })}>
                        Editar equipo
                    </Button>
                    <Button variant="primary" icon="plus" onClick={() => setDrawer({ kind: "member" })}>
                        Asociar usuario
                    </Button>
                </div>
            </div>

            <div className="team-detail-kpis">
                <div>
                    <span>Usuarios activos</span>
                    <strong>{team.total_users}</strong>
                    <small>{list ? list.length : "—"} asociados en total</small>
                </div>

                <div>
                    <span>Tareas pendientes</span>
                    <strong>{team.pending}</strong>
                    <small>{team.pending > 0 ? "Requieren atención" : "Al día"}</small>
                </div>

                <div>
                    <span>Tiempo promedio</span>
                    <strong>{team.average}</strong>
                    <small>Objetivo: 20 min</small>
                </div>

                <div>
                    <span>Creado</span>
                    <strong className="ivr-date">{fmtDate(team.created_at)}</strong>
                    <small>Actualizado {fmtDate(team.updated_at)}</small>
                </div>
            </div>

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
                            value={mq}
                            onChange={e => { setMq(e.target.value); setMPage(1); }}
                        />
                    </div>

                    <select
                        className="ivr-select"
                        value={mStatus}
                        onChange={e => { setMStatus(e.target.value as MemberStatus); setMPage(1); }}
                        aria-label="Filtrar usuarios"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Disponibles</option>
                        <option value="inactive">No disponibles</option>
                        <option value="leader">Líder</option>
                    </select>
                </div>
            </div>

            <div className="ivr-members">
                {isLoading ? (
                    <p className="ivr-form-lead">Cargando usuarios...</p>
                ) : isError ? (
                    <p role="alert" className="form-error">No se pudieron cargar los usuarios del equipo.</p>
                ) : rows.length === 0 ? (
                    <EmptyTeams
                        team={team}
                        teamMembers={() => allMembers}
                        setDrawer={setDrawer}
                        setMq={setMq}
                        setMStatus={setMStatus}
                    />
                ) : (
                    <MembershipsList
                        pagedRows={pagedRows}
                        toggleActive={toggleActive}
                        openMenu={openMenu}
                    />
                )}

                {rows.length > 0 && (
                    <Pagination
                        total={rows.length}
                        page={safeMPage}
                        pageSize={mSize}
                        onPage={setMPage}
                        onSize={s => { setMSize(s); setMPage(1); }}
                        sizes={[5, 10, 20]}
                        label="usuarios"
                    />
                )}
            </div>
        </section>
    )
}

export default TeamDetail