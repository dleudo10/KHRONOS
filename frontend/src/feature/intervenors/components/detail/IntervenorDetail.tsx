import type { RefObject } from "react";
import Badge from "../../../../components/ui/Badge";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { TARGET_AVERAGE_MINUTES } from "../../constants";
import type { Intervenor } from "../../types/intervenor.types";
import { fmtDate } from "../../utils/fmtDate";
import { slaTone } from "../../utils/slaTone";
import { MembersPanel } from "./MembersPanel";

type IntervenorDetailProps = {
    intervenor: Intervenor;
    detailRef: RefObject<HTMLElement | null>;
    onEdit: () => void;
};

const IntervenorDetail = ({ intervenor, detailRef, onEdit }: IntervenorDetailProps) => (
    <section className="panel team-detail" ref={detailRef}>
        <div className="team-detail-head">
            <div>
                <div className={`team-icon ta-${intervenor.is_active ? slaTone(intervenor.sla) : "neutral"}`}>
                    <Icon name="users" />
                </div>

                <div>
                    <span>DETALLE DEL INTERVENTOR · {intervenor.code}</span>
                    <h2>
                        {intervenor.name}
                        <Badge tone={intervenor.is_active ? "success" : "neutral"}>
                            {intervenor.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                    </h2>
                    <p>
                        {intervenor.description || "Sin descripción."} · Líder: {intervenor.leader ?? "Sin asignar"}
                    </p>
                </div>
            </div>

            <div className="ivr-head-actions">
                <Button icon="settings" onClick={onEdit}>Editar equipo</Button>
            </div>
        </div>

        <div className="team-detail-kpis">
            <div>
                <span>Usuarios activos</span>
                <strong>{intervenor.total_users}</strong>
                <small>En este interventor</small>
            </div>

            <div>
                <span>Tareas pendientes</span>
                <strong>{intervenor.pending}</strong>
                <small>{intervenor.pending > 0 ? "Requieren atención" : "Al día"}</small>
            </div>

            <div>
                <span>Tiempo promedio</span>
                <strong>{intervenor.average}</strong>
                <small>Objetivo: {TARGET_AVERAGE_MINUTES} min</small>
            </div>

            <div>
                <span>Creado</span>
                <strong className="ivr-date">{fmtDate(intervenor.created_at)}</strong>
                <small>Actualizado {fmtDate(intervenor.updated_at)}</small>
            </div>
        </div>

        <MembersPanel intervenor={intervenor} />
    </section>
);

export default IntervenorDetail;
