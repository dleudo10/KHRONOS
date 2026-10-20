import Icon from "../../../components/ui/Icon";

type TeamStatusActionProps = {
    isActive: boolean;
    loading?: boolean;
    onClick: () => void;
};

export function TeamStatusAction({ isActive, loading = false, onClick }: TeamStatusActionProps) {
    const tone = isActive ? "danger" : "success";

    return (
        <div className={`ivr-status-action is-${tone}`}>
            <div>
                <strong>
                    {isActive ? "Desactivar interventor" : "Activar interventor"}
                </strong>
                <span>
                    {isActive
                        ? "Un equipo inactivo deja de recibir tareas nuevas. Sus usuarios asociados y su historial se conservan, y podrás reactivarlo cuando quieras."
                        : "Al activarlo, el equipo volverá a recibir tareas nuevas según la disponibilidad de sus usuarios asociados."}
                </span>
            </div>

            <button
                type="button"
                className={`btn btn-secondary ivr-btn-${tone}`}
                onClick={onClick}
                disabled={loading}
            >
                <Icon name={isActive ? "pause" : "play"} size={15} />
                <span>
                    {loading
                        ? "Actualizando..."
                        : isActive
                            ? "Desactivar"
                            : "Activar"}
                </span>
            </button>
        </div>
    );
}