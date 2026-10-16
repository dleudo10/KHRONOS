import { LineChart } from "lucide-react"
import KpiCards from "../components/chart/KpiCards"
import BedCard, { beds } from "../components/common/BedCard"
import PageHeader from "../components/common/PageHeader"
import PanelTitle from "../components/common/PanelTitle"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import SelectPill from "../components/ui/SelectPill"
import Bottlenecks from "../components/chart/Bottlenecks"



const DashboardPage = () => {
	return (
		<>
			<PageHeader 
				title="Buenos días, David" 
				subtitle="Resumen operativo del giro de camas" 
				actions={
					<>
						<SelectPill>Hoy</SelectPill>
						<Button icon="chart">Ver reporte</Button>
					</>
				}
			/>

			<KpiCards />

			<section className="panel">
				<PanelTitle
					title="Giro de camas en tiempo real" 
					action={
						<button className="text-button">
							Ver todas las camas 
							<Icon name="arrow" size={15}/>
						</button>
					}
				/>

				<div className="bed-grid dashboard-beds">
					{beds.slice(0,4).map(b => (
						<BedCard 
							key={b.bed} 
							bed={b} 
							// onClick={() => openBed(b)} 
						/>
					))}
				</div>
			</section>

			<div className="dashboard-columns">
				<section className="panel chart-panel">
					<PanelTitle 
						title="Tiempo promedio de giro" 
						action={
							<SelectPill>Últimos 30 días</SelectPill>
						}
					/>

					<div className="chart-stat">
						<strong>74 min</strong>
						<span>↘ 8.5%</span>
						<small>Promedio total</small>
					</div>
					
					<LineChart/>
				</section>

				<section className="panel bottleneck">
					<PanelTitle 
						title="Principales cuellos de botella" 
						action={
							<button className="icon-button">
								<Icon name="more"/>
							</button>
						}
					/>
					
					<Bottlenecks/>
				</section>
			</div>

			<div className="metrics-row">
				<section className="panel donut-panel">
					<PanelTitle 
						title="Espera vs ejecución"
					/>
					
					<div className="donut-content">
						<div className="donut">
							<div>
								<strong>74m</strong>
								<span>Total</span>
							</div>
						</div>
						
						<div className="legend">
							<div>
								<i className="wait"/>
								<span>Tiempo esperando</span>
								<strong>35%</strong>
							</div>

							<div>
								<i className="execute"/>
								<span>Tiempo ejecutando</span>
								<strong>65%</strong>
							</div>
					
						</div>
					</div>
				</section>

				<section className="panel bars-panel">
					<PanelTitle 
						title="Camas liberadas por día" 
						action={
							<span className="panel-note">Esta semana</span>
						}
					/>
					
					<div className="bars">
						{[55,72,48,82,66,91,76].map((v,i) => (
							<div key={i}>
								<span>{12+i}</span>
								<i style={{height:`${v}%`}}/>
								<small>{["L","M","M","J","V","S","D"][i]}</small>
							</div>
						))}
					</div>
				</section>
			</div>
		</>
	)
}

export default DashboardPage