import type { MouseEvent } from "react";
import Badge from "../../../../components/ui/Badge";
import Icon from "../../../../components/ui/Icon";
import { initials } from "../../../../utils/initials";
import type { IntervenorMember } from "../../types/member.types";
import { fmtDate } from "../../utils/fmtDate";

type MembersTableProps = {
    members: IntervenorMember[];
    onOpenMenu: (e: MouseEvent<HTMLButtonElement>, memberId: number) => void;
};

const MembersTable = ({ members, onOpenMenu }: MembersTableProps) => (
    <div className="table-wrap">
        <table className="member-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Documento/Usuario</th>
                    <th>Líder</th>
                    <th>Asociado desde</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {members.map(member => {
                    return (
                        <tr key={member.id}>
                            <td data-label="Nombre">
                                <span className="table-avatar">{initials(member.user.full_name || '—')}</span>
                                <div className="ivr-user">
                                    <strong>{member.user.full_name}</strong>
                                    <small>{member.user.email}</small>
                                </div>
                            </td>
                            <td data-label="Documento/Usuario">{member.user.external_id}</td>
                            <td data-label="Líder">
                                {member.is_leader ? <Badge tone="info">Líder</Badge> : <span className="ivr-dash">—</span>}
                            </td>
                            <td data-label="Asociado desde">{fmtDate(member.created_at)}</td>
                            <td data-label="Disponibilidad">
                                <span className={`availability ${member.membership_active ? "online" : "offline"}`}>
                                    <i />{member.membership_active ? "Disponible" : "No disponible"}
                                </span>
                            </td>
                            <td data-label="Acciones" className="cell-actions">
                                <button
                                    type="button"
                                    className="icon-button"
                                    aria-label={`Opciones de ${member.user.full_name}`}
                                    aria-haspopup="menu"
                                    onClick={e => onOpenMenu(e, member.id)}
                                >
                                    <Icon name="more" />
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
);

export default MembersTable;
