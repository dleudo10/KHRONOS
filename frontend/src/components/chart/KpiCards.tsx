import Icon, { type IconName } from "../ui/Icon"

const kpis = [
    { label: "ALTAS HOY", value: "23", delta: "+8.4% vs ayer", tone: "up", icon: "logout" as IconName },
    { label: "EN PROCESO", value: "14", delta: "6 dentro del SLA", tone: "info", icon: "clock" as IconName },
    { label: "COMPLETADAS", value: "18", delta: "+12.2%", tone: "up", icon: "check" as IconName },
    { label: "SLA VENCIDOS", value: "4", delta: "-2.1%", tone: "down", icon: "alert" as IconName },
    { label: "TIEMPO PROMEDIO", value: "1h 14m", delta: "-8.5%", tone: "up", icon: "history" as IconName },
    { label: "CAMAS DISPONIBLES", value: "8", delta: "+3 desde las 8:00", tone: "up", icon: "bed" as IconName },
];

const KpiCards = ({ compact = false }: { compact?: boolean }) => {
    return (
        <div className={`kpi-grid ${compact ? "compact" : ""}`}>
            {kpis.map((k, i) =>
                <div className="kpi-card" key={k.label}>
                    <div className={`kpi-icon ki-${i}`}>
                        <Icon name={k.icon}/>
                    </div>

                    <div className="kpi-label">{k.label}</div>
                    
                    <div className="kpi-value">{k.value}</div>
                    
                    <div className={`kpi-delta ${k.tone}`}>
                        {k.tone === "up" ? "↗" : k.tone === "down" ? "↘" : "●"} 
                        {k.delta}
                    </div>
                </div>
            )}
        </div>
    )
}

export default KpiCards