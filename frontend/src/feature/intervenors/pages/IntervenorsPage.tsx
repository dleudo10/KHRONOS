import { useEffect, useRef, useState, type MouseEvent } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../components/EmptyState";
import { TeamCards } from "../components/TeamCards";
import { Pagination } from "../components/Pagination";
import { TeamList } from "../components/TeamList";
import type { DrawerState, Membership, MemberStatus, TeamMetrics } from "../intervenors.types";
import TeamDetail from "../components/TeamDetail";
import { stripAccents } from "../../../utils/stripAccents";
import { DIRECTORY, SEED_METRICS } from "../data/simulate";
import { MemberDrawer } from "../components/MemberDrawer";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { TeamDrawer } from "../components/TeamDrawer";
import IntervenorKPIs from "../components/IntervenorKPIs";
import { useGetIntervenors } from "../hooks/useGetIntervenors";
import EmptyMemberships from "../components/EmptyMemberships";
import { useSaveIntervenor } from "../hooks/useSaveIntervenor";
import type { IntervenorFormValues } from "../schemas/intervenor.schema";
import { useChangeIntervenorStatus } from "../hooks/usechangeIntervenorStatus";

const userById = (id: number) => DIRECTORY.find(u => u.id === id);
const metricsFor = (id: number): TeamMetrics => SEED_METRICS[id] ?? { pending: 0, average: "—", sla: null };
 
function buildSeedMemberships(): Membership[] {
  // [equipo, usuarios, líder, usuarios inactivos]
	const plan: [number, number[], number | null, number[]][] = [
		[1, [1,2,3,4,5,6,7,8,9,10,11,12,13], 4, [5,11]],
		[2, [15,16,17,18,19,20], 15, [19]],
		[3, [14,21,22,23,3], 14, []],
		[4, [24,6,8,10,12,16,18,22,26], 24, [26]],
		[5, [1,4,15], 4, []],
		[6, [17,19,20], 17, []],
		[7, [5,25], 5, [25]],
		[8, [7,9,11], 7, []],
		[9, [], null, []],
	];
  	let id = 1;
  	return plan.flatMap(([teamId, users, leader, off]) => users.map(userId => ({
    	id: id++, userId, intervenorId: teamId, isActive: !off.includes(userId), isLeader: userId === leader, createdAt: "2025-04-02T08:00:00",
  	})));
}
 
const IntervenorsPage = () => {
    const [q, setQ] = useState("");
    const [teamPage, setTeamPage] = useState(1);
	const [teamPageSize, setTeamPageSize] = useState(8);
    const [statusFilter, setStatusFilter] = useState<"all"|"active"|"inactive">("all");

	const {data: response} = useGetIntervenors({
        page: teamPage,
        pageSize: teamPageSize,
        search: q.trim(),
		isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    })
    // const [teams, setTeams] = useState<Intervener[]>([]);
	
	const teams = response?.data?.results ?? [];
	const totalTeams = response?.data?.count ?? 0;
	const next = response?.data?.next ?? null;
	const previous = response?.data?.previous ?? null;

	const saveIntervenor = useSaveIntervenor();

	const handleSaveIntervenor = async ( values: IntervenorFormValues, ) => {
		if (drawer?.kind !== "team") return;

		const payload = {
			name: values.name,
			code: values.code,
			description: values.description,
			is_active: values.isActive,
		}

		const isEditing = drawer.editing && team;

		const response = await saveIntervenor.mutateAsync({
			id: isEditing ? team.id : undefined,
			payload,
		});

		if (!response?.success) {
			throw new Error(response?.message);
		}

		setDrawer(null);
	};


    const [memberships, setMemberships] = useState<Membership[]>(buildSeedMemberships);
    const [selectedId, setSelectedId] = useState<number | null>(1);
    const [view, setView] = useState<"cards"|"list">(() => typeof window !== "undefined" && window.innerWidth < 640 ? "list" : "cards");
    const [mq, setMq] = useState("");
    const [mStatus, setMStatus] = useState<MemberStatus>("all");
    const [mPage, setMPage] = useState(1);
    const [mSize, setMSize] = useState(5);
    const [drawer, setDrawer] = useState<DrawerState>(null);
    const [confirm, setConfirm] = useState<null | { kind: "remove"; id: number } | { kind: "delete"; id: number }>(null);
    const [menu, setMenu] = useState<null | { id: number; top: number; right: number }>(null);
    const nextId = useRef(5000);
    const detailRef = useRef<HTMLElement | null>(null);
    
    const team = teams.find(t => t.id === selectedId) ?? null;
    const teamMembers = (id: number) => memberships.filter(m => m.intervenorId === id);
    const leaderOf = (id: number) => { const m = teamMembers(id).find(x => x.isLeader); return m ? userById(m.userId)?.name ?? null : null; };
    const activeCount = (id: number) => teamMembers(id).filter(m => m.isActive).length;
    
    // const term = stripAccents(q).toLowerCase();
    // const filteredTeams = teams.filter(t => (statusFilter === "all" || (statusFilter === "active") === t.is_active) && (!term || stripAccents(`${t.name} ${t.code} ${leaderOf(t.id) ?? ""}`).toLowerCase().includes(term)));
    // const teamPages = Math.max(1, Math.ceil(filteredTeams.length / teamPageSize));
    // const safeTeamPage = Math.min(teamPage, teamPages);
    // const pagedTeams = filteredTeams.slice((safeTeamPage - 1) * teamPageSize, safeTeamPage * teamPageSize);
    
    const mTerm = stripAccents(mq).toLowerCase();
    const rows = (team ? teamMembers(team.id) : []).flatMap(m => { const u = userById(m.userId); return u ? [{ m, u }] : []; })
        .filter(({ m, u }) => (mStatus === "all" || (mStatus === "active" && m.isActive) || (mStatus === "inactive" && !m.isActive) || (mStatus === "leader" && m.isLeader)) && (!mTerm || stripAccents(`${u.name} ${u.email} ${u.role} ${u.shift}`).toLowerCase().includes(mTerm)))
        .sort((a, b) => Number(b.m.isLeader) - Number(a.m.isLeader) || a.u.name.localeCompare(b.u.name));
    const mPages = Math.max(1, Math.ceil(rows.length / mSize));
    const safeMPage = Math.min(mPage, mPages);
    const pagedRows = rows.slice((safeMPage - 1) * mSize, safeMPage * mSize);
    
    const activeTeams = teams.filter(t => t.is_active).length;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key !== "Escape") return; if (confirm) setConfirm(null); else if (menu) setMenu(null); else if (drawer) setDrawer(null); };
        const closeMenu = () => setMenu(null);
        window.addEventListener("keydown", onKey);
        window.addEventListener("scroll", closeMenu, true);
        window.addEventListener("resize", closeMenu);
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", closeMenu, true); window.removeEventListener("resize", closeMenu); };
    }, [confirm, menu, drawer]);
     
    const pickTeam = (id: number) => {
        setSelectedId(id); setMq(""); setMStatus("all"); setMPage(1); setMenu(null);
        if (typeof window !== "undefined" && window.innerWidth < 1000) {
			window.setTimeout(() => {
				detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 
				60
			});
		}
    };
     
    // const saveTeam = (data: TeamForm) => {
    //     if (drawer?.kind === "team" && drawer.editing && team) {
    //       	// setTeams(c => c.map(t => t.id === team.id ? { ...t, ...data, updated_at: now } : t));
    //     	//   notify(`Equipo ${data.name} actualizado`, "success");
	// 		console.log("Equipo ${data.name} actualizado")
    //     } else {
    //       	const id = nextId.current++;
    //       	// setTeams(c => [...c, { id, ...data, created_at: now, updated_at: now }]);
	// 		setQ(""); 
	// 		setStatusFilter("all"); 
	// 		setTeamPage(Math.ceil((teams.length + 1) / teamPageSize));
	// 		pickTeam(id);
	// 		console.log(`Interventor ${data.name} creado`, "success");
    //     }
    //     setDrawer(null);
    // };
    
    const deleteTeam = (id: number) => {
        const remaining = teams.filter(t => t.id !== id);
        // setTeams(remaining); 
		setMemberships(c => c.filter(m => m.intervenorId !== id));
        setSelectedId(remaining[0]?.id ?? null); 
		setConfirm(null); 
		setDrawer(null);
        // notify("Interventor y sus asociaciones eliminados", "success");
    };

	const changeStatus = useChangeIntervenorStatus();

	const handleChangeStatus = async () => {
		if (!team) return;

		const response = await changeStatus.mutateAsync({
			id: team.id,
			isActive: !team.is_active,
		});

		if (!response?.success) {
			throw new Error(response?.message);
		}

		setDrawer(null);
	};
    
    const addMember = (userId: number, isLeader: boolean, isActive: boolean) => {
        if (!team) return;
        if (memberships.some(m => m.userId === userId && m.intervenorId === team.id)) { 
			console.log("El usuario ya pertenece a este equipo", "warning"); 
			return; 
		}
        const id = nextId.current++;
		setMemberships(c => [
			...c.map(m =>
				isLeader && m.intervenorId === team.id
				? { ...m, isLeader: false }
				: m
			), {
				id,
				userId,
				intervenorId: team.id,
				isActive,
				isLeader,
				createdAt: new Date().toISOString()
			}
		]);
        setMq(""); 
		setMStatus("all"); 
		setMPage(1); 
		setDrawer(null);
        // notify(`${userById(userId)?.name ?? "Usuario"} asociado a ${team.name}`, "success");
    };
    
    const toggleActive = (id: number) => {
        const m = memberships.find(x => x.id === id); if (!m) return;
        setMemberships(c => c.map(x => x.id === id ? { ...x, isActive: !x.isActive, isLeader: x.isActive ? false : x.isLeader } : x));
        // notify(m.isActive ? "Usuario marcado como no disponible" : "Usuario marcado como disponible", m.isActive ? "warning" : "success");
    };
    
    const toggleLeader = (id: number) => {
        const m = memberships.find(x => x.id === id); if (!m) return;
        if (!m.isLeader && !m.isActive) { 
			console.log("Activa la asociación antes de nombrar líder", "warning"); 
			return; 
		}
        setMemberships(c => c.map(x => x.intervenorId !== m.intervenorId ? x : x.id === id ? { ...x, isLeader: !m.isLeader } : m.isLeader ? x : { ...x, isLeader: false }));
        // notify(m.isLeader ? "Liderazgo retirado" : `${userById(m.userId)?.name} es ahora líder del equipo`, "success");
    };

    const removeMember = (id: number) => {
        const m = memberships.find(x => x.id === id);
        setMemberships(c => c.filter(x => x.id !== id)); 
		setConfirm(null);
        console.log(`${m ? userById(m.userId)?.name : "Usuario"} fue retirado del equipo`, "success");
    };

    const openMenu = (e: MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        if (menu?.id === id) { 
			setMenu(null); 
			return; 
		}
        const r = e.currentTarget.getBoundingClientRect();
        setMenu({ 
			id, 
			right: Math.max(8, window.innerWidth - r.right), 
			top: r.bottom + 6 + 150 > window.innerHeight ? Math.max(8, r.top - 6 - 150) : r.bottom + 6 
		});
    };
     
    const menuRow = menu ? memberships.find(m => m.id === menu.id) : undefined;
    const confirmMember = confirm?.kind === "remove" ? memberships.find(m => m.id === confirm.id) : undefined;
    const clearTeamFilters = () => { 
		setQ(""); 
		setStatusFilter("all"); 
		setTeamPage(1); 
	};

    const candidates = team ? DIRECTORY.filter(u => !memberships.some(m => m.intervenorId === team.id && m.userId === u.id)) : [];
    const counts = { all: teams.length, active: activeTeams, inactive: teams.length - activeTeams };
     
    return (
        <>
            <PageHeader 
                title="Interventores" 
                subtitle="Gestiona equipos, usuarios, disponibilidad y desempeño operativo." 
                actions={<>
                    <Button 
                        variant="primary" 
                        icon="plus"
                        onClick={() => setDrawer({ kind: "team", editing: false })}
                    >
                        Nuevo interventor
                    </Button>
                </>}
            />

            {/* KPIS */}
            <IntervenorKPIs />

            {/* FILTROS */}
            <div className="ivr-toolbar">
                <div className="search small-search ivr-search">
                    <Icon name="search" size={16}/>
                    <input 
						placeholder="Buscar equipo, código o líder..." 
						value={q} 
						onChange={e => { 
							setQ(e.target.value); 
							setTeamPage(1); 
						}}/>
                </div>
                <div className="ivr-seg" role="tablist" aria-label="Estado">
                    {([["all","Todos"],["active","Activos"],["inactive","Inactivos"]] as const).map(([k, l]) => 
                        <button 
                            type="button" 
                            role="tab" 
                            aria-selected={statusFilter === k} 
                            key={k} 
                            className={statusFilter === k ? "active" : ""} 
                            onClick={() => { setStatusFilter(k); setTeamPage(1); }}
                        >
                            {l}<b>{counts[k]}</b>
                        </button>
                    )}
                </div>
                <div className="ivr-view" aria-label="Vista">
                    <button 
                        type="button" 
                        className={view === "cards" ? "active" : ""} 
                        onClick={() => { setView("cards"); setTeamPage(1); }} 
                        title="Vista de tarjetas" 
                        aria-label="Vista de tarjetas"
                    >
                        <Icon name="grid" size={16} />
                        <span>Tarjetas</span>
                    </button>
                    
                    <button 
                        type="button" 
                        className={view === "list" ? "active" : ""} 
                        onClick={() => { setView("list"); setTeamPage(1); }} 
                        title="Vista compacta" 
                        aria-label="Vista compacta"
                    >
                        <Icon name="menu" size={16}/>
                        <span>Lista</span>
                    </button>
                </div>
            </div>

            {/* INTERVENTORES */}
            {teams.length === 0 ? (
				<EmptyState 
					onAction={clearTeamFilters}
				/>
			) : view === "cards" ? (
				<TeamCards
					teams={teams}
					selectedId={selectedId}
					pickTeam={pickTeam}
					metricsFor={metricsFor}
					leaderOf={leaderOf}
					activeCount={activeCount}
				/>
			) : (
				<TeamList 
					teams={teams}
					selectedId={selectedId}
					pickTeam={pickTeam}
					metricsFor={metricsFor}
					leaderOf={leaderOf}
					activeCount={activeCount}
				/>
			)}

			<Pagination 
				total={totalTeams} 
				page={teamPage} 
				pageSize={teamPageSize}
				next={next}
				previous={previous} 
				onPage={setTeamPage}
				onSize={size => {
					setTeamPageSize(size)
					setTeamPage(1)
				}} 
				sizes={[8, 10, 20]}
				label="interventores"
			/>


            {team ? (
				<TeamDetail
					team={team}
					detailRef={detailRef}
					metricsFor={metricsFor}
					leaderOf={leaderOf}
					activeCount={activeCount}
					teamMembers={teamMembers}
					mq={mq}
					setMq={setMq}
					mStatus={mStatus}
					setMStatus={setMStatus}
					setMPage={setMPage}
					setDrawer={setDrawer}
					rows={rows}
					pagedRows={pagedRows}
					safeMPage={safeMPage}
					mSize={mSize}
					setMSize={setMSize}
					toggleActive={toggleActive}
					openMenu={openMenu}
				/>
			) : (
				<EmptyMemberships  
					onAction={() => setDrawer({ kind: "team", editing: false })} 
				/>
			)}
		
			{menu && menuRow && team && <>
				<div className="ivr-menu-back" onClick={() => setMenu(null)} />
				<div className="ivr-menu" role="menu" style={{ top: menu.top, right: menu.right }} >
					<button 
						type="button" 
						role="menuitem" 
						onClick={() => { setMenu(null); toggleLeader(menuRow.id); }}
					>
						<Icon name="spark" size={15}/>
						{menuRow.isLeader ? "Quitar liderazgo" : "Nombrar líder"}
					</button>

					<button type="button" role="menuitem" onClick={() => { setMenu(null); toggleActive(menuRow.id); }}>
						<Icon name={menuRow.isActive ? "pause" : "play"} size={15}/>
						{menuRow.isActive ? "Marcar no disponible" : "Marcar disponible"}
					</button>

					<button type="button" role="menuitem" onClick={() => { setMenu(null); console.log(`${userById(menuRow.userId)?.name} · ${userById(menuRow.userId)?.email}`); }}>
						<Icon name="eye" size={15}/>
						Ver contacto
					</button>
					<div className="ivr-menu-sep" />
					<button type="button" role="menuitem" className="danger" onClick={() => { setMenu(null); setConfirm({ kind: "remove", id: menuRow.id }); }}>
						<Icon name="logout" size={15}/>
						Quitar del equipo
					</button>
				</div>
			</>}
		
			{drawer?.kind === "team" && (
				<TeamDrawer 
					key={drawer.editing ? `edit-${team?.id}` : "new"} 
					team={drawer.editing ? team : null} 
					teams={teams} 
					onClose={() => setDrawer(null)} 
					onSave={handleSaveIntervenor} 
					onChangeStatus={drawer.editing && team ? handleChangeStatus : undefined}
    				statusLoading={changeStatus.isPending}
				/>
			)}

			{drawer?.kind === "member" && team && (
				<MemberDrawer 
					team={team} 
					candidates={candidates} 
					currentLeader={leaderOf(team.id)} 
					onClose={() => setDrawer(null)} 
					onAdd={addMember}
				/>
			)}

			{confirm?.kind === "remove" && (
				<ConfirmDialog 
					title="¿Quitar usuario del equipo?" 
					text={`${confirmMember ? userById(confirmMember.userId)?.name : "El usuario"} dejará de pertenecer a ${team?.name ?? "este equipo"} y no recibirá sus tareas.`} 
					confirmLabel="Quitar del equipo" 
					onCancel={() => setConfirm(null)} 
					onConfirm={() => removeMember(confirm.id)}
				/>
			)}

			{confirm?.kind === "delete" && (
				<ConfirmDialog 
					title="¿Eliminar este interventor?" 
					text={`Se eliminará ${teams.find(t => t.id === confirm.id)?.name ?? "el equipo"} y sus ${teamMembers(confirm.id).length} asociaciones de usuarios. Esta acción no se puede deshacer.`} 
					confirmLabel="Eliminar interventor" 
					onCancel={() => setConfirm(null)} 
					onConfirm={() => deleteTeam(confirm.id)}
				/>
			)}
        </>
    )
}

export default IntervenorsPage