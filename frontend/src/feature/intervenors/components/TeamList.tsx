import Badge, { type Tone } from "../../../components/ui/Badge";
import Icon from "../../../components/ui/Icon";
import type { TeamCardsProps } from "../intervenors.types";
import { slaTone } from "../utils/slaTone";


export function TeamList({
    teams,
    selectedId,
    pickTeam,
}: TeamCardsProps) {
    return (
        <div className="panel ivr-list-panel">
			<div className="ivr-list" role="list">
				<div className="ivr-row ivr-row-head">
					<span />
					<span>EQUIPO</span>
					<span className="ivr-hide-sm">LÍDER</span>
					<span className="ivr-hide-sm">USUARIOS</span>
					<span className="ivr-hide-sm">PENDIENTES</span>
					<span className="ivr-hide-sm">PROMEDIO</span>
					<span className="ivr-hide-sm">CUMPLIMIENTO</span>
					<span>ESTADO</span>
				</div>

				{teams.map(t => { 
					const tone: Tone = t.is_active ? slaTone(t.sla) : "neutral"; 

					return (
						<button 
							type="button" 
							role="listitem" 
							key={t.id} 
							className={`ivr-row ${selectedId === t.id ? "selected" : ""} ${t.is_active ? "" : "is-off"}`} 
							onClick={() => pickTeam(t.id)}
						>
							<div className={`team-icon ta-${tone}`}>
								<Icon name="users" size={16}/>
							</div>

							<div className="ivr-row-name">
								<strong>{t.name}</strong>
								<small>
									<code className="ivr-code">{t.code}</code>
								</small>
								<span className="ivr-row-sub">
									{t.total_users} usuarios · {t.leader ?? "Sin líder"}{t.sla !== null ? ` · ${t.sla}% SLA` : ""}
								</span>
							</div>

							<span className="ivr-hide-sm ivr-cell">
								{t.leader ?? <em>Sin asignar</em>}
							</span>

							<span className="ivr-hide-sm ivr-cell">
								{t.total_users}
							</span>

							<span className="ivr-hide-sm ivr-cell">
								{t.pending}
							</span>

							<span className="ivr-hide-sm ivr-cell">
								{t.average}
							</span>

							<span className="ivr-hide-sm ivr-cell ivr-sla">
								<b>{t.sla === null ? "—" : `${t.sla}%`}</b>
								<div className="progress">
									<i className={`fill-${tone}`} style={{ width: `${t.sla ?? 0}%` }}/>
								</div>
							</span>

							<span className="ivr-cell">
								{t.is_active ? <Badge tone="success">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}
							</span>
						</button>
					)
				})}
			</div>
		</div>
    )
}