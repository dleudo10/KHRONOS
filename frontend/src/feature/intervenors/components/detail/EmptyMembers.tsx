import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";

type EmptyMembersProps = {
    /** true = hay filtros activos y ninguno coincide; false = el interventor no tiene miembros. */
    hasFilters: boolean;
    onAdd: () => void;
    onClearFilters: () => void;
};

const EmptyMembers = ({ hasFilters, onAdd, onClearFilters }: EmptyMembersProps) => (
    <div className="ivr-empty ivr-empty-flat">
        <span><Icon name="users" size={22} /></span>

        <h3>
            {hasFilters ? "Ningún usuario coincide con el filtro" : "Este interventor aún no tiene usuarios"}
        </h3>

        <p>
            {hasFilters
                ? "Ajusta la búsqueda o el estado seleccionado."
                : "Asocia usuarios para que puedan recibir y completar tareas de este equipo."}
        </p>

        {hasFilters ? (
            <Button onClick={onClearFilters}>Limpiar filtros</Button>
        ) : (
            <Button variant="primary" icon="plus" onClick={onAdd}>Asociar usuario</Button>
        )}
    </div>
);

export default EmptyMembers;
