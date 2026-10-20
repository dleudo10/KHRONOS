import Badge, { type Tone } from "../../../../components/ui/Badge";
import Icon from "../../../../components/ui/Icon";
import { slaTone } from "../../utils/slaTone";
import type { IntervenorCollectionProps } from "./IntervenorCards";

export function IntervenorList({ intervenors, selectedId, onSelect }: IntervenorCollectionProps) {
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

                {intervenors.map(item => {
                    const tone: Tone = item.is_active ? slaTone(item.sla) : "neutral";

                    return (
                        <button
                            type="button"
                            role="listitem"
                            key={item.id}
                            className={`ivr-row ${selectedId === item.id ? "selected" : ""} ${item.is_active ? "" : "is-off"}`}
                            onClick={() => onSelect(item.id)}
                        >
                            <div className={`team-icon ta-${tone}`}>
                                <Icon name="users" size={16} />
                            </div>

                            <div className="ivr-row-name">
                                <strong>{item.name}</strong>
                                <small><code className="ivr-code">{item.code}</code></small>
                                <span className="ivr-row-sub">
                                    {item.total_users} usuarios · {item.leader ?? "Sin líder"}
                                    {item.sla !== null ? ` · ${item.sla}% SLA` : ""}
                                </span>
                            </div>

                            <span className="ivr-hide-sm ivr-cell">{item.leader ?? <em>Sin asignar</em>}</span>
                            <span className="ivr-hide-sm ivr-cell">{item.total_users}</span>
                            <span className="ivr-hide-sm ivr-cell">{item.pending}</span>
                            <span className="ivr-hide-sm ivr-cell">{item.average}</span>

                            <span className="ivr-hide-sm ivr-cell ivr-sla">
                                <b>{item.sla === null ? "—" : `${item.sla}%`}</b>
                                <div className="progress">
                                    <i className={`fill-${tone}`} style={{ width: `${item.sla ?? 0}%` }} />
                                </div>
                            </span>

                            <span className="ivr-cell">
                                <Badge tone={item.is_active ? "success" : "neutral"}>
                                    {item.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
