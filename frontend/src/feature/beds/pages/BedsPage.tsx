import BedCard, { beds } from "../../../components/common/BedCard"
import PageHeader from "../../../components/common/PageHeader"
import Button from "../../../components/ui/Button"
import SelectPill from "../../../components/ui/SelectPill"

const BedsPage = () => {
    return (
        <>
            <PageHeader 
                title="Giro de camas" 
                subtitle="Monitorea el estado de las camas y procesos de alta en tiempo real." 
                actions={
                    <>
                        <Button icon="history">Actualizar</Button>
                        <Button variant="primary" icon="grid">Vista tarjetas</Button>
                    </>
                }
            />

            <div className="filters">
                {["Servicio","Piso","Estado","Interventor","Tipo de alta","Fecha"].map( x => (
                    <SelectPill key={x}>{x}</SelectPill>
                ))}
                
                <button className="clear-filter">
                    Limpiar filtros
                </button>
            </div>

            <div className="summary-strip">
                {[["48","Camas totales","neutral"],["8","Disponibles","success"],["14","En giro","info"],["4","Vencidas","danger"],["22","Ocupadas","neutral"]].map( x => 
                    <div key={x[1]}>
                        <i className={`summary-${x[2]}`}/>
                        <strong>{x[0]}</strong>
                        <span>{x[1]}</span>
                    </div>
                )}
            </div>

            <div className="result-head">
                <span>Mostrando <strong>14 camas en giro</strong></span>
                <span>Actualizado hace 30 segundos</span>
            </div>

            <div className="bed-grid full">
                {beds.map(b => 
                    <BedCard 
                        key={b.bed} 
                        bed={b} 
                        detailed 
                        // onClick={()=>openBed(b)}
                    />
                )}
            </div>
        </>
    )
}

export default BedsPage