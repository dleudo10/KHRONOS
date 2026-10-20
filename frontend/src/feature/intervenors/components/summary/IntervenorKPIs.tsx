import Icon, { type IconName } from "../../../../components/ui/Icon";
import { useGetIntervenorsSummary } from "../../hooks/useGetIntervenorsSummary";

const IntervenorKPIs = () => {
    const { data, isLoading, isError, refetch } = useGetIntervenorsSummary();

    if (isError || data?.success === false) {
        return (
            <div className="panel" role="alert">
                <p>No se pudieron cargar los indicadores.</p>
                <button type="button" onClick={() => refetch()}>Reintentar</button>
            </div>
        );
    }

    const summary = data?.success ? data.data : null;

    const kpis: [string, number | undefined, IconName][] = [
        ["Equipos", summary?.total_intervenors, "users"],
        ["Equipos activos", summary?.active_intervenors, "check"],
        ["Usuarios activos", summary?.total_users, "bed"],
        ["Sin líder", summary?.intervenors_without_leader, "alert"],
    ];

    return (
        <div className="service-summary ivr-kpis" aria-busy={isLoading}>
            {kpis.map(([label, value, icon]) => (
                <div key={label}>
                    <span><Icon name={icon} /></span>
                    <div>
                        <strong>{isLoading ? "—" : value ?? 0}</strong>
                        <small>{label}</small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IntervenorKPIs;
