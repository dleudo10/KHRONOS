import type { Tone } from "../../../components/ui/Badge";
import Badge from "../../../components/ui/Badge";
import Icon from "../../../components/ui/Icon";
import type { TeamCardsProps } from "../intervenors.types";
import { slaTone } from "../utils/slaTone";

export function TeamCards({
    teams,
    selectedId,
    pickTeam,
}: TeamCardsProps) {
    return (
        <div className="intervener-grid">
            {teams.map(t => {
                const tone: Tone = t.is_active ? slaTone(t.sla) : "neutral";

                return (
                    <button
                        type="button"
                        key={t.id}
                        className={`${selectedId === t.id ? "selected" : ""} ${ t.is_active ? "" : "is-off" }`}
                        onClick={() => pickTeam(t.id)}
                    >
                        <div className={`team-icon ta-${tone}`}>
                            <Icon name="users" />
                        </div>

                        <div className="team-head">
                            <h3>{t.name}</h3>

                            {t.is_active ? (
                                <Badge tone={tone}>
                                    {t.sla === null ? "Sin datos" : `${t.sla}% SLA`}
                                </Badge>
                            ) : (
                                <Badge tone="neutral">Inactivo</Badge>
                            )}
                        </div>

                        <span>
                            <code className="ivr-code">{t.code}</code>
                            {" "}
                            {t.total_users} usuarios · Líder: {t.leader ?? "Sin asignar"}
                        </span>

                        <div className="team-stats">
                            <div>
                                <strong>{t.pending}</strong>
                                <span>Pendientes</span>
                            </div>

                            <div>
                                <strong>{t.average}</strong>
                                <span>Promedio</span>
                            </div>

                            <div>
                                <strong> {t.sla === null ? "—" : `${t.sla}%`} </strong>
                                <span>Cumplimiento</span>
                            </div>
                        </div>

                        <div className="progress">
                            <i
                                className={`fill-${tone}`}
                                style={{ width: `${t.sla ?? 0}%` }}
                            />
                        </div>

                        <small>
                            {selectedId === t.id ? "Equipo seleccionado" : "Seleccionar equipo"}
                        </small>
                    </button>
                );
            })}
        </div>
    )
}