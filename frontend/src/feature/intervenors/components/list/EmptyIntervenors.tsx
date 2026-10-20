import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";

type EmptyIntervenorsProps = {
    /** true = hay filtros activos y ninguno coincide; false = no existe ningún interventor. */
    hasFilters: boolean;
    onClearFilters: () => void;
    onCreate: () => void;
};

const EmptyIntervenors = ({ hasFilters, onClearFilters, onCreate }: EmptyIntervenorsProps) => (
    <div className="ivr-empty panel">
        <span><Icon name={hasFilters ? "search" : "users"} size={22} /></span>

        <h3>{hasFilters ? "No hay interventores que coincidan" : "No hay interventores"}</h3>

        <p>
            {hasFilters
                ? "Prueba con otro término o limpia los filtros aplicados."
                : "Crea el primero para empezar a asociar usuarios."}
        </p>

        {hasFilters ? (
            <Button onClick={onClearFilters}>Limpiar filtros</Button>
        ) : (
            <Button variant="primary" icon="plus" onClick={onCreate}>Nuevo interventor</Button>
        )}
    </div>
);

export default EmptyIntervenors;
