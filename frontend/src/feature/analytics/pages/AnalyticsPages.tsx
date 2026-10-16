import LineChart from "../../../components/chart/LineChart"
import PageHeader from "../../../components/common/PageHeader"
import PanelTitle from "../../../components/common/PanelTitle"
import Button from "../../../components/ui/Button"
import SelectPill from "../../../components/ui/SelectPill"

const AnalyticsPages = () => {
    return (
        <>
            <PageHeader 
                title="Analytics" 
                subtitle="Analiza el comportamiento histórico del giro de camas." 
                actions={<Button icon="calendar">01 — 30 Jun 2025</Button>}
            />

            <div className="filters analytics-filters">
                {["Servicio","Piso","Interventor","Tipo de alta","Turno","Workflow"].map(x => 
                    <SelectPill key={x}>{x}</SelectPill>
                )}
                
                <Button variant="primary" icon="filter">Aplicar filtros</Button>
            </div>

            <div className="analytics-kpis">
                {[
                    ["74 min","Tiempo promedio","-8.5%"],
                    ["68 min","Mediana","-4.2%"],
                    ["126 min","P95","+2.1%"],
                    ["86.4%","Cumplimiento SLA","+5.8%"],
                    ["482","Camas liberadas","+12.3%"],
                    ["194h","Tiempo perdido","-6.7%"]
                ].map((x,i) => 
                    <div key={x[1]}>
                        <span>{x[1]}</span>
                        <strong>{x[0]}</strong>
                        <small className={i===2?"bad":""}>{x[2]} vs periodo anterior</small>
                    </div>
                )}
                
            </div>

            <div className="analytics-grid">
                <section className="panel analytics-main">
                    <PanelTitle 
                        title="Tiempo promedio de giro por día" 
                        action={<SelectPill>Promedio diario</SelectPill>}
                    />
                    
                    <LineChart />
                </section>
                
                <section className="panel donut-panel">
                    <PanelTitle title="Cumplimiento SLA"/>
                    <div className="big-donut">
                        <div>
                            <strong>86.4%</strong>
                            <span>Dentro del SLA</span>
                        </div>
                    </div>

                    <div className="sla-legend">
                        <span>
                            <i className="green"/>416 a tiempo
                        </span>
                        
                        <span>
                            <i className="red-dot"/>66 vencidas
                        </span>
                    </div>
                </section>
            </div>

            <div className="analytics-grid lower">
                <section className="panel">
                    <PanelTitle title="Tiempo por interventor"/>
                    <div className="horizontal-bars">
                        {[["Servicios Generales",34],["Enfermería",22],["Facturación",18],["Camillero",9]].map( x =>
                            <div key={x[0]}>
                                <span>{x[0]}</span>
                                <i>
                                    <b style={{width:`${Number(x[1])*2.5}%`}} />
                                </i>
                                <strong>{x[1]} min</strong>
                            </div>
                        )}
                        
                    </div>
                </section>
                
                <section className="panel">
                    <PanelTitle title="Giro por turno"/>
                    <div className="shift-cards">
                        {[["Mañana","68 min","92%"],["Tarde","76 min","84%"],["Noche","83 min","79%"]].map( x =>
                            <div key={x[0]}>
                                <span>{x[0]}</span>
                                <strong>{x[1]}</strong>
                                <small>{x[2]} SLA</small>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}

export default AnalyticsPages