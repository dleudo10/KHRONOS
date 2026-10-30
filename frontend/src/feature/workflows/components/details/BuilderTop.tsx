import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button"
import type { Status } from "../../types/workflow.types";

type BuilderTopProps = {
    title: string;
    version: number;
    status: Status;
    dirty: boolean;
    saving: boolean;
    simulationLabel: string;
    onUndo: () => void; 
    onRedo: () => void;
    onSimulate: () => void;
    onSave: () => void;
    onValidate: () => void;
    onPublish: () => void;
};

const statusText: Record<Status, string> = {
    draft: "Borrador editable",
    published: "Publicado · solo lectura",
    archived: "Archivado · solo lectura",
};

const BuilderTop = ({
    title,
    version,
    status,
    dirty,
    saving,
    simulationLabel,
    onUndo,
    onRedo,
    onSimulate,
    onSave,
    onValidate,
    onPublish,
}: BuilderTopProps) => {
    const navigate = useNavigate();
    const editable = status === "draft";

    return (
        <div className="builder-top">
            <div>
                <Button variant="ghost" icon="arrow" onClick={() => navigate(-1)}>
                    Volver
                </Button>
                <div>
                    <strong>{title}</strong>
                    <span>
                        v{version} — {statusText[status]}
                        {dirty ? " · cambios sin guardar" : ""} · grafo dirigido
                    </span>
                </div>
            </div>
                
            <div>
                {editable && (
                    <>
                        <Button variant="ghost" onClick={onUndo}>Deshacer</Button>
                        <Button variant="ghost" onClick={onRedo}>Rehacer</Button>
                    </>
                )}
                <Button icon="play" onClick={onSimulate}>{simulationLabel}</Button>
                {editable && (
                    <Button onClick={onSave}>
                        {saving ? "Guardando…" : "Guardar borrador"}
                    </Button>
                )}
                <Button onClick={onValidate}>Validar</Button>
                <Button variant="primary" onClick={onPublish}>
                    {editable ? "Publicar" : "Publicado"}
                </Button>
            </div>
        </div>
    )
}

export default BuilderTop