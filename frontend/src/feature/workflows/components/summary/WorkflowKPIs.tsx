import Icon, { type IconName } from "../../../../components/ui/Icon"

const KPIs = [
    ["4","Total de workflows","flow"],
    ["3","Activos","check"],
    ["1","Inactivo","pause"],
    ["3","Borradores pendientes","layers"]
]
const WorkflowKPIs = () => {
    return (
        <div className="workflow-kpis">
            {KPIs.map( x => (
                <div key={x[1]}>
                    <span>
                        <Icon name={x[2] as IconName} />
                    </span>
                    <div>
                        <strong>{x[0]}</strong>
                        <small>{x[1]}</small>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default WorkflowKPIs