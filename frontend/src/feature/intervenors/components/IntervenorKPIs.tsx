import { useEffect } from "react";
import Icon, { type IconName } from "../../../components/ui/Icon"
import { useGetSummary } from "../hooks/useGetSumary"

const IntervenorKPIs = () => {
    const { data, isLoading, isError, error, refetch } = useGetSummary();

	useEffect(() => {
        if (error) {
            // const apiError = handleError(error)

            // const errorMessage =
            //     apiError.message ||
            //     apiError.description ||
            //     "Ha ocurrido un error desconocido.";

            // alert.error(apiError.title, errorMessage)
			console.log(error)
        }
    }, [error]);  
	const summary = data?.success ? data.data : null;

	const kpis: [string, number, IconName][] = [
		["Equipos", summary?.total_intervenors ?? 0, "users"],
		["Equipos activos", summary?.active_intervenors ?? 0, "check"],
		["Usuarios activos", summary?.total_users ?? 0, "bed"],
		["Sin líder", summary?.intervenors_without_leader ?? 0, "alert"],
	];

	if (isLoading) {
		return (
			<div className="service-summary ivr-kpis" aria-busy="true">
				{kpis.map(([label, , icon]) => (
					<div key={label}>
						<span><Icon name={icon} /></span>
						<div>
							<strong>—</strong>
							<small>{label}</small>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (isError || data?.success === false) {
		return (
		<div className="panel" role="alert">
			<p>No se pudieron cargar los indicadores.</p>
			<button type="button" onClick={() => refetch()}>
				Reintentar
			</button>
		</div>
		);
  	}

    return (
        <div className="service-summary ivr-kpis">
			{kpis.map(([label, value, icon]) => (
				<div key={label}>
					<span><Icon name={icon} /></span>
					<div>
						<strong>{value}</strong>
						<small>{label}</small>
					</div>
				</div>
			))}
		</div>
    )
}

export default IntervenorKPIs