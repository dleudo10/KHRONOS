import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import type { Issue } from "../../types/workflow.types";

type PanelValidationProps = {
    setValidationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    validation: {
        errors: Issue[];
        warnings: Issue[];
    };
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    readOnly: boolean;
    setPublishConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PanelValidation = ( {setValidationOpen, validation, setSelectedId, readOnly, setPublishConfirm} : PanelValidationProps) => {
    return ( 
        <>
            <div className="builder-overlay" onClick={() => setValidationOpen(false)} />
            <aside className="validation-panel">
                <div className="drawer-head">
                    <div>
                        <span>VALIDACIÓN DE LA DEFINICIÓN</span>
                        <h2>{validation.errors.length ? "Errores por resolver" : "Lista para publicar"}</h2>
                    </div>
                    <button className="icon-button" onClick={() => setValidationOpen(false)}>
                        <Icon name="close" />
                    </button>
                </div>
                <div className="validation-summary">
                    <div><strong>{validation.errors.length}</strong><span>Errores bloqueantes</span></div>
                    <div><strong>{validation.warnings.length}</strong><span>Advertencias</span></div>
                </div>
                <div className="validation-body">
                    {validation.errors.length === 0 && (
                        <div className="validation-success">
                            <Icon name="check" />
                            <div>
                                <strong>La estructura del grafo es válida</strong>
                                <span>Existe un inicio, un final alcanzable y todas las tareas tienen interventor y SLA válidos.</span>
                            </div>
                        </div>
                    )}
                    {validation.errors.length > 0 && <h3>Errores</h3>}
                    {validation.errors.map((item, i) => (
                        <button
                            key={`e${i}`}
                            onClick={() => {
                                if (item.nodeId !== undefined) setSelectedId(item.nodeId);
                                setValidationOpen(false);
                            }}
                        >
                            <Icon name="alert" />
                            <div><strong>{item.title}</strong><span>{item.message}</span></div>
                            <Icon name="arrow" size={14} />
                        </button>
                    ))}
                    {validation?.warnings.length > 0 && <h3>Advertencias</h3>}
                    {validation?.warnings.map((item, i) => (
                        <button
                            key={`w${i}`}
                            onClick={() => {
                                if (item.nodeId !== undefined) setSelectedId(item.nodeId);
                                setValidationOpen(false);
                            }}
                        >
                            <Icon name="alert" />
                            <div><strong>{item.title}</strong><span>{item.message}</span></div>
                            <Icon name="arrow" size={14} />
                        </button>
                    ))}
                    <div className="dependency-note">
                        <Icon name="flow" />
                        <span>Las uniones con múltiples entradas esperan todas las tareas predecesoras cuando la política es “Todas”.</span>
                    </div>
                </div>
                <div className="drawer-actions">
                    <Button onClick={() => setValidationOpen(false)}>Cerrar</Button>
                    {!readOnly && validation.errors.length === 0 && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                setValidationOpen(false);
                                setPublishConfirm(true);
                            }}
                        >
                            Continuar a publicación
                        </Button>
                    )}
                </div>
            </aside>
        </>
    )
}

export default PanelValidation