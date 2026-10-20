import Badge, { type Tone } from "../../../../components/ui/Badge";
import Icon from "../../../../components/ui/Icon";
import type { Intervenor } from "../../types/intervenor.types";
import { slaTone } from "../../utils/slaTone";

export type IntervenorCollectionProps = {
    intervenors: Intervenor[];
    selectedId: number | null;
    onSelect: (id: number) => void;
};

export function IntervenorCards({ intervenors, selectedId, onSelect }: IntervenorCollectionProps) {
    return (
        <div className="intervener-grid">
            {intervenors.map(item => {
                const tone: Tone = item.is_active ? slaTone(item.sla) : "neutral";
                const selected = selectedId === item.id;

                return (
                    <button
                        type="button"
                        key={item.id}
                        className={`${selected ? "selected" : ""} ${item.is_active ? "" : "is-off"}`}
                        onClick={() => onSelect(item.id)}
                    >
                        <div className={`team-icon ta-${tone}`}>
                            <Icon name="users" />
                        </div>

                        <div className="team-head">
                            <h3>{item.name}</h3>

                            {item.is_active ? (
                                <Badge tone={tone}>
                                    {item.sla === null ? "Sin datos" : `${item.sla}% SLA`}
                                </Badge>
                            ) : (
                                <Badge tone="neutral">Inactivo</Badge>
                            )}
                        </div>

                        <span>
                            <code className="ivr-code">{item.code}</code>{" "}
                            {item.total_users} usuarios · Líder: {item.leader ?? "Sin asignar"}
                        </span>

                        <div className="team-stats">
                            <div>
                                <strong>{item.pending}</strong>
                                <span>Pendientes</span>
                            </div>
                            <div>
                                <strong>{item.average}</strong>
                                <span>Promedio</span>
                            </div>
                            <div>
                                <strong>{item.sla === null ? "—" : `${item.sla}%`}</strong>
                                <span>Cumplimiento</span>
                            </div>
                        </div>

                        <div className="progress">
                            <i className={`fill-${tone}`} style={{ width: `${item.sla ?? 0}%` }} />
                        </div>

                        <small>{selected ? "Equipo seleccionado" : "Seleccionar equipo"}</small>
                    </button>
                );
            })}
        </div>
    );
}
