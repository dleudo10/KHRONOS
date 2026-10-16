import PageHeader from "../../../components/common/PageHeader";
import type { Tone } from "../../../components/ui/Badge";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Icon, { type IconName } from "../../../components/ui/Icon";
import type { Task } from "../tasks.types";


const TaskPage = () => {
    const tasks: Task[] = [
        {
            bed: "304-A",
            room: "304",
            patient: "Juan Pérez",
            task: "Retiro de dispositivos",
            state: "Pendiente",
            tone: "info",
            time: "17 min",
            sla: "20 min",
        },
        {
            bed: "308-B",
            room: "308",
            patient: "María Torres",
            task: "Traslado de paciente",
            state: "En proceso",
            tone: "warning",
            time: "8 min",
            sla: "10 min",
        },
        {
            bed: "402-A",
            room: "402",
            patient: "Andrés Díaz",
            task: "Validar autorización de salida",
            state: "Vencida",
            tone: "danger",
            time: "31 min",
            sla: "25 min",
        },
    ];


    return (
        <>
            <PageHeader 
                title="Mis tareas" 
                subtitle="Gestiona las tareas asignadas a ti." 
                actions={<>
                    <Button icon="history">Actualizar</Button>
                </> }
            />

            <div className="task-kpis">
                {[["7","Pendientes","clock"],["2","En proceso","play"],["1","Vencidas","alert"],["18","Completadas hoy","check"]].map(x=>
                    <div key={x[1]}>
                        <div>
                            <Icon name={x[2] as IconName}/>
                        </div>
                        
                        <strong>{x[0]}</strong>
                        <span>{x[1]}</span>
                    </div>
                )}
            </div>

            <div className="tabs">
                {["Todas 10","Pendientes 7","En proceso 2","Vencidas 1","Completadas"].map((x,i)=>
                    <button className={i===0?"active":""} key={x}>{x}</button>
                )}
            </div>


            <div className="task-list">{tasks.map((t,i)=>{
                const status = t.state;
                const tone: Tone = status === "Completada" ? "success" : status === "Bloqueada" ? "danger" : status === "En proceso" ? "warning" : t.tone;
                return (
                    <div className={`task-card ${status === "Completada" ? "task-completed" : ""}`} key={t.bed}>
                        <div className={`task-band band-${tone}`}/>

                        <div className="task-main">
                            <div className="task-state">
                                <Badge tone={tone}>{status}</Badge>
                                <span>Asignada hace {i+2} min</span>
                            </div>
                            
                            <h3>{t.task}</h3>
                            
                            <div className="task-patient">
                                <div className="room-icon">
                                    <Icon name="bed"/>
                                </div>

                                <div>
                                    <strong>Habitación {t.room} · Cama {t.bed}</strong>
                                    <span>{t.patient}</span>
                                </div>
                            </div>
                    
                        </div>
                    
                        <div className="task-meta">
                            <div>
                                <span>WORKFLOW</span>
                                <strong>Alta Hospitalaria</strong>
                            </div>
                            
                            <div>
                                <span>TRANSCURRIDO</span>
                                <strong className={t.tone==="danger"?"red":""}>
                                    {status === "Completada" ? "Finalizada" : t.time}
                                </strong>
                            </div>
                            
                            <div>
                                <span>SLA</span>
                                <strong>{t.sla}</strong>
                            </div>
                            
                        </div>
                        
                        <div className="task-actions">
                            {status === "Pendiente" && 
                                <Button 
                                    variant="primary" 
                                    icon="play" 
                                    // onClick={()=>{updateTask(i,"En proceso");notify(`Tarea “${t.task}” iniciada`,"info")}}
                                >
                                    Iniciar tarea
                                </Button>
                            }
                            
                            {status === "En proceso" &&
                                <Button 
                                    variant="primary" 
                                    icon="check" 
                                    // onClick={()=>{updateTask(i,"Completada");notify(`Tarea completada. La siguiente etapa fue notificada.`,"success")}}
                                >
                                    Completar
                                </Button>
                            }
                                    
                            {status === "Completada" && 
                                <Button 
                                    variant="ghost" 
                                    icon="eye" 
                                    // onClick={()=>notify("Historial de tarea abierto")}
                                >
                                    Ver historial
                                </Button>
                            }
                        </div>
                    </div>
                )
            })}</div>
        </>
    )
}

export default TaskPage