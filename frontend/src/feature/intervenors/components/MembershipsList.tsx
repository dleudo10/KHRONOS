import type { MouseEvent } from "react";
import type { MembershipRow } from '../intervenors.types'
import Icon from '../../../components/ui/Icon'
import Badge from '../../../components/ui/Badge'
import { initials } from '../../../utils/initials'
import { fmtDate } from '../utils/fmtDate'

export type MembershipsListProps = {
	pagedRows: MembershipRow[];
	toggleActive: (id: number) => void;
	openMenu: (
		e: MouseEvent<HTMLButtonElement>,
		id: number
	) => void;
};

const MembershipsList = ({
	pagedRows,
	toggleActive,
	openMenu,
}: MembershipsListProps) => {

	return (
		<div className="table-wrap">
			<table className="member-table">
				<thead>
					<tr>
						<th>Usuario</th>
						<th>Rol</th>
						<th>Turno</th>
						<th>Líder</th>
						<th>Asociado desde</th>
						<th>Disponibilidad</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{pagedRows.map(({ m, u }) => 
						<tr key={m.id}>
							<td data-label="Usuario">
								<span className="table-avatar">{initials(u.name)}</span>
								<div className="ivr-user">
									<strong>{u.name}</strong>
									<small>{u.email}</small>
								</div>
							</td>
							<td data-label="Rol">{u.role}</td>
							<td data-label="Turno">{u.shift}</td>
							<td data-label="Líder">{m.isLeader ? <Badge tone="info">Líder</Badge> : <span className="ivr-dash">—</span>}</td>
							<td data-label="Asociado desde">{fmtDate(m.createdAt)}</td>
							<td data-label="Disponibilidad">
								<button 
									type="button" 
									className={`availability ${m.isActive ? "online" : "offline"}`} 
									onClick={() => toggleActive(m.id)} title="Cambiar disponibilidad"
								> <i/>{m.isActive ? "Disponible" : "No disponible"}
								</button>
							</td>
							<td 
								data-label="Acciones" 
								className="cell-actions"
							>
								<button 
									type="button" 
									className="icon-button" 
									aria-label={`Opciones de ${u.name}`} 
									aria-haspopup="menu" 
									onClick={e => openMenu(e, m.id)}
								>
									<Icon name="more"/>
								</button>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default MembershipsList