import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";

type EmptyWorkflowProps = {
    hasFilters: boolean;
    onClearFilters: () => void;
    onCreate: () => void;
};

const EmptyWorkflows = ({ hasFilters, onClearFilters, onCreate }: EmptyWorkflowProps) => (
    <div className="ivr-empty panel mt-4">
        <span><Icon name={hasFilters ? "search" : "users"} size={22} /></span>

        <h3>{hasFilters ? "No hay workflows que coincidan" : "No hay workflows"}</h3>

        <p>
            {hasFilters
                ? "Prueba con otro término o limpia los filtros aplicados."
                : "Crea el primero para empezar a asociar workflows."}
        </p>

        {hasFilters ? (
            <Button onClick={onClearFilters}>Limpiar filtros</Button>
        ) : (
            <Button variant="primary" icon="plus" onClick={onCreate}>Nuevo workflow</Button>
        )}
    </div>
);

export default EmptyWorkflows;
