import type { Tone } from "../ui/Badge";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";

export const beds = [
	{ room:"304", bed:"304-A", patient:"Juan Pérez", task:"Retiro de dispositivos", owner:"Enfermería", time:"18 min", sla:"20 min", status:"En proceso", tone:"info" as Tone, progress:76 },
	{ room:"305", bed:"305-A", patient:"Laura Gómez", task:"Desinfección terminal", owner:"Servicios Generales", time:"42 min", sla:"30 min", status:"SLA vencido", tone:"danger" as Tone, progress:100 },
	{ room:"306", bed:"306-A", patient:"—", task:"Lista para asignación", owner:"Sin interventor", time:"12 min", sla:"—", status:"Disponible", tone:"success" as Tone, progress:100 },
	{ room:"307", bed:"307-A", patient:"Carlos Ruiz", task:"Validación de copago", owner:"Facturación", time:"26 min", sla:"30 min", status:"Próximo a vencer", tone:"warning" as Tone, progress:87 },
	{ room:"308", bed:"308-B", patient:"María Torres", task:"Traslado de paciente", owner:"Camillero", time:"8 min", sla:"10 min", status:"En proceso", tone:"info" as Tone, progress:80 },
	{ room:"402", bed:"402-A", patient:"Andrés Díaz", task:"Autorización de salida", owner:"Facturación", time:"31 min", sla:"25 min", status:"SLA vencido", tone:"danger" as Tone, progress:100 },
];

export type BedCardProps = {
    bed: typeof beds[number];
    detailed?: boolean;
    onClick?: () => void
}

const BedCard = ({ bed, detailed = false, onClick }: BedCardProps) => {
    return (
        <button className={`bed-card tone-${bed.tone}`} onClick={onClick}>
            <div className="bed-card-head">
                <div>
                    <small>HABITACIÓN {bed.room}</small>
                    <strong>{bed.bed}</strong>
                </div>
                
                <Badge tone={bed.tone}>
                    {bed.status}
                </Badge>
            </div>

            <div className="patient">
                <span>Paciente</span>
                <strong>{bed.patient}</strong>
            </div>

            <div className="bed-task">
                <div className="task-icon">
                    <Icon name={bed.tone === "success" ? "check" : "clock"} size={17}/>
                </div>
                
                <div>
                    <small>{bed.owner}</small>
                    <strong>{bed.task}</strong>
                </div>
            </div>

            <div className="sla-row">
                <span>
                    <Icon name="clock" size={14}/> 
                    {bed.time}
                </span>
                <span>SLA {bed.sla}</span>
            </div>

            <div className="progress">
                <i style={{width: `${bed.progress}%`}}/>
            </div>

            {detailed && 
                <div className="mini-flow">
                    <span className="done">Alta ✓</span><b/>
                    <span className="done">Fact. ✓</span><b/>
                    <span className="current">Enferm. ●</span><b/>
                    <span>Camillero ○</span>
                </div>
            }
        </button>
    )
}

export default BedCard