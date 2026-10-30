import Icon from "../../../../components/ui/Icon";
import type { ComponentListType, NodeType } from "../../types/workflow.types";

type ComponentsPanelProps = {
    componentList: ComponentListType[];
    addNode: (type: NodeType) => void;
}

const ComponentsPanel = ({componentList, addNode}:ComponentsPanelProps ) => {
    return (
        <aside className="components-panel">
            <h3>Nodos</h3>
            <p>Agrega unidades al grafo</p> 

            {componentList.map((item) => (
                <button key={item.type} onClick={() => addNode(item.type)}>
                    <span><Icon name={item.icon} /></span>
                    <div>
                        <strong>{item.label}</strong>
                        <small>{item.hint}</small>
                    </div>
                    <Icon name="plus" size={15} />
                </button>
            ))}

            <div className="builder-help">
                <Icon name="flow" />
                <div>
                    <strong>Dependencias reales</strong>
                    <span>Selecciona un nodo y agrega uno o varios predecesores desde el panel derecho.</span>
                </div>
            </div>

            <div className="graph-legend">
                <strong>Simulación</strong>
                <span><i className="sim-running" />Ejecutando ahora</span>
                <span><i className="sim-complete" />Completado</span>
                <span><i />Esperando dependencias</span>
            </div>
        </aside>
    )
}

export default ComponentsPanel