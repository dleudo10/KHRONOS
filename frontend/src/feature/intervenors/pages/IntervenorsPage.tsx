import { useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/Button";
import Icon, { type IconName } from "../../../components/ui/Icon";
import Badge, { type Tone } from "../../../components/ui/Badge";
import { useGetIntervenors } from "../hooks/useGetIntervenors";

const IntervenorsPage = () => {

    const { data: teams } = useGetIntervenors();
    const activeTeams = 0;
    const totalActiveUsers = 0;
    const withoutLeader = 0;

    const kpisIntervenors = [
        ["Equipos", 0, "users"], 
        ["Equipos activos", activeTeams, "check"], 
        ["Usuarios activos", totalActiveUsers, "bed"], 
        ["Sin líder", withoutLeader, "alert"]  
    ] as [string, number, IconName][]


    return (
        <>
            <PageHeader 
                title="Interventores" 
                subtitle="Gestiona equipos, usuarios, disponibilidad y desempeño operativo." 
                actions={<>
                    {/* <Button icon="chart">Ver Analytics</Button> */}
                    <Button variant="primary" icon="plus">Nuevo interventor</Button>
                </>}
            />

            <div className="service-summary ivr-kpis">
                {kpisIntervenors.map(x => (
                    <div key={x[0]}>
                        <span> <Icon name={x[2]}/> </span>

                        <div>
                            <strong>{x[1]}</strong>
                            <small>{x[0]}</small>
                        </div>
                    </div>
                ))}
                
            </div>
        </>
    )
}

export default IntervenorsPage