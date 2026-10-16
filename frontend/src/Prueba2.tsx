import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
 
type IconName =
  | "grid" | "bed" | "check" | "bell" | "flow" | "users" | "building"
  | "chart" | "history" | "settings" | "search" | "calendar" | "arrow"
  | "clock" | "alert" | "spark" | "more" | "filter" | "plus" | "play"
  | "pause" | "chevron" | "menu" | "close" | "logout" | "layers" | "eye";
 
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    bed: <><path d="M3 19v-8m18 8v-5a3 3 0 0 0-3-3H9v8m-6-3h18"/><path d="M9 11V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    flow: <><rect x="4" y="3" width="6" height="5" rx="1"/><rect x="14" y="16" width="6" height="5" rx="1"/><path d="M7 8v4h10v4m-10-4v4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    building: <><path d="M3 21h18M6 21V3h12v18M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5m4-2v6l4 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9v-.1A1.7 1.7 0 0 0 7.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.2 15a1.7 1.7 0 0 0-1.2-1H2V10h.1a1.7 1.7 0 0 0 1.1-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 7.6 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9 2.1V2h4v.1A1.7 1.7 0 0 0 14.4 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 20.8 9a1.7 1.7 0 0 0 1.2 1h.1v4H22a1.7 1.7 0 0 0-2.6 1Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    alert: <><path d="M10.3 3.5 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.5a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>,
    spark: <path d="m12 3 1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Zm6 12 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    play: <path d="m8 5 11 7-11 7V5Z"/>,
    pause: <path d="M9 5v14m6-14v14"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3"/><path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
 
type Page = "Dashboard" | "Giro de camas" | "Mis tareas" | "Notificaciones" | "Workflows" | "Workflow Detail" | "Versiones" | "Workflow Builder" | "Workflow Executions" | "Execution Detail" | "Interventores" | "Camas" | "Servicios" | "Analytics" | "Auditoría" | "Configuración" | "Documentación";
type Tone = "success" | "info" | "warning" | "danger" | "neutral";
 
type TaskStatus = "Pendiente" | "En proceso" | "Completada" | "Bloqueada";
type AppContextValue = {
  navigate: (page: Page) => void;
  notify: (message: string, tone?: Tone) => void;
  taskStatuses: TaskStatus[];
  updateTask: (index: number, status: TaskStatus) => void;
  unread: number;
  readAll: () => void;
};
const AppContext = createContext<AppContextValue | null>(null);
function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppContext is not available");
  return value;
}
 
const navTop: {label: Page; icon: IconName}[] = [
  { label: "Dashboard", icon: "grid" }, { label: "Giro de camas", icon: "bed" },
  { label: "Mis tareas", icon: "check" }, { label: "Notificaciones", icon: "bell" },
];
const navFlow: {label: Page; icon: IconName}[] = [
  { label: "Workflows", icon: "flow" },
];
const navAdmin: {label: Page; icon: IconName}[] = [
  { label: "Interventores", icon: "users" }, { label: "Camas", icon: "bed" },
  { label: "Servicios", icon: "building" }, { label: "Analytics", icon: "chart" },
  { label: "Auditoría", icon: "history" }, { label: "Configuración", icon: "settings" },
  { label: "Documentación", icon: "layers" },
];
 
function Button({ children, variant = "secondary", icon, onClick }: { children: ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"; icon?: IconName; onClick?: () => void }) {
  return <button type="button" className={`btn btn-${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16}/>}<span>{children}</span></button>;
}
function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot"/>{children}</span>;
}
function SelectPill({ children }: { children: ReactNode }) {
  return <button className="select-pill"><span>{children}</span><Icon name="chevron" size={14}/></button>;
}
 
function Sidebar({ page, setPage, open, close }: { page: Page; setPage: (p: Page) => void; open: boolean; close: () => void }) {
  const { unread } = useApp();
  const workflowPage = ["Workflows","Workflow Detail","Versiones","Workflow Builder","Workflow Executions","Execution Detail"].includes(page);
  const section = (items: typeof navTop) => items.map(item =>
    <button key={item.label} className={`nav-item ${page === item.label || (item.label === "Workflows" && workflowPage) ? "active" : ""}`} onClick={() => { setPage(item.label); close(); }}>
      <Icon name={item.icon}/><span>{item.label}</span>{item.label === "Notificaciones" && unread > 0 && <b>{unread}</b>}
    </button>);
  return <>
    {open && <div className="backdrop" onClick={close}/>}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Icon name="bed" size={22}/><span/></div><div><strong>Giro de Camas</strong><small>OPERACIONES</small></div><button className="mobile-close" onClick={close}><Icon name="close"/></button></div>
      <nav>
        {section(navTop)}
        <div className="nav-label">GESTIÓN DE FLUJOS</div>
        {section(navFlow)}
        <div className="nav-label">ADMINISTRACIÓN</div>
        {section(navAdmin)}
      </nav>
      <div className="user-card">
        <div className="user-line"><div className="avatar">DL</div><div><strong>David Leudo</strong><small>Administrador</small></div><Icon name="more"/></div>
        <div className="clinic"><Icon name="building" size={15}/><span>Clínica Antioquia</span><Icon name="chevron" size={13}/></div>
        <button className="profile-button">Mi perfil <Icon name="arrow" size={14}/></button>
      </div>
    </aside>
  </>;
}
 
function Topbar({ page, toggleMenu, setPage }: { page: Page; toggleMenu: () => void; setPage: (p: Page) => void }) {
  const { unread } = useApp();
  const pageLabel: Partial<Record<Page,string>> = {"Workflow Detail":"Detalle del workflow","Workflow Executions":"Ejecuciones","Execution Detail":"Detalle de ejecución","Workflow Builder":"Constructor de workflow"};
  return <header className="topbar">
    <div className="crumb"><button className="menu-button" onClick={toggleMenu}><Icon name="menu"/></button><span>Operación</span><Icon name="chevron" size={13}/><strong>{pageLabel[page]||page}</strong></div>
    <div className="search"><Icon name="search" size={17}/><input placeholder="Buscar paciente, habitación, cama..."/><kbd>⌘ K</kbd></div>
    <div className="top-actions"><button className="icon-button notification" onClick={() => setPage("Notificaciones")}><Icon name="bell"/>{unread > 0 && <span>{unread}</span>}</button><div className="avatar small">DL</div></div>
  </header>;
}
 
const kpis = [
  { label: "ALTAS HOY", value: "23", delta: "+8.4% vs ayer", tone: "up", icon: "logout" as IconName },
  { label: "EN PROCESO", value: "14", delta: "6 dentro del SLA", tone: "info", icon: "clock" as IconName },
  { label: "COMPLETADAS", value: "18", delta: "+12.2%", tone: "up", icon: "check" as IconName },
  { label: "SLA VENCIDOS", value: "4", delta: "-2.1%", tone: "down", icon: "alert" as IconName },
  { label: "TIEMPO PROMEDIO", value: "1h 14m", delta: "-8.5%", tone: "up", icon: "history" as IconName },
  { label: "CAMAS DISPONIBLES", value: "8", delta: "+3 desde las 8:00", tone: "up", icon: "bed" as IconName },
];
 
function KpiCards({ compact = false }: { compact?: boolean }) {
  return <div className={`kpi-grid ${compact ? "compact" : ""}`}>{kpis.map((k, i) =>
    <div className="kpi-card" key={k.label}><div className={`kpi-icon ki-${i}`}><Icon name={k.icon}/></div><div className="kpi-label">{k.label}</div><div className="kpi-value">{k.value}</div><div className={`kpi-delta ${k.tone}`}>{k.tone === "up" ? "↗" : k.tone === "down" ? "↘" : "●"} {k.delta}</div></div>
  )}</div>;
}
 
const beds = [
  { room:"304", bed:"304-A", patient:"Juan Pérez", task:"Retiro de dispositivos", owner:"Enfermería", time:"18 min", sla:"20 min", status:"En proceso", tone:"info" as Tone, progress:76 },
  { room:"305", bed:"305-A", patient:"Laura Gómez", task:"Desinfección terminal", owner:"Servicios Generales", time:"42 min", sla:"30 min", status:"SLA vencido", tone:"danger" as Tone, progress:100 },
  { room:"306", bed:"306-A", patient:"—", task:"Lista para asignación", owner:"Sin interventor", time:"12 min", sla:"—", status:"Disponible", tone:"success" as Tone, progress:100 },
  { room:"307", bed:"307-A", patient:"Carlos Ruiz", task:"Validación de copago", owner:"Facturación", time:"26 min", sla:"30 min", status:"Próximo a vencer", tone:"warning" as Tone, progress:87 },
  { room:"308", bed:"308-B", patient:"María Torres", task:"Traslado de paciente", owner:"Camillero", time:"8 min", sla:"10 min", status:"En proceso", tone:"info" as Tone, progress:80 },
  { room:"402", bed:"402-A", patient:"Andrés Díaz", task:"Autorización de salida", owner:"Facturación", time:"31 min", sla:"25 min", status:"SLA vencido", tone:"danger" as Tone, progress:100 },
];
 
function BedCard({ bed, detailed = false, onClick }: { bed: typeof beds[number]; detailed?: boolean; onClick?: () => void }) {
  return <button className={`bed-card tone-${bed.tone}`} onClick={onClick}>
    <div className="bed-card-head"><div><small>HABITACIÓN {bed.room}</small><strong>{bed.bed}</strong></div><Badge tone={bed.tone}>{bed.status}</Badge></div>
    <div className="patient"><span>Paciente</span><strong>{bed.patient}</strong></div>
    <div className="bed-task"><div className="task-icon"><Icon name={bed.tone === "success" ? "check" : "clock"} size={17}/></div><div><small>{bed.owner}</small><strong>{bed.task}</strong></div></div>
    <div className="sla-row"><span><Icon name="clock" size={14}/> {bed.time}</span><span>SLA {bed.sla}</span></div>
    <div className="progress"><i style={{width: `${bed.progress}%`}}/></div>
    {detailed && <div className="mini-flow"><span className="done">Alta ✓</span><b/><span className="done">Fact. ✓</span><b/><span className="current">Enferm. ●</span><b/><span>Camillero ○</span></div>}
  </button>;
}
 
function PanelTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="panel-title"><div><h2>{title}</h2><span className="live-dot">EN VIVO</span></div>{action}</div>;
}
 
function LineChart() {
  return <div className="line-chart">
    <div className="y-labels"><span>120</span><span>90</span><span>60</span><span>30</span></div>
    <div className="chart-area"><div/><div/><div/><div/>
      <svg viewBox="0 0 600 170" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--brand-400)" stopOpacity=".2"/><stop offset="1" stopColor="var(--brand-400)" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,95 C55,75 75,125 130,102 S205,56 260,76 S340,122 390,83 S470,66 520,48 S570,55 600,30 L600,170 L0,170Z"/><path className="line" d="M0,95 C55,75 75,125 130,102 S205,56 260,76 S340,122 390,83 S470,66 520,48 S570,55 600,30"/><circle cx="520" cy="48" r="5"/></svg>
      <div className="x-labels"><span>1 Jun</span><span>7 Jun</span><span>14 Jun</span><span>21 Jun</span><span>Hoy</span></div>
    </div>
  </div>;
}
 
function Bottlenecks() {
  const rows = [
    ["Enfermería","150","22 min","20 min","77%","warning"],
    ["Servicios Generales","85","34 min","25 min","69%","danger"],
    ["Facturación","130","18 min","20 min","89%","info"],
    ["Camillero","110","9 min","10 min","94%","success"],
  ];
  return <div className="table-wrap"><table><thead><tr><th>Interventor</th><th>Casos</th><th>Promedio</th><th>SLA</th><th>Cumplimiento</th></tr></thead>
    <tbody>{rows.map(r => <tr key={r[0]}><td><span className={`table-avatar ta-${r[5]}`}>{r[0].slice(0,2).toUpperCase()}</span><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><div className="compliance"><span>{r[4]}</span><div><i className={`fill-${r[5]}`} style={{width:r[4]}}/></div></div></td></tr>)}</tbody>
  </table></div>;
}
 
function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="page-actions">{actions}</div></div>;
}
 
function Dashboard({ setPage, openBed }: { setPage: (p: Page) => void; openBed: (b: typeof beds[number]) => void }) {
  return <>
    <PageHeader title="Buenos días, David" subtitle="Resumen operativo del giro de camas" actions={<><SelectPill>Hoy</SelectPill><Button icon="chart" onClick={() => setPage("Analytics")}>Ver reporte</Button></>}/>
    <KpiCards/>
    <section className="panel"><PanelTitle title="Giro de camas en tiempo real" action={<button className="text-button" onClick={() => setPage("Giro de camas")}>Ver todas las camas <Icon name="arrow" size={15}/></button>}/>
      <div className="bed-grid dashboard-beds">{beds.slice(0,4).map(b => <BedCard key={b.bed} bed={b} onClick={() => openBed(b)}/>)}</div>
    </section>
    <div className="dashboard-columns">
      <section className="panel chart-panel"><PanelTitle title="Tiempo promedio de giro" action={<SelectPill>Últimos 30 días</SelectPill>}/><div className="chart-stat"><strong>74 min</strong><span>↘ 8.5%</span><small>Promedio total</small></div><LineChart/></section>
      <section className="panel bottleneck"><PanelTitle title="Principales cuellos de botella" action={<button className="icon-button"><Icon name="more"/></button>}/><Bottlenecks/></section>
    </div>
    <div className="metrics-row">
      <section className="panel donut-panel"><PanelTitle title="Espera vs ejecución"/><div className="donut-content"><div className="donut"><div><strong>74m</strong><span>Total</span></div></div><div className="legend"><div><i className="wait"/><span>Tiempo esperando</span><strong>35%</strong></div><div><i className="execute"/><span>Tiempo ejecutando</span><strong>65%</strong></div></div></div></section>
      <section className="panel bars-panel"><PanelTitle title="Camas liberadas por día" action={<span className="panel-note">Esta semana</span>}/><div className="bars">{[55,72,48,82,66,91,76].map((v,i)=><div key={i}><span>{12+i}</span><i style={{height:`${v}%`}}/><small>{["L","M","M","J","V","S","D"][i]}</small></div>)}</div></section>
    </div>
  </>;
}
 
function BedsPage({ openBed }: { openBed: (b: typeof beds[number]) => void }) {
  return <>
    <PageHeader title="Giro de camas" subtitle="Monitorea el estado de las camas y procesos de alta en tiempo real." actions={<><Button icon="history">Actualizar</Button><Button variant="primary" icon="grid">Vista tarjetas</Button></>}/>
    <div className="filters">{["Servicio","Piso","Estado","Interventor","Tipo de alta","Fecha"].map(x=><SelectPill key={x}>{x}</SelectPill>)}<button className="clear-filter">Limpiar filtros</button></div>
    <div className="summary-strip">{[["48","Camas totales","neutral"],["8","Disponibles","success"],["14","En giro","info"],["4","Vencidas","danger"],["22","Ocupadas","neutral"]].map(x=><div key={x[1]}><i className={`summary-${x[2]}`}/><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div>
    <div className="result-head"><span>Mostrando <strong>14 camas en giro</strong></span><span>Actualizado hace 30 segundos</span></div>
    <div className="bed-grid full">{beds.map(b=><BedCard key={b.bed} bed={b} detailed onClick={()=>openBed(b)}/>)}</div>
  </>;
}
 
function BedDrawer({ bed, close }: { bed: typeof beds[number]; close: () => void }) {
  const { navigate, notify } = useApp();
  const steps = [["08:42","Alta médica","Dr. Santiago Ruiz","Completado"],["08:45","Plan de egreso","Laura Mejía","Completado"],["08:51","Facturación","Ana Velásquez","Completado"],["09:03","Enfermería","María López","Completado"],["09:18","Camillero","Felipe Mora","Completado"],["09:30","Servicios Generales","Carlos Páez","En proceso"]];
  return <><div className="drawer-backdrop" onClick={close}/><aside className="drawer">
    <div className="drawer-head"><div><span>HABITACIÓN {bed.room}</span><h2>Cama {bed.bed}</h2></div><button className="icon-button" onClick={close}><Icon name="close"/></button></div>
    <div className="drawer-summary"><div><small>PACIENTE</small><strong>{bed.patient}</strong></div><Badge tone="danger">SLA vencido</Badge><div className="drawer-time"><span>Tiempo total <strong>1h 18m</strong></span><span>SLA total <strong>1h</strong></span></div></div>
    <div className="drawer-metrics">{[["1h 18m","Tiempo total"],["35m","Esperando"],["43m","Ejecutando"],["5/6","Tareas"]].map(x=><div key={x[1]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div>
    <div className="drawer-section"><div className="section-heading"><h3>Timeline del proceso</h3><span>83% completado</span></div>
      <div className="timeline">{steps.map((s,i)=><div className={`timeline-item ${i<5?"complete":"current"}`} key={s[1]}><div className="timeline-time">{s[0]}</div><div className="timeline-mark">{i<5?<Icon name="check" size={13}/>:<span/>}</div><div className="timeline-card"><div><strong>{s[1]}</strong><Badge tone={i<5?"success":"info"}>{s[3]}</Badge></div><span>{s[2]} · {i<5?"12 min":"18 min transcurridos"}</span></div></div>)}</div>
    </div>
    <div className="drawer-actions"><Button onClick={()=>notify(`Ficha de ${bed.patient} cargada`)}>Ver paciente</Button><Button onClick={()=>{close();navigate("Auditoría")}}>Ver historial</Button><Button variant="primary" icon="flow" onClick={()=>{close();navigate("Workflow Builder")}}>Ver workflow</Button></div>
  </aside></>;
}
 
function Tasks() {
  const { taskStatuses, updateTask, notify } = useApp();
  const tasks = [
    {bed:"304-A",room:"304",patient:"Juan Pérez",task:"Retiro de dispositivos",state:"Nueva tarea",tone:"info" as Tone,time:"17 min",sla:"20 min"},
    {bed:"308-B",room:"308",patient:"María Torres",task:"Traslado de paciente",state:"En proceso",tone:"warning" as Tone,time:"8 min",sla:"10 min"},
    {bed:"402-A",room:"402",patient:"Andrés Díaz",task:"Validar autorización de salida",state:"Vencida",tone:"danger" as Tone,time:"31 min",sla:"25 min"},
  ];
  return <><PageHeader title="Mis tareas" subtitle="Gestiona las tareas asignadas a ti." actions={<Button icon="history">Actualizar</Button>}/>
    <div className="task-kpis">{[["7","Pendientes","clock"],["2","En proceso","play"],["1","Vencidas","alert"],["18","Completadas hoy","check"]].map(x=><div key={x[1]}><div><Icon name={x[2] as IconName}/></div><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div>
    <div className="tabs">{["Todas 10","Pendientes 7","En proceso 2","Vencidas 1","Completadas"].map((x,i)=><button className={i===0?"active":""} key={x}>{x}</button>)}</div>
    <div className="task-list">{tasks.map((t,i)=>{
      const status = taskStatuses[i];
      const tone: Tone = status === "Completada" ? "success" : status === "Bloqueada" ? "danger" : status === "En proceso" ? "warning" : t.tone;
      return <div className={`task-card ${status === "Completada" ? "task-completed" : ""}`} key={t.bed}><div className={`task-band band-${tone}`}/><div className="task-main"><div className="task-state"><Badge tone={tone}>{status}</Badge><span>Asignada hace {i+2} min</span></div><h3>{t.task}</h3><div className="task-patient"><div className="room-icon"><Icon name="bed"/></div><div><strong>Habitación {t.room} · Cama {t.bed}</strong><span>{t.patient}</span></div></div></div><div className="task-meta"><div><span>WORKFLOW</span><strong>Alta Hospitalaria</strong></div><div><span>TRANSCURRIDO</span><strong className={t.tone==="danger"?"red":""}>{status === "Completada" ? "Finalizada" : t.time}</strong></div><div><span>SLA</span><strong>{t.sla}</strong></div></div><div className="task-actions">{status === "Pendiente" && <Button variant="primary" icon="play" onClick={()=>{updateTask(i,"En proceso");notify(`Tarea “${t.task}” iniciada`,"info")}}>Iniciar tarea</Button>}{status === "En proceso" && <><Button variant="primary" icon="check" onClick={()=>{updateTask(i,"Completada");notify(`Tarea completada. La siguiente etapa fue notificada.`,"success")}}>Completar</Button><Button variant="ghost" icon="pause" onClick={()=>{updateTask(i,"Bloqueada");notify("Tarea bloqueada y escalada al administrador","warning")}}>Bloquear</Button></>}{status === "Bloqueada" && <Button onClick={()=>updateTask(i,"En proceso")}>Reanudar</Button>}{status === "Completada" && <Button variant="ghost" icon="eye" onClick={()=>notify("Historial de tarea abierto")}>Ver historial</Button>}</div></div>
    })}</div>
  </>;
}
 
const workflowRows = [
  {name:"Alta hospitalaria estándar",code:"ALTA-EST",description:"Coordina el egreso clínico y la liberación de la cama.",active:true,published:"v1.2",versions:4,modified:"24 Jun 2025",author:"David Leudo",draft:true},
  {name:"Alta con coordinación de enfermería",code:"ALTA-ENF",description:"Alta con validaciones adicionales del equipo de enfermería.",active:true,published:"v2.0",versions:3,modified:"22 Jun 2025",author:"Ana Ríos",draft:false},
  {name:"Preparación y liberación de cama",code:"LIB-CAMA",description:"Prepara la habitación para una nueva asignación.",active:true,published:"v1.1",versions:2,modified:"18 Jun 2025",author:"Carolina Vélez",draft:true},
  {name:"Limpieza y disponibilidad de cama",code:"LIMP-CAMA",description:"Controla limpieza terminal, verificación y disponibilidad.",active:false,published:"—",versions:1,modified:"12 Jun 2025",author:"David Leudo",draft:true},
];
 
function WorkflowNav({ current }: { current:"definitions"|"executions" }) {
  const { navigate } = useApp();
  return <div className="module-nav"><button className={current==="definitions"?"active":""} onClick={()=>navigate("Workflows")}><Icon name="layers" size={16}/>Definiciones</button><button className={current==="executions"?"active":""} onClick={()=>navigate("Workflow Executions")}><Icon name="play" size={16}/>Ejecuciones</button></div>;
}
 
function DemoNote() {
  return <div className="demo-note"><Icon name="spark" size={15}/><span>Contenido demostrativo del prototipo. Los cambios se simulan localmente.</span></div>;
}
 
function Workflows({ setPage }: { setPage:(p:Page)=>void }) {
  const { notify } = useApp();
  const [creating,setCreating]=useState(false);
  const [created,setCreated]=useState(false);
  return <><WorkflowNav current="definitions"/><PageHeader title="Workflows" subtitle="Administra los flujos de trabajo que coordinan los procesos de la clínica." actions={<Button variant="primary" icon="plus" onClick={()=>setCreating(true)}>Crear workflow</Button>}/>
    <DemoNote/>
    <div className="workflow-kpis">{[["4","Total de workflows","flow"],["3","Activos","check"],["1","Inactivo","pause"],["3","Borradores pendientes","layers"]].map(x=><div key={x[1]}><span><Icon name={x[2] as IconName}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div></div>)}</div>
    <section className="panel workflow-admin"><div className="workflow-filters"><div className="search small-search"><Icon name="search"/><input placeholder="Buscar por nombre o código..."/></div><SelectPill>Todos los estados</SelectPill><SelectPill>Versión publicada</SelectPill><SelectPill>Modificación reciente</SelectPill><button className="clear-filter">Limpiar filtros</button></div>
      <div className="table-wrap"><table className="workflow-table"><thead><tr><th>Nombre</th><th>Código</th><th>Descripción</th><th>Estado</th><th>Versión publicada</th><th>Versiones</th><th>Última modificación</th><th>Modificado por</th><th>Acciones</th></tr></thead><tbody>{workflowRows.map(row=><tr key={row.code} onClick={()=>setPage("Workflow Detail")}><td><span className="table-avatar"><Icon name="flow" size={14}/></span><strong>{row.name}</strong></td><td><code>{row.code}</code></td><td className="description-cell">{row.description}</td><td><Badge tone={row.active?"success":"neutral"}>{row.active?"Activo":"Inactivo"}</Badge></td><td><strong>{row.published}</strong></td><td>{row.versions}</td><td>{row.modified}</td><td>{row.author}</td><td><button className="icon-button" title="Más acciones" onClick={event=>{event.stopPropagation();notify(`Acciones de ${row.name}`)}}><Icon name="more"/></button></td></tr>)}</tbody></table></div>
    </section>
    {creating&&<><div className="drawer-backdrop" onClick={()=>setCreating(false)}/><aside className="drawer workflow-create"><div className="drawer-head"><div><span>NUEVA DEFINICIÓN</span><h2>Crear workflow</h2></div><button className="icon-button" onClick={()=>setCreating(false)}><Icon name="close"/></button></div><div className="drawer-form"><p>Configura la identidad del proceso. Las tareas y conexiones se agregan después en el Builder.</p><label>Nombre del workflow<input defaultValue="Alta hospitalaria especializada"/></label><label>Código único<input defaultValue="ALTA-ESP"/></label><label>Descripción<textarea defaultValue="Coordina el alta y la liberación de cama para servicios especializados."/></label><label>Estado inicial<select defaultValue="active"><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label>{created&&<div className="success-banner"><Icon name="check"/><span>Workflow y primera versión borrador creados.</span></div>}</div><div className="drawer-actions"><Button onClick={()=>setCreating(false)}>Cancelar</Button>{created?<Button variant="primary" icon="spark" onClick={()=>setPage("Workflow Builder")}>Configurar primera versión</Button>:<Button variant="primary" icon="plus" onClick={()=>{setCreated(true);notify("Workflow creado como borrador","success")}}>Crear workflow</Button>}</div></aside></>}
  </>;
}
 
function WorkflowDetail() {
  const { navigate, notify } = useApp();
  return <><WorkflowNav current="definitions"/><div className="detail-back"><Button variant="ghost" icon="arrow" onClick={()=>navigate("Workflows")}>Volver a workflows</Button></div><PageHeader title="Alta hospitalaria estándar" subtitle="ALTA-EST · Coordina el egreso clínico y la liberación de la cama." actions={<><Button icon="play" onClick={()=>navigate("Workflow Executions")}>Ver ejecuciones</Button><Button icon="layers" onClick={()=>navigate("Versiones")}>Ver versiones</Button><Button variant="primary" icon="plus" onClick={()=>notify("Nueva versión v1.3 creada como borrador","success")}>Crear nueva versión</Button></>}/>
    <div className="detail-summary"><section className="panel workflow-overview"><div className="overview-head"><div><Badge tone="success">Activo</Badge><h2>Definición del proceso</h2><p>Las ejecuciones iniciadas conservan siempre la versión con la que comenzaron.</p></div><Button onClick={()=>navigate("Workflow Builder")}>Editar borrador v1.3</Button></div><div className="metadata-grid">{[["Versión publicada","v1.2"],["Borradores disponibles","v1.3"],["Fecha de creación","12 Mar 2025"],["Última modificación","24 Jun 2025"],["Modificado por","David Leudo"],["Ejecuciones históricas","482"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div></section>
    <section className="panel published-summary"><div className="panel-title"><div><h2>Versión publicada</h2></div><Badge tone="success">PUBLISHED</Badge></div><strong className="version-number">v1.2</strong><div className="version-stats"><span><b>10</b>Nodos</span><span><b>6</b>Tareas humanas</span><span><b>20 Jun</b>Publicada</span></div><Button icon="eye" onClick={()=>navigate("Workflow Builder")}>Consultar definición</Button></section></div>
    <section className="panel"><div className="panel-title"><div><h2>Versiones recientes</h2></div><button className="text-button" onClick={()=>navigate("Versiones")}>Ver historial completo <Icon name="arrow" size={14}/></button></div><VersionRows compact/></section>
  </>;
}
 
function VersionRows({ compact=false }: { compact?:boolean }) {
  const { navigate, notify }=useApp();
  const versions=[["v1.3","DRAFT","24 Jun 2025","David Leudo","—","10"],["v1.2","PUBLISHED","18 Jun 2025","David Leudo","20 Jun 2025","10"],["v1.1","ARCHIVED","02 May 2025","Ana Ríos","04 May 2025","9"],["v1.0","ARCHIVED","12 Mar 2025","David Leudo","15 Mar 2025","8"]];
  return <div className="table-wrap"><table><thead><tr><th>Versión</th><th>Estado</th><th>Fecha de creación</th><th>Autor</th><th>Fecha de publicación</th><th>Nodos</th><th>Acciones</th></tr></thead><tbody>{versions.slice(0,compact?3:versions.length).map(v=><tr key={v[0]}><td><strong>{v[0]}</strong></td><td><Badge tone={v[1]==="PUBLISHED"?"success":v[1]==="DRAFT"?"warning":"neutral"}>{v[1]}</Badge></td><td>{v[2]}</td><td>{v[3]}</td><td>{v[4]}</td><td>{v[5]}</td><td><div className="row-actions"><Button icon="eye" onClick={()=>navigate("Workflow Builder")}>{v[1]==="DRAFT"?"Abrir":"Consultar"}</Button>{v[1]==="DRAFT"?<Button variant="primary" onClick={()=>navigate("Workflow Builder")}>Editar</Button>:<Button onClick={()=>notify(`Nueva versión creada a partir de ${v[0]}`,"success")}>Crear versión</Button>}</div></td></tr>)}</tbody></table></div>;
}
 
function WorkflowVersions() {
  const { navigate, notify }=useApp();
  return <><WorkflowNav current="definitions"/><div className="detail-back"><Button variant="ghost" icon="arrow" onClick={()=>navigate("Workflow Detail")}>Alta hospitalaria estándar</Button></div><PageHeader title="Historial de versiones" subtitle="Consulta cambios publicados y administra borradores editables." actions={<Button variant="primary" icon="plus" onClick={()=>notify("Nueva versión v1.4 creada como borrador","success")}>Crear nueva versión</Button>}/><div className="immutability-note"><Icon name="history"/><div><strong>Historial inmutable</strong><span>Las versiones publicadas o archivadas no se editan. Crea un borrador para introducir cambios.</span></div></div><section className="panel"><VersionRows/></section></>;
}
 
function WorkflowBuilder() {
  const { navigate, notify } = useApp();
  type NodeType="start"|"task"|"condition"|"split"|"join"|"end";
  type Activation="all"|"any";
  type FlowNode={id:number;type:NodeType;name:string;description:string;owner:string;sla:number;warning:number;priority:string;required:boolean;reassign:boolean;field:string;operator:string;value:string;strategy:string;x:number;y:number;dependencies:number[];activation:Activation};
  const makeNode=(id:number,type:NodeType,name:string,x:number,y:number,dependencies:number[]=[]):FlowNode=>({id,type,name,description:"",owner:"Enfermería",sla:20,warning:80,priority:"Normal",required:true,reassign:true,field:"Tipo de alta",operator:"Es igual a",value:"Alta directa",strategy:"Esperar todas",x,y,dependencies,activation:"all"});
  const initial:FlowNode[]=[
    {...makeNode(1,"start","Alta médica",50,265),description:"Inicio del proceso"},
    {...makeNode(2,"task","Plan de egreso",320,80,[1]),description:"Preparar salida del paciente",sla:15},
    {...makeNode(3,"task","Facturación",320,265,[1]),description:"Cerrar cuenta hospitalaria",owner:"Facturación",sla:20},
    {...makeNode(4,"condition","Validar copago",320,450,[1]),description:"Evalúa si requiere copago",field:"Requiere copago",value:"Sí"},
    {...makeNode(5,"task","Gestión de copago",610,100,[3,4]),description:"Confirmar pago del paciente",owner:"Facturación",sla:20},
    {...makeNode(6,"task","Retiro de dispositivos",610,300,[2,3]),description:"Retiro de dispositivos y curaciones",sla:20},
    {...makeNode(7,"join","Unir gestiones",900,205,[5,6]),description:"Espera copago y enfermería",strategy:"Esperar todas"},
    {...makeNode(8,"task","Traslado del paciente",1140,205,[7]),description:"Traslado fuera de la habitación",owner:"Camillero",sla:10},
    {...makeNode(9,"task","Desinfección",1380,205,[8]),description:"Limpieza terminal",owner:"Servicios Generales",sla:30},
    {...makeNode(10,"end","Cama disponible",1620,205,[9]),description:"Fin del proceso"},
  ];
  const [nodes,setNodes]=useState<FlowNode[]>(initial);
  const [selectedId,setSelectedId]=useState(6);
  const [zoom,setZoom]=useState(75);
  const [history,setHistory]=useState<FlowNode[][]>([]);
  const [future,setFuture]=useState<FlowNode[][]>([]);
  const [published,setPublished]=useState(false);
  const [dependencyCandidate,setDependencyCandidate]=useState(1);
  const [dragging,setDragging]=useState<{id:number;clientX:number;clientY:number;x:number;y:number}|null>(null);
  const [simulation,setSimulation]=useState<number|null>(null);
  const [validationOpen,setValidationOpen]=useState(false);
  const [publishConfirm,setPublishConfirm]=useState(false);
  const selected=nodes.find(n=>n.id===selectedId)||nodes[0];
  const relationCount=nodes.reduce((total,node)=>total+node.dependencies.length,0);
  const commit=(next:FlowNode[])=>{if(published){notify("Las versiones publicadas son inmutables","warning");return}setHistory(h=>[...h,nodes]);setFuture([]);setNodes(next);setPublished(false)};
  const update=(field:keyof FlowNode,value:string|number|boolean|number[])=>{if(published)return;setNodes(current=>current.map(n=>n.id===selected.id?{...n,[field]:value}:n))};
  const addNode=(type:NodeType)=>{
    if((type==="start"&&nodes.some(n=>n.type==="start"))||(type==="end"&&nodes.some(n=>n.type==="end"))){notify(`El grafo solo puede tener un nodo de ${type==="start"?"inicio":"fin"}`,"warning");return}
    const labels={start:"Inicio",task:"Nueva tarea",condition:"Nueva condición",split:"División paralela",join:"Unión de dependencias",end:"Fin"};
    const id=Date.now();const node=makeNode(id,type,labels[type],180+nodes.length*35,120+((nodes.length*95)%450),type==="start"?[]:[selectedId]);
    commit([...nodes,node]);setSelectedId(id);setDependencyCandidate(nodes[0].id);notify(`${labels[type]} agregado al grafo`,"success");
  };
  const removeNode=(id:number)=>{const node=nodes.find(n=>n.id===id);if(node?.type==="start"||node?.type==="end"){notify("Inicio y Fin son obligatorios","warning");return}const next=nodes.filter(n=>n.id!==id).map(n=>({...n,dependencies:n.dependencies.filter(d=>d!==id)}));commit(next);setSelectedId(next[0].id);notify("Nodo y sus relaciones fueron eliminados","success")};
  const duplicateNode=(node:FlowNode)=>{if(node.type==="start"||node.type==="end"){notify("Este nodo no se puede duplicar","warning");return}const copy={...node,id:Date.now(),name:`${node.name} copia`,x:node.x+35,y:node.y+130,dependencies:[...node.dependencies]};commit([...nodes,copy]);setSelectedId(copy.id)};
  const hasPath=(from:number,target:number,visited=new Set<number>()):boolean=>{if(from===target)return true;if(visited.has(from))return false;visited.add(from);const node=nodes.find(n=>n.id===from);return !!node?.dependencies.some(dep=>hasPath(dep,target,visited))};
  const addDependency=()=>{if(selected.type==="start"){notify("Inicio no puede tener dependencias","warning");return}if(dependencyCandidate===selected.id){notify("Un nodo no puede depender de sí mismo","danger");return}if(selected.dependencies.includes(dependencyCandidate)){notify("La relación ya existe","warning");return}if(hasPath(dependencyCandidate,selected.id)){notify("La relación produciría un ciclo y no puede crearse","danger");return}commit(nodes.map(n=>n.id===selected.id?{...n,dependencies:[...n.dependencies,dependencyCandidate]}:n));notify("Dependencia conectada","success")};
  const removeDependency=(id:number)=>{commit(nodes.map(n=>n.id===selected.id?{...n,dependencies:n.dependencies.filter(dep=>dep!==id)}:n));notify("Relación eliminada")};
  const undo=()=>{if(!history.length){notify("No hay cambios para deshacer");return}const previous=history[history.length-1];setFuture(f=>[nodes,...f]);setHistory(h=>h.slice(0,-1));setNodes(previous);setSelectedId(previous[0].id)};
  const redo=()=>{if(!future.length){notify("No hay cambios para rehacer");return}const next=future[0];setHistory(h=>[...h,nodes]);setFuture(f=>f.slice(1));setNodes(next);setSelectedId(next[0].id)};
  const nodeLevel=(node:FlowNode,trail=new Set<number>()):number=>{if(!node.dependencies.length)return 0;if(trail.has(node.id))return 0;trail.add(node.id);const levels=node.dependencies.map(id=>{const dep=nodes.find(n=>n.id===id);return dep?nodeLevel(dep,new Set(trail)):0});return 1+(node.activation==="any"?Math.min(...levels):Math.max(...levels))};
  const maxLevel=Math.max(...nodes.map(n=>nodeLevel(n)));
  const executionState=(node:FlowNode)=>simulation===null?"idle":nodeLevel(node)<simulation?"complete":nodeLevel(node)===simulation?"running":"waiting";
  const simulate=()=>{if(!validate(false))return;setSimulation(current=>current===null?0:current>=maxLevel?null:current+1);notify(simulation===maxLevel?"Simulación reiniciada":"Avanzando una etapa de ejecución","info")};
  const validate=(showSuccess=true)=>{const errors:string[]=[];const startNodes=nodes.filter(n=>n.type==="start");const endNodes=nodes.filter(n=>n.type==="end");if(startNodes.length!==1)errors.push("Debe existir exactamente un nodo Inicio");if(endNodes.length!==1)errors.push("Debe existir exactamente un nodo Fin");if(nodes.some(n=>n.type!=="start"&&!n.dependencies.length))errors.push("Todos los nodos excepto Inicio requieren una dependencia");if(nodes.some(n=>!n.name.trim()))errors.push("Todos los nodos requieren nombre");if(nodes.some(n=>n.type==="task"&&(!n.owner||n.sla<=0)))errors.push("Las tareas requieren interventor y SLA");if(errors.length){notify(errors[0],"danger");return false}if(showSuccess)notify(`Grafo válido: ${nodes.length} nodos y ${relationCount} relaciones`,"success");return true};
  const onMove=(event:React.MouseEvent<HTMLElement>)=>{if(!dragging)return;const dx=(event.clientX-dragging.clientX)/(zoom/100);const dy=(event.clientY-dragging.clientY)/(zoom/100);setNodes(current=>current.map(n=>n.id===dragging.id?{...n,x:Math.max(10,dragging.x+dx),y:Math.max(10,dragging.y+dy)}:n))};
  const componentList:{type:NodeType;label:string;icon:IconName;hint:string}[]=[{type:"start",label:"Inicio",icon:"play",hint:"Punto de entrada"},{type:"task",label:"Tarea",icon:"check",hint:"Unidad ejecutable"},{type:"condition",label:"Condición",icon:"flow",hint:"Decisión lógica"},{type:"split",label:"División",icon:"layers",hint:"Abre rutas paralelas"},{type:"join",label:"Unión",icon:"layers",hint:"Espera dependencias"},{type:"end",label:"Fin",icon:"check",hint:"Cierre del flujo"}];
  const typeLabel={start:"Inicio",task:"Tarea",condition:"Condición",split:"División paralela",join:"Unión",end:"Fin"}[selected.type];
  const nodeIcon=(type:NodeType):IconName=>type==="start"?"play":type==="task"?"check":type==="condition"?"flow":type==="end"?"check":"layers";
  return <div className="builder-shell"><div className="builder-top"><div><Button variant="ghost" icon="arrow" onClick={()=>navigate("Workflow Detail")}>Volver</Button><div><strong>Alta hospitalaria estándar</strong><span>v1.3 — {published?"Publicado · solo lectura":"Borrador editable"} · grafo dirigido</span></div></div><div><Button variant="ghost" onClick={undo}>Deshacer</Button><Button variant="ghost" onClick={redo}>Rehacer</Button><Button icon="play" onClick={simulate}>{simulation===null?"Previsualizar":simulation>=maxLevel?"Reiniciar":"Siguiente etapa"}</Button><Button onClick={()=>notify("Borrador guardado localmente","success")}>Guardar borrador</Button><Button onClick={()=>{validate(false);setValidationOpen(true)}}>Validar</Button><Button variant="primary" onClick={()=>{if(published){notify("Esta versión ya está publicada y es inmutable","warning");return}if(validate(false))setPublishConfirm(true);else setValidationOpen(true)}}>{published?"Publicado":"Publicar"}</Button></div></div>
    <div className="builder-body"><aside className="components-panel"><h3>Nodos</h3><p>Agrega unidades al grafo</p>{componentList.map(item=><button key={item.type} onClick={()=>addNode(item.type)}><span><Icon name={item.icon}/></span><div><strong>{item.label}</strong><small>{item.hint}</small></div><Icon name="plus" size={15}/></button>)}<div className="builder-help"><Icon name="flow"/><div><strong>Dependencias reales</strong><span>Selecciona un nodo y agrega uno o varios predecesores desde el panel derecho.</span></div></div><div className="graph-legend"><strong>Simulación</strong><span><i className="sim-running"/>Ejecutando ahora</span><span><i className="sim-complete"/>Completado</span><span><i/>Esperando dependencias</span></div></aside>
    <main className="canvas graph-canvas" onMouseMove={onMove} onMouseUp={()=>setDragging(null)} onMouseLeave={()=>setDragging(null)}><div className="canvas-grid"/><div className="zoom-tools"><button onClick={()=>setZoom(z=>Math.max(45,z-10))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(120,z+10))}>+</button><button title="Ajustar vista" onClick={()=>setZoom(75)}><Icon name="eye" size={15}/></button></div><div className="canvas-meta"><Badge tone={published?"success":"warning"}>{published?"Publicado":"Cambios sin publicar"}</Badge><span>{nodes.length} nodos · {relationCount} relaciones</span></div>
      <div className="graph-stage" style={{transform:`scale(${zoom/100})`,transformOrigin:"top left"}}><svg className="graph-edges" width="1900" height="760" viewBox="0 0 1900 760"><defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z"/></marker></defs>{nodes.flatMap(node=>node.dependencies.map(depId=>{const dep=nodes.find(n=>n.id===depId);if(!dep)return null;const x1=dep.x+220,y1=dep.y+55,x2=node.x,y2=node.y+55,curve=Math.max(50,(x2-x1)/2);return <g key={`${depId}-${node.id}`}><path className={`edge edge-${executionState(node)}`} d={`M${x1},${y1} C${x1+curve},${y1} ${x2-curve},${y2} ${x2},${y2}`} markerEnd="url(#arrowhead)"/><text x={(x1+x2)/2} y={(y1+y2)/2-7}>{node.activation==="all"?"TODAS":"CUALQUIERA"}</text></g>}))}</svg>
      {nodes.map(node=><div key={node.id} className={`graph-node workflow-node node-${node.type} ${selectedId===node.id?"node-selected":""} simulation-${executionState(node)}`} style={{left:node.x,top:node.y}} onMouseDown={e=>{if((e.target as HTMLElement).closest("button"))return;setSelectedId(node.id);setDependencyCandidate(nodes.find(n=>n.id!==node.id)?.id||node.id);setDragging({id:node.id,clientX:e.clientX,clientY:e.clientY,x:node.x,y:node.y})}}><span className="node-icon"><Icon name={nodeIcon(node.type)} size={16}/></span><div><span className="node-type">{typeLabelFor(node.type)}</span><strong>{node.name}</strong><small>{node.description||"Sin descripción"}</small>{node.type==="task"&&<p><Icon name="clock" size={12}/> {node.owner} · {node.sla} min</p>}<div className="dependency-count"><Icon name="flow" size={11}/>{node.dependencies.length} dependencia{node.dependencies.length===1?"":"s"}</div></div><div className="node-actions"><button title="Duplicar" onClick={e=>{e.stopPropagation();duplicateNode(node)}}><Icon name="layers" size={12}/></button><button title="Eliminar" onClick={e=>{e.stopPropagation();removeNode(node.id)}}><Icon name="close" size={12}/></button></div><span className="port port-in"/><span className="port port-out"/></div>)}</div></main>
    <aside className="config-panel"><div className="config-head"><div><h3>Configuración de {typeLabel.toLowerCase()}</h3><span>ID #{selected.id.toString().slice(-6)}</span></div><Badge tone={selected.type==="start"||selected.type==="end"?"success":"info"}>{typeLabel}</Badge></div><label>Nombre<input value={selected.name} onChange={e=>update("name",e.target.value)}/></label><label>Descripción<textarea value={selected.description} onChange={e=>update("description",e.target.value)}/></label>
      {selected.type==="task"&&<><label>Interventor<select value={selected.owner} onChange={e=>update("owner",e.target.value)}><option>Enfermería</option><option>Facturación</option><option>Camillero</option><option>Servicios Generales</option><option>Coordinación</option></select></label><div className="field-row"><label>SLA (min)<input type="number" min="1" value={selected.sla} onChange={e=>update("sla",Number(e.target.value))}/></label><label>Advertencia (%)<input type="number" min="1" max="100" value={selected.warning} onChange={e=>update("warning",Number(e.target.value))}/></label></div><label>Prioridad<select value={selected.priority} onChange={e=>update("priority",e.target.value)}><option>Baja</option><option>Normal</option><option>Alta</option><option>Crítica</option></select></label></>}
      {selected.type==="condition"&&<><label>Campo a evaluar<select value={selected.field} onChange={e=>update("field",e.target.value)}><option>Tipo de alta</option><option>Requiere copago</option><option>Servicio</option><option>Estado de facturación</option></select></label><label>Operador<select value={selected.operator} onChange={e=>update("operator",e.target.value)}><option>Es igual a</option><option>No es igual a</option><option>Contiene</option></select></label><label>Valor<input value={selected.value} onChange={e=>update("value",e.target.value)}/></label></>}
      {selected.type==="join"&&<label>Estrategia de unión<select value={selected.strategy} onChange={e=>update("strategy",e.target.value)}><option>Esperar todas</option><option>Continuar con la primera</option><option>Esperar rutas obligatorias</option></select></label>}
      {selected.type!=="start"&&<div className="dependency-editor"><div className="dependency-head"><div><h4>Dependencias</h4><span>Qué debe terminar antes</span></div><Badge tone={selected.dependencies.length>1?"info":"neutral"}>{selected.dependencies.length}</Badge></div><label>Política de activación<select value={selected.activation} onChange={e=>update("activation",e.target.value)}><option value="all">Todas las dependencias</option><option value="any">Cualquiera de las dependencias</option></select></label><div className="dependency-list">{selected.dependencies.length===0&&<p>Este nodo todavía no tiene predecesores.</p>}{selected.dependencies.map(id=>{const dep=nodes.find(n=>n.id===id);return <div key={id}><span><Icon name={dep?nodeIcon(dep.type):"flow"} size={12}/>{dep?.name||"Nodo eliminado"}</span><button onClick={()=>removeDependency(id)}><Icon name="close" size={12}/></button></div>})}</div><div className="add-dependency"><select value={dependencyCandidate} onChange={e=>setDependencyCandidate(Number(e.target.value))}>{nodes.filter(n=>n.id!==selected.id).map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select><Button icon="plus" onClick={addDependency}>Conectar</Button></div><div className="dependency-note"><Icon name="spark"/><span>{selected.activation==="all"?"Se ejecutará cuando todos los predecesores terminen.":"Se ejecutará cuando termine cualquiera de sus predecesores."}</span></div></div>}
      <div className="config-actions"><Button variant="primary" icon="check" onClick={()=>published?notify("La versión publicada es de solo lectura","warning"):(setHistory(h=>[...h,nodes]),notify("Nodo y relaciones guardados","success"))}>Guardar cambios</Button>{selected.type!=="start"&&selected.type!=="end"&&<Button variant="danger" onClick={()=>removeNode(selected.id)}>Eliminar nodo</Button>}</div></aside></div>
    {validationOpen&&<><div className="builder-overlay" onClick={()=>setValidationOpen(false)}/><aside className="validation-panel"><div className="drawer-head"><div><span>VALIDACIÓN DE LA DEFINICIÓN</span><h2>Lista para publicar</h2></div><button className="icon-button" onClick={()=>setValidationOpen(false)}><Icon name="close"/></button></div><div className="validation-summary"><div><strong>0</strong><span>Errores bloqueantes</span></div><div><strong>2</strong><span>Advertencias</span></div></div><div className="validation-body"><div className="validation-success"><Icon name="check"/><div><strong>La estructura del grafo es válida</strong><span>Existe un inicio, un final alcanzable y todas las tareas tienen interventor y SLA válidos.</span></div></div><h3>Advertencias</h3>{[["Plan de egreso","La descripción podría incluir el criterio de finalización.",2],["Gestión de copago","Revisa si el SLA de 20 minutos aplica para todos los servicios.",5]].map(item=><button key={item[0]} onClick={()=>{setSelectedId(Number(item[2]));setValidationOpen(false)}}><Icon name="alert"/><div><strong>{item[0]}</strong><span>{item[1]}</span></div><Icon name="arrow" size={14}/></button>)}<div className="dependency-note"><Icon name="flow"/><span>Las uniones con múltiples entradas esperan todas las tareas predecesoras cuando la política es “Todas”.</span></div></div><div className="drawer-actions"><Button onClick={()=>setValidationOpen(false)}>Cerrar</Button><Button variant="primary" onClick={()=>{setValidationOpen(false);setPublishConfirm(true)}}>Continuar a publicación</Button></div></aside></>}
    {publishConfirm&&<><div className="builder-overlay" onClick={()=>setPublishConfirm(false)}/><div className="confirm-dialog"><span className="confirm-icon"><Icon name="layers"/></span><h2>Publicar versión v1.3</h2><p>Esta acción hará inmutable la versión. Las ejecuciones activas continuarán con su versión actual y solo las nuevas usarán v1.3.</p><div><Button onClick={()=>setPublishConfirm(false)}>Cancelar</Button><Button variant="primary" onClick={()=>{setPublishConfirm(false);setPublished(true);notify("Workflow v1.3 publicado correctamente","success")}}>Confirmar publicación</Button></div></div></>}
  </div>;
}

function typeLabelFor(type:"start"|"task"|"condition"|"split"|"join"|"end"){
  return {start:"INICIO",task:"TAREA",condition:"CONDICIÓN",split:"DIVISIÓN",join:"UNIÓN",end:"FIN"}[type];
}
 
const executionRows = [
  {id:"EXE-2025-0482",patient:"Juan Pérez",bed:"304-A",service:"Hospitalización Adultos",workflow:"Alta hospitalaria estándar",version:"v1.2",start:"24 Jun · 08:42",status:"ACTIVE",task:"2 tareas activas",elapsed:"1h 18m",sla:"Vencido"},
  {id:"EXE-2025-0481",patient:"Laura Gómez",bed:"305-A",service:"Hospitalización Adultos",workflow:"Alta hospitalaria estándar",version:"v1.2",start:"24 Jun · 08:15",status:"ACTIVE",task:"Realizar limpieza terminal",elapsed:"1h 45m",sla:"En riesgo"},
  {id:"EXE-2025-0479",patient:"María Torres",bed:"308-B",service:"Hospitalización Adultos",workflow:"Alta con coordinación",version:"v2.0",start:"24 Jun · 07:31",status:"COMPLETED",task:"Proceso finalizado",elapsed:"1h 06m",sla:"Cumplido"},
  {id:"EXE-2025-0475",patient:"Andrés Díaz",bed:"402-A",service:"UCI",workflow:"Preparación y liberación",version:"v1.1",start:"23 Jun · 18:20",status:"FAILED",task:"Acción automática fallida",elapsed:"2h 12m",sla:"Vencido"},
];
 
function WorkflowExecutions() {
  const { navigate }=useApp();
  return <><WorkflowNav current="executions"/><PageHeader title="Ejecuciones" subtitle="Consulta el avance de los procesos asociados a las altas hospitalarias."/><DemoNote/>
    <div className="workflow-kpis execution-kpis">{[["14","Ejecuciones activas","play"],["126","Completadas hoy","check"],["4","Con tareas vencidas","alert"],["1h 14m","Tiempo promedio","clock"]].map(x=><div key={x[1]}><span><Icon name={x[2] as IconName}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div></div>)}</div>
    <div className="filters execution-filters"><div className="search small-search"><Icon name="search"/><input placeholder="Paciente, alta o identificador..."/></div>{["Workflow","Versión","Estado","Servicio","Rango de fechas","SLA vencido","Interventor"].map(x=><SelectPill key={x}>{x}</SelectPill>)}<button className="clear-filter">Limpiar</button></div>
    <section className="panel execution-table"><div className="result-head"><span>Mostrando <strong>4 ejecuciones demostrativas</strong></span><span>Actualizado hace 30 segundos</span></div><div className="table-wrap"><table><thead><tr><th>Alta / Proceso</th><th>Paciente</th><th>Cama</th><th>Servicio</th><th>Workflow</th><th>Versión</th><th>Inicio</th><th>Estado</th><th>Tarea actual</th><th>Transcurrido</th><th>SLA</th></tr></thead><tbody>{executionRows.map(row=><tr key={row.id} onClick={()=>navigate("Execution Detail")}><td><strong>{row.id}</strong></td><td>{row.patient}</td><td><button className="bed-link" onClick={event=>{event.stopPropagation();navigate("Camas")}}>{row.bed}</button></td><td>{row.service}</td><td>{row.workflow}</td><td>{row.version}</td><td>{row.start}</td><td><Badge tone={row.status==="COMPLETED"?"success":row.status==="FAILED"?"danger":"info"}>{row.status}</Badge></td><td>{row.task}</td><td>{row.elapsed}</td><td><Badge tone={row.sla==="Vencido"?"danger":row.sla==="En riesgo"?"warning":"success"}>{row.sla==="Vencido"?"⚠ ":""}{row.sla}</Badge></td></tr>)}</tbody></table></div></section>
  </>;
}
 
function ExecutionDetail() {
  const { navigate }=useApp();
  const [taskOpen,setTaskOpen]=useState(false);
  const tasks=[["Validar orden de alta","Enfermería","COMPLETED","María López","08:45","08:52","15 min","Cumplido"],["Confirmar salida del paciente","Enfermería","COMPLETED","Laura Mejía","08:53","09:03","20 min","Cumplido"],["Retirar pertenencias","Enfermería","ACTIVE","María López","09:04","—","20 min","Vencido"],["Realizar limpieza terminal","Servicios Generales","ACTIVE","Carlos Páez","09:18","—","30 min","En riesgo"],["Actualizar estado de la cama","Sistema","PENDING","—","—","—","5 min","Pendiente"]];
  return <><WorkflowNav current="executions"/><div className="detail-back"><Button variant="ghost" icon="arrow" onClick={()=>navigate("Workflow Executions")}>Volver a ejecuciones</Button></div>
    <PageHeader title="EXE-2025-0482" subtitle="Alta ALT-2025-1048 · Juan Pérez" actions={<Button icon="bed" onClick={()=>navigate("Camas")}>Ver Kardex de cama 304-A</Button>}/>
    <div className="execution-hero panel"><div><span>EJECUCIÓN ACTIVA</span><h2>Alta hospitalaria estándar <small>v1.2</small></h2><p>Hospitalización Adultos · Cama 304-A · Inició 24 Jun 2025, 08:42</p></div><div className="execution-time"><Badge tone="info">ACTIVE</Badge><strong>1h 18m</strong><span>Tiempo transcurrido</span></div></div>
    <div className="operation-strip">{[["60%","Progreso"],["2 de 5","Completadas"],["2","Activas"],["1","Pendiente de habilitación"],["1","SLA vencido"],["09:18","Último evento"]].map(x=><div key={x[1]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}</div>
    <section className="panel execution-graph"><div className="panel-title"><div><h2>Grafo de ejecución</h2><span className="live-dot">SOLO LECTURA</span></div><span className="panel-note">Las dependencias pendientes se calculan desde el grafo</span></div><div className="runtime-flow">{[["Alta médica","done"],["Validar orden","done"],["Retirar pertenencias","active"],["Limpieza terminal","late"],["Actualizar cama","waiting"],["Cama disponible","waiting"]].map((n,i)=><div className={`runtime-step ${n[1]}`} key={n[0]} onClick={()=>i>1&&setTaskOpen(true)}><span>{n[1]==="done"?<Icon name="check" size={14}/>:n[1]==="waiting"?<Icon name="clock" size={14}/>:<Icon name="play" size={14}/>}</span><strong>{n[0]}</strong><small>{n[1]==="waiting"?"Pendiente de habilitación":n[1]==="done"?"Completado":n[1]==="late"?"En proceso · SLA vencido":"En proceso"}</small></div>)}</div></section>
    <div className="execution-layout"><section className="panel"><div className="panel-title"><div><h2>Tareas de la ejecución</h2></div></div><div className="table-wrap"><table><thead><tr><th>Tarea</th><th>Interventor</th><th>Estado</th><th>Reclamada por</th><th>Inicio</th><th>Finalización</th><th>SLA</th><th>Cumplimiento</th></tr></thead><tbody>{tasks.map(t=><tr key={t[0]} onClick={()=>setTaskOpen(true)}><td><strong>{t[0]}</strong></td><td>{t[1]}</td><td><Badge tone={t[2]==="COMPLETED"?"success":t[2]==="ACTIVE"?"info":"neutral"}>{t[2]}</Badge></td><td>{t[3]}</td><td>{t[4]}</td><td>{t[5]}</td><td>{t[6]}</td><td><Badge tone={t[7]==="Vencido"?"danger":t[7]==="En riesgo"?"warning":t[7]==="Cumplido"?"success":"neutral"}>{t[7]}</Badge></td></tr>)}</tbody></table></div></section>
    <section className="panel event-timeline"><div className="panel-title"><div><h2>Línea de tiempo</h2></div></div>{[["09:18","Tarea habilitada","Limpieza terminal fue asignada a Servicios Generales."],["09:04","Tarea iniciada","María López reclamó Retirar pertenencias."],["09:03","Tarea completada","Salida del paciente confirmada dentro del SLA."],["08:42","Ejecución iniciada","Se creó la ejecución con la versión v1.2."]].map((e,i)=><div className="event-item" key={e[0]}><span><Icon name={i===0?"play":"check"} size={13}/></span><div><small>{e[0]} · 24 Jun 2025</small><strong>{e[1]}</strong><p>{e[2]}</p></div></div>)}</section></div>
    {taskOpen&&<><div className="drawer-backdrop" onClick={()=>setTaskOpen(false)}/><aside className="drawer task-history"><div className="drawer-head"><div><span>HISTORIAL DE TAREA · TASK-5003</span><h2>Retirar pertenencias</h2></div><button className="icon-button" onClick={()=>setTaskOpen(false)}><Icon name="close"/></button></div><div className="task-history-body"><Badge tone="danger">ACTIVE · SLA VENCIDO</Badge><p>Retirar objetos personales y validar entrega con el acompañante antes de liberar la habitación.</p><div className="metadata-grid">{[["Interventor","Enfermería"],["Reclamada por","María López"],["Asignación","09:03"],["Inicio","09:04"],["Finalización","—"],["Duración esperada","15 min"],["SLA","20 min"],["Duración real","34 min y contando"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><h3>Eventos de la tarea</h3>{[["09:24","SLA incumplido","El tiempo máximo de 20 minutos fue superado."],["09:04","Tarea iniciada","María López inició la tarea."],["09:03","Tarea reclamada","La tarea fue reclamada por María López."],["09:03","Tarea habilitada","Todas las dependencias fueron completadas."]].map((e,i)=><div className="event-item" key={e[0]}><span><Icon name={i===0?"alert":"history"} size={13}/></span><div><small>{e[0]} · 24 Jun 2025</small><strong>{e[1]}</strong><p>{e[2]}</p></div></div>)}</div></aside></>}
  </>;
}
 
function Analytics() {
  return <><PageHeader title="Analytics" subtitle="Analiza el comportamiento histórico del giro de camas." actions={<Button icon="calendar">01 — 30 Jun 2025</Button>}/>
    <div className="filters analytics-filters">{["Servicio","Piso","Interventor","Tipo de alta","Turno","Workflow"].map(x=><SelectPill key={x}>{x}</SelectPill>)}<Button variant="primary" icon="filter">Aplicar filtros</Button></div>
    <div className="analytics-kpis">{[["74 min","Tiempo promedio","-8.5%"],["68 min","Mediana","-4.2%"],["126 min","P95","+2.1%"],["86.4%","Cumplimiento SLA","+5.8%"],["482","Camas liberadas","+12.3%"],["194h","Tiempo perdido","-6.7%"]].map((x,i)=><div key={x[1]}><span>{x[1]}</span><strong>{x[0]}</strong><small className={i===2?"bad":""}>{x[2]} vs periodo anterior</small></div>)}</div>
    <div className="analytics-grid"><section className="panel analytics-main"><PanelTitle title="Tiempo promedio de giro por día" action={<SelectPill>Promedio diario</SelectPill>}/><LineChart/></section><section className="panel donut-panel"><PanelTitle title="Cumplimiento SLA"/><div className="big-donut"><div><strong>86.4%</strong><span>Dentro del SLA</span></div></div><div className="sla-legend"><span><i className="green"/>416 a tiempo</span><span><i className="red-dot"/>66 vencidas</span></div></section></div>
    <div className="analytics-grid lower"><section className="panel"><PanelTitle title="Tiempo por interventor"/><div className="horizontal-bars">{[["Servicios Generales",34],["Enfermería",22],["Facturación",18],["Camillero",9]].map(x=><div key={x[0]}><span>{x[0]}</span><i><b style={{width:`${Number(x[1])*2.5}%`}}/></i><strong>{x[1]} min</strong></div>)}</div></section><section className="panel"><PanelTitle title="Giro por turno"/><div className="shift-cards">{[["Mañana","68 min","92%"],["Tarde","76 min","84%"],["Noche","83 min","79%"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]} SLA</small></div>)}</div></section></div>
  </>;
}
 
function Notifications({ setPage }:{setPage:(p:Page)=>void}) {
  const { unread, readAll, notify } = useApp();
  const notes=[["Nueva tarea","Retiro de dispositivos","Habitación 304","Hace 2 minutos","info"],["SLA próximo a vencer","Facturación","Habitación 201","Hace 5 minutos","warning"],["SLA vencido","Servicios Generales","Habitación 402","Hace 8 minutos","danger"],["Cama disponible","Desinfección completada","Habitación 306","Hace 14 minutos","success"]];
  return <><PageHeader title="Notificaciones" subtitle="Mantente al día con la operación en tiempo real." actions={<Button onClick={()=>{readAll();notify("Todas las notificaciones fueron marcadas como leídas","success")}}>Marcar todas como leídas</Button>}/><div className="tabs"><button className="active">Todas 12</button><button>No leídas {unread}</button></div><section className="panel notifications-list">{notes.map((n,i)=><button key={n[0]+i} onClick={()=>{if(n[0]==="Nueva tarea")setPage("Mis tareas");else notify(`${n[1]} — ${n[2]}`,n[4] as Tone)}}><div className={`note-icon note-${n[4]}`}><Icon name={n[4]==="danger"?"alert":n[4]==="success"?"check":n[4]==="warning"?"clock":"bell"}/></div><div><span>{n[0].toUpperCase()}</span><strong>{n[1]}</strong><p>{n[2]} · {n[3]}</p></div>{i<unread&&<i className="unread"/>}<Icon name="chevron"/></button>)}</section></>;
}
 
const documentation = [
  { title:"Dashboard", icon:"grid" as IconName, purpose:"Concentrar el estado operativo del hospital en tiempo real.", steps:["Revisa altas, camas disponibles y SLA vencidos en los KPI.","Selecciona una cama para abrir su trazabilidad completa.","Usa Ver reporte para profundizar en Analytics."], role:"Coordinación operativa" },
  { title:"Giro de camas", icon:"bed" as IconName, purpose:"Monitorear cada cama desde el alta hasta su nueva disponibilidad.", steps:["Filtra por servicio, piso, estado o interventor.","Identifica alertas por el color y el avance del SLA.","Abre una cama para consultar tareas, tiempos e historial."], role:"Central de camas" },
  { title:"Mis tareas", icon:"check" as IconName, purpose:"Ejecutar y registrar las actividades asignadas al usuario.", steps:["Inicia una tarea pendiente para comenzar a medir su ejecución.","Completa la actividad para activar la siguiente etapa.","Bloquea una tarea si existe un impedimento operativo."], role:"Personal asistencial y operativo" },
  { title:"Notificaciones", icon:"bell" as IconName, purpose:"Centralizar alertas, asignaciones y eventos críticos.", steps:["Consulta eventos no leídos desde el badge superior.","Selecciona una nueva tarea para ir a Mis tareas.","Marca todas como leídas al finalizar la revisión."], role:"Todos los usuarios" },
  { title:"Workflows", icon:"flow" as IconName, purpose:"Administrar los procesos que coordinan el giro de camas.", steps:["Consulta estado, versión y estructura de cada flujo.","Edita un workflow para abrir el constructor visual.","Duplica o crea una versión antes de hacer cambios mayores."], role:"Administración de procesos" },
  { title:"Workflow Builder", icon:"spark" as IconName, purpose:"Diseñar tareas, reglas, responsables y SLA sin código.", steps:["Selecciona un nodo para editar su configuración.","Valida el flujo antes de publicarlo.","Publica una versión para usarla en procesos nuevos."], role:"Administración de procesos" },
  { title:"Versiones", icon:"layers" as IconName, purpose:"Controlar cambios sin afectar procesos que ya están en ejecución.", steps:["Consulta cuál versión está publicada.","Crea una versión nueva para editar con seguridad.","Los procesos activos conservan su versión original."], role:"Administradores" },
  { title:"Interventores", icon:"users" as IconName, purpose:"Medir el desempeño de los equipos que intervienen en el proceso.", steps:["Compara pendientes, tiempo promedio y cumplimiento.","Selecciona un equipo para revisar su detalle.","Usa Analytics para investigar un cuello de botella."], role:"Líderes de área" },
  { title:"Analytics", icon:"chart" as IconName, purpose:"Analizar rendimiento histórico, tendencias y cuellos de botella.", steps:["Define periodo y filtros operativos.","Compara promedio, mediana y P95.","Identifica equipos o turnos fuera del SLA."], role:"Dirección y analítica" },
  { title:"Auditoría", icon:"history" as IconName, purpose:"Mantener trazabilidad verificable de las acciones del sistema.", steps:["Filtra por fecha, usuario, acción o entidad.","Consulta quién realizó cada cambio y cuándo.","Usa el identificador de entidad para rastrear un proceso."], role:"Auditoría y cumplimiento" },
  { title:"Configuración", icon:"settings" as IconName, purpose:"Personalizar parámetros generales de la organización.", steps:["Administra datos de la clínica y preferencias.","Define reglas de notificación y escalamiento.","Guarda cambios para aplicarlos a toda la organización."], role:"Administradores" },
];
 
function Documentation() {
  const { navigate } = useApp();
  const [selected, setSelected] = useState(0);
  const item = documentation[selected];
  return <><PageHeader title="Documentación" subtitle="Guía funcional para comprender y operar Giro de Camas." actions={<Button icon="play" onClick={()=>navigate("Dashboard")}>Iniciar recorrido</Button>}/>
    <div className="docs-hero"><div><span>GUÍA DEL PRODUCTO</span><h2>Todo el proceso, desde el alta hasta una cama disponible.</h2><p>Giro de Camas coordina personas, tareas y SLA para reducir tiempos de espera y ofrecer visibilidad operativa en tiempo real.</p></div><div className="docs-flow"><span>Alta médica</span><Icon name="arrow"/><span>Coordinación</span><Icon name="arrow"/><span>Cama disponible</span></div></div>
    <div className="docs-layout"><aside className="docs-nav"><div className="docs-search"><Icon name="search" size={15}/><span>Contenido de la guía</span></div>{documentation.map((d,i)=><button key={d.title} className={selected===i?"active":""} onClick={()=>setSelected(i)}><Icon name={d.icon}/><span>{d.title}</span><Icon name="chevron" size={13}/></button>)}</aside>
    <section className="panel docs-content"><div className="docs-title"><div><Icon name={item.icon} size={23}/></div><span>MÓDULO {selected+1} DE {documentation.length}</span><h2>{item.title}</h2><p>{item.purpose}</p></div>
      <div className="docs-role"><Icon name="users"/><div><span>USUARIO PRINCIPAL</span><strong>{item.role}</strong></div></div>
      <h3>Cómo interactuar con este módulo</h3><div className="docs-steps">{item.steps.map((step,i)=><div key={step}><span>{i+1}</span><p>{step}</p></div>)}</div>
      <div className="docs-tip"><Icon name="spark"/><div><strong>Recomendación</strong><p>Empieza por la información crítica marcada en rojo o ámbar y continúa con los procesos que estén más cerca de vencer su SLA.</p></div></div>
      <div className="docs-footer"><Button variant="ghost" onClick={()=>setSelected(Math.max(0,selected-1))}>Anterior</Button><Button variant="primary" icon="arrow" onClick={()=>selected<documentation.length-1?setSelected(selected+1):navigate("Dashboard")}>{selected<documentation.length-1?"Siguiente módulo":"Ir al Dashboard"}</Button></div>
    </section></div>
  </>;
}
 
/* ───────────── Módulo Interventores ─────────────
   Modelo local basado en el ER:
   Intervenor(id, name, code, description?, is_active, created_at, update_at)
   IntervenorMembership(id, user_id, intervenor_id, is_active, created_at, is_leader)
   Índice único (user_id, intervenor_id) → un usuario no puede repetirse en un equipo.
*/
type Intervener = { id: number; name: string; code: string; description: string; isActive: boolean; createdAt: string; updatedAt: string };
type Membership = { id: number; userId: number; intervenorId: number; isActive: boolean; isLeader: boolean; createdAt: string };
type DirectoryUser = { id: number; name: string; email: string; role: string; shift: string };
type TeamMetrics = { pending: number; average: string; sla: number | null };
type TeamForm = { name: string; code: string; description: string; isActive: boolean };
 
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const fmtDate = (iso: string) => { const d = new Date(iso); return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const initials = (name: string) => name.split(" ").filter(Boolean).map(x => x[0]).join("").slice(0,2).toUpperCase();
const slaTone = (sla: number | null): Tone => sla === null ? "neutral" : sla >= 92 ? "success" : sla >= 85 ? "info" : sla >= 75 ? "warning" : "danger";
const stripAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const suggestCode = (name: string) => stripAccents(name).toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean).slice(0,2).map(w => w.slice(0,3)).join("-");
 
const DIRECTORY: DirectoryUser[] = ([
  [1,"María López","Coordinador","Mañana"],[2,"Laura Mejía","Auxiliar","Tarde"],[3,"Andrés Restrepo","Auxiliar","Noche"],
  [4,"Carolina Vélez","Coordinador","Mañana"],[5,"Juliana Ospina","Auxiliar","Mañana"],[6,"Sebastián Cano","Operador","Tarde"],
  [7,"Valentina Ríos","Auxiliar","Noche"],[8,"Camilo Zapata","Operador","Mañana"],[9,"Daniela Cárdenas","Auxiliar","Tarde"],
  [10,"Mateo Arango","Operador","Noche"],[11,"Paula Herrera","Auxiliar","Mañana"],[12,"Santiago Giraldo","Operador","Tarde"],
  [13,"Natalia Duque","Auxiliar","Noche"],[14,"Felipe Mora","Coordinador","Mañana"],[15,"Ana Velásquez","Coordinador","Mañana"],
  [16,"Luis Builes","Operador","Tarde"],[17,"Marcela Soto","Auxiliar","Mañana"],[18,"Jhon Quintero","Operador","Noche"],
  [19,"Yesenia Agudelo","Auxiliar","Tarde"],[20,"Ricardo Pineda","Analista","Mañana"],[21,"Esteban Rojas","Operador","Mañana"],
  [22,"Kevin Torres","Operador","Tarde"],[23,"Stiven Marín","Operador","Noche"],[24,"Carlos Páez","Coordinador","Mañana"],
  [25,"Isabela Muñoz","Analista","Mañana"],[26,"Tomás Echeverri","Auxiliar","Tarde"],
] as [number,string,string,string][]).map(([id,name,role,shift]) => {
  const parts = stripAccents(name).toLowerCase().split(" ");
  return { id, name, role, shift, email: `${parts[0]}.${parts[1]}@clinica.co` };
});
const userById = (id: number) => DIRECTORY.find(u => u.id === id);
 
const SEED_TEAMS: Intervener[] = [
  { id:1, name:"Enfermería", code:"ENF", description:"Retiro de dispositivos, curaciones y entrega de pertenencias al alta.", isActive:true, createdAt:"2025-03-12T09:00:00", updatedAt:"2026-09-02T10:30:00" },
  { id:2, name:"Facturación", code:"FACT", description:"Cierre de cuenta, validación de copago y autorizaciones de salida.", isActive:true, createdAt:"2025-03-12T09:05:00", updatedAt:"2026-08-14T15:10:00" },
  { id:3, name:"Camilleros", code:"CAM", description:"Traslado de pacientes entre habitación y salida.", isActive:true, createdAt:"2025-03-12T09:10:00", updatedAt:"2026-07-21T08:45:00" },
  { id:4, name:"Servicios Generales", code:"SER-GEN", description:"Desinfección terminal y preparación de la habitación.", isActive:true, createdAt:"2025-03-12T09:15:00", updatedAt:"2026-09-28T11:00:00" },
  { id:5, name:"Coordinación Clínica", code:"COORD", description:"Supervisión médica del egreso y resolución de bloqueos.", isActive:true, createdAt:"2025-05-04T14:00:00", updatedAt:"2026-06-10T09:20:00" },
  { id:6, name:"Admisiones", code:"ADM", description:"Asignación de cama y registro del siguiente ingreso.", isActive:true, createdAt:"2025-06-18T10:00:00", updatedAt:"2026-05-30T16:40:00" },
  { id:7, name:"Laboratorio", code:"LAB", description:"Toma de muestras previas al alta cuando aplica.", isActive:false, createdAt:"2025-08-01T08:00:00", updatedAt:"2026-02-12T13:00:00" },
  { id:8, name:"Farmacia", code:"FARM", description:"Entrega de medicamentos de egreso y conciliación.", isActive:true, createdAt:"2025-09-09T11:30:00", updatedAt:"2026-10-01T09:00:00" },
  { id:9, name:"Trabajo Social", code:"TS", description:"", isActive:false, createdAt:"2026-01-20T10:15:00", updatedAt:"2026-01-20T10:15:00" },
];
const SEED_METRICS: Record<number, TeamMetrics> = {
  1:{pending:7,average:"22 min",sla:77}, 2:{pending:2,average:"18 min",sla:89}, 3:{pending:1,average:"9 min",sla:94},
  4:{pending:3,average:"34 min",sla:69}, 5:{pending:4,average:"15 min",sla:91}, 6:{pending:2,average:"12 min",sla:88},
  7:{pending:0,average:"—",sla:null}, 8:{pending:1,average:"20 min",sla:82}, 9:{pending:0,average:"—",sla:null},
};
const metricsFor = (id: number): TeamMetrics => SEED_METRICS[id] ?? { pending: 0, average: "—", sla: null };
 
function buildSeedMemberships(): Membership[] {
  // [equipo, usuarios, líder, usuarios inactivos]
  const plan: [number, number[], number | null, number[]][] = [
    [1, [1,2,3,4,5,6,7,8,9,10,11,12,13], 4, [5,11]],
    [2, [15,16,17,18,19,20], 15, [19]],
    [3, [14,21,22,23,3], 14, []],
    [4, [24,6,8,10,12,16,18,22,26], 24, [26]],
    [5, [1,4,15], 4, []],
    [6, [17,19,20], 17, []],
    [7, [5,25], 5, [25]],
    [8, [7,9,11], 7, []],
    [9, [], null, []],
  ];
  let id = 1;
  return plan.flatMap(([teamId, users, leader, off]) => users.map(userId => ({
    id: id++, userId, intervenorId: teamId, isActive: !off.includes(userId), isLeader: userId === leader, createdAt: "2025-04-02T08:00:00",
  })));
}
 
function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)}><i/></button>;
}
 
function Pagination({ total, page, pageSize, onPage, onSize, sizes, label }: { total: number; page: number; pageSize: number; onPage: (p: number) => void; onSize?: (s: number) => void; sizes?: number[]; label: string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(total, current * pageSize);
  const nums = Array.from(new Set([1, pages, current - 1, current, current + 1])).filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  nums.forEach((n, i) => { if (i > 0 && n - nums[i - 1] > 1) items.push("gap"); items.push(n); });
  return <div className="pager">
    <span className="pager-info">Mostrando <strong>{from}–{to}</strong> de <strong>{total}</strong> {label}</span>
    <div className="pager-right">
      {sizes && onSize && <label className="pager-size">Filas<select value={pageSize} onChange={e => onSize(Number(e.target.value))}>{sizes.map(s => <option key={s} value={s}>{s}</option>)}</select></label>}
      <div className="pager-nav" role="navigation" aria-label="Paginación">
        <button type="button" className="pager-btn" disabled={current <= 1} onClick={() => onPage(current - 1)} aria-label="Página anterior"><span className="flip"><Icon name="chevron" size={14}/></span></button>
        {items.map((n, i) => n === "gap" ? <span className="pager-gap" key={`g${i}`}>…</span> : <button type="button" key={n} className={`pager-btn pager-num ${n === current ? "active" : ""}`} onClick={() => onPage(n)} aria-current={n === current ? "page" : undefined}>{n}</button>)}
        <span className="pager-mobile">{current} / {pages}</span>
        <button type="button" className="pager-btn" disabled={current >= pages} onClick={() => onPage(current + 1)} aria-label="Página siguiente"><Icon name="chevron" size={14}/></button>
      </div>
    </div>
  </div>;
}
 
function ConfirmDialog({ title, text, confirmLabel, onCancel, onConfirm }: { title: string; text: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="ivr-confirm-back" onClick={onCancel}><div className="ivr-confirm" role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()}>
    <span className="ivr-confirm-icon"><Icon name="alert"/></span><h2>{title}</h2><p>{text}</p>
    <div><Button onClick={onCancel}>Cancelar</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></div>
  </div></div>;
}
 
function TeamDrawer({ team, teams, onClose, onSave, onDelete }: { team: Intervener | null; teams: Intervener[]; onClose: () => void; onSave: (d: TeamForm) => void; onDelete?: () => void }) {
  const editing = team !== null;
  const [name, setName] = useState(team?.name ?? "");
  const [code, setCode] = useState(team?.code ?? "");
  const [codeTouched, setCodeTouched] = useState(editing);
  const [description, setDescription] = useState(team?.description ?? "");
  const [isActive, setIsActive] = useState(team?.isActive ?? true);
  const [submitted, setSubmitted] = useState(false);
  const cleanName = name.trim();
  const cleanCode = code.trim().toUpperCase();
  const errors: { name?: string; code?: string; description?: string } = {};
  if (!cleanName) errors.name = "El nombre es obligatorio.";
  else if (cleanName.length > 100) errors.name = "Máximo 100 caracteres.";
  if (!cleanCode) errors.code = "El código es obligatorio.";
  else if (!/^[A-Z0-9_-]{2,20}$/.test(cleanCode)) errors.code = "Usa de 2 a 20 caracteres: letras, números, guion o guion bajo.";
  else if (teams.some(t => t.id !== team?.id && t.code.toUpperCase() === cleanCode)) errors.code = "Ya existe un interventor con este código.";
  if (description.length > 500) errors.description = "Máximo 500 caracteres.";
  const showCode = submitted || (codeTouched && code !== "");
  const submit = (e: FormEvent) => { e.preventDefault(); setSubmitted(true); if (Object.keys(errors).length) return; onSave({ name: cleanName, code: cleanCode, description: description.trim(), isActive }); };
  return <><div className="drawer-backdrop" onClick={onClose}/><aside className="drawer ivr-drawer" role="dialog" aria-modal="true">
    <div className="drawer-head"><div><span>{editing ? "EDITAR EQUIPO" : "NUEVA DEFINICIÓN"}</span><h2>{editing ? team.name : "Nuevo interventor"}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button></div>
    <form className="ivr-form" onSubmit={submit} noValidate>
      <div className="ivr-form-body">
        <p className="ivr-form-lead">{editing ? "Actualiza la identidad del equipo. Los usuarios asociados no se modifican." : "Un interventor es el equipo responsable de una etapa del proceso. Después podrás asociarle usuarios."}</p>
        <label className={`ivr-field ${submitted && errors.name ? "has-error" : ""}`}>Nombre del interventor *<input value={name} maxLength={110} placeholder="Ej. Enfermería" autoFocus onChange={e => { setName(e.target.value); if (!codeTouched) setCode(suggestCode(e.target.value)); }}/>{submitted && errors.name && <em>{errors.name}</em>}</label>
        <label className={`ivr-field ${showCode && errors.code ? "has-error" : ""}`}>Código único *<input value={code} maxLength={20} placeholder="Ej. ENF" onChange={e => { setCodeTouched(true); setCode(e.target.value.toUpperCase()); }}/>{showCode && errors.code ? <em>{errors.code}</em> : <small>Identificador corto y único. Se guarda en mayúsculas.</small>}</label>
        <label className={`ivr-field ${errors.description ? "has-error" : ""}`}>Descripción<textarea rows={4} value={description} placeholder="Responsabilidad del equipo dentro del proceso (opcional)" onChange={e => setDescription(e.target.value)}/><span className="ivr-counter"><small>{errors.description ?? "Opcional"}</small><small>{description.length}/500</small></span></label>
        <div className="setting-switch ivr-switch"><div><strong>Interventor activo</strong><span>Los equipos inactivos no reciben tareas nuevas.</span></div><Switch on={isActive} onChange={setIsActive} label="Interventor activo"/></div>
        {editing && <div className="ivr-meta"><div><span>Creado</span><strong>{fmtDate(team.createdAt)}</strong></div><div><span>Última actualización</span><strong>{fmtDate(team.updatedAt)}</strong></div></div>}
        {editing && onDelete && <div className="ivr-danger"><div><strong>Eliminar interventor</strong><span>Se eliminarán también todas sus asociaciones de usuarios.</span></div><button type="button" className="btn btn-secondary ivr-btn-danger" onClick={onDelete}>Eliminar</button></div>}
      </div>
      <div className="drawer-actions"><Button onClick={onClose}>Cancelar</Button><button type="submit" className="btn btn-primary"><Icon name={editing ? "check" : "plus"} size={16}/><span>{editing ? "Guardar cambios" : "Crear interventor"}</span></button></div>
    </form>
  </aside></>;
}
 
function MemberDrawer({ team, candidates, currentLeader, onClose, onAdd }: { team: Intervener; candidates: DirectoryUser[]; currentLeader: string | null; onClose: () => void; onAdd: (userId: number, isLeader: boolean, isActive: boolean) => void }) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const term = stripAccents(q).toLowerCase();
  const list = candidates.filter(u => !term || stripAccents(`${u.name} ${u.email} ${u.role}`).toLowerCase().includes(term));
  const submit = (e: FormEvent) => { e.preventDefault(); setSubmitted(true); if (picked === null) return; onAdd(picked, isLeader && isActive, isActive); };
  return <><div className="drawer-backdrop" onClick={onClose}/><aside className="drawer ivr-drawer" role="dialog" aria-modal="true">
    <div className="drawer-head"><div><span>ASOCIAR USUARIO · {team.code}</span><h2>{team.name}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button></div>
    <form className="ivr-form" onSubmit={submit} noValidate>
      <div className="ivr-form-body">
        <p className="ivr-form-lead">Selecciona el usuario que formará parte de este interventor. Solo se muestran usuarios que aún no pertenecen al equipo.</p>
        <div className="ivr-field"><span className="ivr-label">Usuario *</span>
          <div className="search small-search ivr-search"><Icon name="search"/><input placeholder="Buscar por nombre, correo o rol..." value={q} onChange={e => setQ(e.target.value)}/></div>
          <div className={`ivr-picker ${submitted && picked === null ? "has-error" : ""}`} role="radiogroup">
            {candidates.length === 0 && <div className="ivr-picker-empty"><Icon name="check"/><span>Todos los usuarios ya pertenecen a este equipo.</span></div>}
            {candidates.length > 0 && list.length === 0 && <div className="ivr-picker-empty"><Icon name="search"/><span>Ningún usuario coincide con “{q}”.</span></div>}
            {list.map(u => <button type="button" role="radio" aria-checked={picked === u.id} key={u.id} className={picked === u.id ? "selected" : ""} onClick={() => setPicked(u.id)}>
              <span className="table-avatar">{initials(u.name)}</span><div><strong>{u.name}</strong><small>{u.email} · {u.role} · {u.shift}</small></div><i className="ivr-radio">{picked === u.id && <Icon name="check" size={12}/>}</i>
            </button>)}
          </div>
          {submitted && picked === null && <em className="ivr-error">Selecciona un usuario para continuar.</em>}
        </div>
        <div className="setting-switch ivr-switch"><div><strong>Asociación activa</strong><span>Si está inactiva, el usuario no recibe tareas de este equipo.</span></div><Switch on={isActive} onChange={v => { setIsActive(v); if (!v) setIsLeader(false); }} label="Asociación activa"/></div>
        <div className="setting-switch ivr-switch"><div><strong>Es líder del equipo</strong><span>{isLeader && currentLeader ? `Reemplazará a ${currentLeader} como líder.` : "Un equipo tiene un solo líder."}</span></div><Switch on={isLeader && isActive} onChange={v => setIsLeader(v)} label="Es líder del equipo"/></div>
        {!isActive && <p className="ivr-hint">Un usuario inactivo no puede ser líder.</p>}
      </div>
      <div className="drawer-actions"><Button onClick={onClose}>Cancelar</Button><button type="submit" className="btn btn-primary"><Icon name="plus" size={16}/><span>Asociar usuario</span></button></div>
    </form>
  </aside></>;
}
 
function Interveners() {
  const { navigate, notify } = useApp();
  const [teams, setTeams] = useState<Intervener[]>(SEED_TEAMS);
  const [memberships, setMemberships] = useState<Membership[]>(buildSeedMemberships);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all"|"active"|"inactive">("all");
  const [view, setView] = useState<"cards"|"list">(() => typeof window !== "undefined" && window.innerWidth < 640 ? "list" : "cards");
  const [teamPage, setTeamPage] = useState(1);
  const [mq, setMq] = useState("");
  const [mStatus, setMStatus] = useState<"all"|"active"|"inactive"|"leader">("all");
  const [mPage, setMPage] = useState(1);
  const [mSize, setMSize] = useState(5);
  const [drawer, setDrawer] = useState<null | { kind: "team"; editing: boolean } | { kind: "member" }>(null);
  const [confirm, setConfirm] = useState<null | { kind: "remove"; id: number } | { kind: "delete"; id: number }>(null);
  const [menu, setMenu] = useState<null | { id: number; top: number; right: number }>(null);
  const nextId = useRef(5000);
  const detailRef = useRef<HTMLElement | null>(null);
 
  const teamPageSize = view === "cards" ? 8 : 10;
  const team = teams.find(t => t.id === selectedId) ?? null;
  const teamMembers = (id: number) => memberships.filter(m => m.intervenorId === id);
  const leaderOf = (id: number) => { const m = teamMembers(id).find(x => x.isLeader); return m ? userById(m.userId)?.name ?? null : null; };
  const activeCount = (id: number) => teamMembers(id).filter(m => m.isActive).length;
 
  const term = stripAccents(q).toLowerCase();
  const filteredTeams = teams.filter(t => (statusFilter === "all" || (statusFilter === "active") === t.isActive) && (!term || stripAccents(`${t.name} ${t.code} ${leaderOf(t.id) ?? ""}`).toLowerCase().includes(term)));
  const teamPages = Math.max(1, Math.ceil(filteredTeams.length / teamPageSize));
  const safeTeamPage = Math.min(teamPage, teamPages);
  const pagedTeams = filteredTeams.slice((safeTeamPage - 1) * teamPageSize, safeTeamPage * teamPageSize);
 
  const mTerm = stripAccents(mq).toLowerCase();
  const rows = (team ? teamMembers(team.id) : []).flatMap(m => { const u = userById(m.userId); return u ? [{ m, u }] : []; })
    .filter(({ m, u }) => (mStatus === "all" || (mStatus === "active" && m.isActive) || (mStatus === "inactive" && !m.isActive) || (mStatus === "leader" && m.isLeader)) && (!mTerm || stripAccents(`${u.name} ${u.email} ${u.role} ${u.shift}`).toLowerCase().includes(mTerm)))
    .sort((a, b) => Number(b.m.isLeader) - Number(a.m.isLeader) || a.u.name.localeCompare(b.u.name));
  const mPages = Math.max(1, Math.ceil(rows.length / mSize));
  const safeMPage = Math.min(mPage, mPages);
  const pagedRows = rows.slice((safeMPage - 1) * mSize, safeMPage * mSize);
 
  const totalActiveUsers = memberships.filter(m => m.isActive).length;
  const withoutLeader = teams.filter(t => t.isActive && !teamMembers(t.id).some(m => m.isLeader)).length;
  const activeTeams = teams.filter(t => t.isActive).length;
 
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key !== "Escape") return; if (confirm) setConfirm(null); else if (menu) setMenu(null); else if (drawer) setDrawer(null); };
    const closeMenu = () => setMenu(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", closeMenu, true); window.removeEventListener("resize", closeMenu); };
  }, [confirm, menu, drawer]);
 
  const pickTeam = (id: number) => {
    setSelectedId(id); setMq(""); setMStatus("all"); setMPage(1); setMenu(null);
    if (typeof window !== "undefined" && window.innerWidth < 1000) window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
 
  const saveTeam = (data: TeamForm) => {
    const now = new Date().toISOString();
    if (drawer?.kind === "team" && drawer.editing && team) {
      setTeams(c => c.map(t => t.id === team.id ? { ...t, ...data, updatedAt: now } : t));
      notify(`Equipo ${data.name} actualizado`, "success");
    } else {
      const id = nextId.current++;
      setTeams(c => [...c, { id, ...data, createdAt: now, updatedAt: now }]);
      setQ(""); setStatusFilter("all"); setTeamPage(Math.ceil((teams.length + 1) / teamPageSize));
      pickTeam(id);
      notify(`Interventor ${data.name} creado`, "success");
    }
    setDrawer(null);
  };

  const deleteTeam = (id: number) => {
    const remaining = teams.filter(t => t.id !== id);
    setTeams(remaining); setMemberships(c => c.filter(m => m.intervenorId !== id));
    setSelectedId(remaining[0]?.id ?? null); setConfirm(null); setDrawer(null);
    notify("Interventor y sus asociaciones eliminados", "success");
  };

  const addMember = (userId: number, isLeader: boolean, isActive: boolean) => {
    if (!team) return;
    if (memberships.some(m => m.userId === userId && m.intervenorId === team.id)) { notify("El usuario ya pertenece a este equipo", "warning"); return; }
    const id = nextId.current++;
    setMemberships(c => [...c.map(m => isLeader && m.intervenorId === team.id ? { ...m, isLeader: false } : m), { id, userId, intervenorId: team.id, isActive, isLeader, createdAt: new Date().toISOString() }]);
    setMq(""); setMStatus("all"); setMPage(1); setDrawer(null);
    notify(`${userById(userId)?.name ?? "Usuario"} asociado a ${team.name}`, "success");
  };

  const toggleActive = (id: number) => {
    const m = memberships.find(x => x.id === id); if (!m) return;
    setMemberships(c => c.map(x => x.id === id ? { ...x, isActive: !x.isActive, isLeader: x.isActive ? false : x.isLeader } : x));
    notify(m.isActive ? "Usuario marcado como no disponible" : "Usuario marcado como disponible", m.isActive ? "warning" : "success");
  };

  const toggleLeader = (id: number) => {
    const m = memberships.find(x => x.id === id); if (!m) return;
    if (!m.isLeader && !m.isActive) { notify("Activa la asociación antes de nombrar líder", "warning"); return; }
    setMemberships(c => c.map(x => x.intervenorId !== m.intervenorId ? x : x.id === id ? { ...x, isLeader: !m.isLeader } : m.isLeader ? x : { ...x, isLeader: false }));
    notify(m.isLeader ? "Liderazgo retirado" : `${userById(m.userId)?.name} es ahora líder del equipo`, "success");
  };
  const removeMember = (id: number) => {
    const m = memberships.find(x => x.id === id);
    setMemberships(c => c.filter(x => x.id !== id)); setConfirm(null);
    notify(`${m ? userById(m.userId)?.name : "Usuario"} fue retirado del equipo`, "success");
  };
  const openMenu = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (menu?.id === id) { setMenu(null); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ id, right: Math.max(8, window.innerWidth - r.right), top: r.bottom + 6 + 150 > window.innerHeight ? Math.max(8, r.top - 6 - 150) : r.bottom + 6 });
  };
 
  const menuRow = menu ? memberships.find(m => m.id === menu.id) : undefined;
  const confirmMember = confirm?.kind === "remove" ? memberships.find(m => m.id === confirm.id) : undefined;
  const clearTeamFilters = () => { setQ(""); setStatusFilter("all"); setTeamPage(1); };
  const candidates = team ? DIRECTORY.filter(u => !memberships.some(m => m.intervenorId === team.id && m.userId === u.id)) : [];
  const counts = { all: teams.length, active: activeTeams, inactive: teams.length - activeTeams };
 
  return <>
    <PageHeader 
      title="Interventores" 
      subtitle="Gestiona equipos, usuarios, disponibilidad y desempeño operativo." 
      actions={<>
        <Button icon="chart" onClick={() => navigate("Analytics")}>
          Ver Analytics
        </Button>
        
        <Button 
          variant="primary" 
          icon="plus" 
          onClick={() => setDrawer({ kind: "team", editing: false })}
        >
          Nuevo interventor
        </Button>
      </>}
    />


    <div className="service-summary ivr-kpis">
      {([ 
        ["Equipos", teams.length, "users"], 
        ["Equipos activos", activeTeams, "check"], 
        ["Usuarios activos", totalActiveUsers, "bed"], 
        ["Sin líder", withoutLeader, "alert"]  
      ] as [string, number, IconName][]).map(x => 
          <div key={x[0]}>
            <span> <Icon name={x[2]}/> </span>

            <div>
              <strong>{x[1]}</strong>
              <small>{x[0]}</small>
            </div>
          </div>
      )}
    </div>
 
    <div className="ivr-toolbar">
      <div className="search small-search ivr-search">
        <Icon name="search" size={16}/>
        <input placeholder="Buscar equipo, código o líder..." value={q} onChange={e => { setQ(e.target.value); setTeamPage(1); }}/>
      </div>
      <div className="ivr-seg" role="tablist" aria-label="Estado">
        {([["all","Todos"],["active","Activos"],["inactive","Inactivos"]] as const).map(([k, l]) => 
          <button 
            type="button" 
            role="tab" 
            aria-selected={statusFilter === k} 
            key={k} 
            className={statusFilter === k ? "active" : ""} 
            onClick={() => { setStatusFilter(k); setTeamPage(1); }}
          >
            {l}<b>{counts[k]}</b>
          </button>
        )}
      </div>
      <div className="ivr-view" aria-label="Vista">
        <button 
          type="button" 
          className={view === "cards" ? "active" : ""} 
          onClick={() => { setView("cards"); setTeamPage(1); }} 
          title="Vista de tarjetas" 
          aria-label="Vista de tarjetas"
        >
          <Icon name="grid" size={16} />
          <span>Tarjetas</span>
        </button>
        
        <button 
          type="button" 
          className={view === "list" ? "active" : ""} 
          onClick={() => { setView("list"); setTeamPage(1); }} 
          title="Vista compacta" 
          aria-label="Vista compacta"
        >
          <Icon name="menu" size={16}/>
          <span>Lista</span>
        </button>
      </div>
    </div>
 
    {filteredTeams.length === 0 ? <div className="ivr-empty panel"><span><Icon name="search" size={22}/></span><h3>No hay interventores que coincidan</h3><p>Prueba con otro término o limpia los filtros aplicados.</p><Button onClick={clearTeamFilters}>Limpiar filtros</Button></div> : <>
      {view === "cards" ? <div className="intervener-grid">{pagedTeams.map(t => {
        const mt = metricsFor(t.id); const tone: Tone = t.isActive ? slaTone(mt.sla) : "neutral"; const lead = leaderOf(t.id);
        return <button type="button" key={t.id} className={`${selectedId === t.id ? "selected" : ""} ${t.isActive ? "" : "is-off"}`} onClick={() => pickTeam(t.id)}>
          <div className={`team-icon ta-${tone}`}><Icon name="users"/></div>
          <div className="team-head"><h3>{t.name}</h3>{t.isActive ? <Badge tone={tone}>{mt.sla === null ? "Sin datos" : `${mt.sla}% SLA`}</Badge> : <Badge tone="neutral">Inactivo</Badge>}</div>
          <span><code className="ivr-code">{t.code}</code> {activeCount(t.id)} usuarios · Líder: {lead ?? "Sin asignar"}</span>
          <div className="team-stats"><div><strong>{mt.pending}</strong><span>Pendientes</span></div><div><strong>{mt.average}</strong><span>Promedio</span></div><div><strong>{mt.sla === null ? "—" : `${mt.sla}%`}</strong><span>Cumplimiento</span></div></div>
          <div className="progress"><i className={`fill-${tone}`} style={{ width: `${mt.sla ?? 0}%` }}/></div>
          <small>{selectedId === t.id ? "Equipo seleccionado" : "Seleccionar equipo"}</small>
        </button>;
      })}</div> : <div className="panel ivr-list-panel"><div className="ivr-list" role="list">
        <div className="ivr-row ivr-row-head"><span/><span>EQUIPO</span><span className="ivr-hide-sm">LÍDER</span><span className="ivr-hide-sm">USUARIOS</span><span className="ivr-hide-sm">PENDIENTES</span><span className="ivr-hide-sm">PROMEDIO</span><span className="ivr-hide-sm">CUMPLIMIENTO</span><span>ESTADO</span></div>
        {pagedTeams.map(t => { const mt = metricsFor(t.id); const tone: Tone = t.isActive ? slaTone(mt.sla) : "neutral"; const lead = leaderOf(t.id);
          return <button type="button" role="listitem" key={t.id} className={`ivr-row ${selectedId === t.id ? "selected" : ""} ${t.isActive ? "" : "is-off"}`} onClick={() => pickTeam(t.id)}>
            <div className={`team-icon ta-${tone}`}><Icon name="users" size={16}/></div>
            <div className="ivr-row-name"><strong>{t.name}</strong><small><code className="ivr-code">{t.code}</code></small><span className="ivr-row-sub">{activeCount(t.id)} usuarios · {lead ?? "Sin líder"}{mt.sla !== null ? ` · ${mt.sla}% SLA` : ""}</span></div>
            <span className="ivr-hide-sm ivr-cell">{lead ?? <em>Sin asignar</em>}</span>
            <span className="ivr-hide-sm ivr-cell">{activeCount(t.id)}</span>
            <span className="ivr-hide-sm ivr-cell">{mt.pending}</span>
            <span className="ivr-hide-sm ivr-cell">{mt.average}</span>
            <span className="ivr-hide-sm ivr-cell ivr-sla"><b>{mt.sla === null ? "—" : `${mt.sla}%`}</b><div className="progress"><i className={`fill-${tone}`} style={{ width: `${mt.sla ?? 0}%` }}/></div></span>
            <span className="ivr-cell">{t.isActive ? <Badge tone="success">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}</span>
          </button>; })}
      </div></div>}
      <Pagination total={filteredTeams.length} page={safeTeamPage} pageSize={teamPageSize} onPage={setTeamPage} label="interventores"/>
    </>}
 
    {team ? <section className="panel team-detail" ref={detailRef}>
      <div className="team-detail-head"><div><div className={`team-icon ta-${team.isActive ? slaTone(metricsFor(team.id).sla) : "neutral"}`}><Icon name="users"/></div><div><span>DETALLE DEL INTERVENTOR · {team.code}</span><h2>{team.name} <Badge tone={team.isActive ? "success" : "neutral"}>{team.isActive ? "Activo" : "Inactivo"}</Badge></h2><p>{team.description || "Sin descripción."} · Líder: {leaderOf(team.id) ?? "Sin asignar"}</p></div></div>
        <div className="ivr-head-actions"><Button icon="settings" onClick={() => setDrawer({ kind: "team", editing: true })}>Editar equipo</Button><Button variant="primary" icon="plus" onClick={() => setDrawer({ kind: "member" })}>Asociar usuario</Button></div></div>
      <div className="team-detail-kpis"><div><span>Usuarios activos</span><strong>{activeCount(team.id)}</strong><small>{teamMembers(team.id).length} asociados en total</small></div><div><span>Tareas pendientes</span><strong>{metricsFor(team.id).pending}</strong><small>{metricsFor(team.id).pending > 0 ? "Requieren atención" : "Al día"}</small></div><div><span>Tiempo promedio</span><strong>{metricsFor(team.id).average}</strong><small>Objetivo: 20 min</small></div><div><span>Creado</span><strong className="ivr-date">{fmtDate(team.createdAt)}</strong><small>Actualizado {fmtDate(team.updatedAt)}</small></div></div>
      <div className="detail-section-head ivr-members-head"><div><h3>Usuarios asociados</h3><span>Disponibilidad del turno actual</span></div>
        <div className="ivr-members-tools"><div className="search small-search"><Icon name="search"/><input placeholder="Buscar usuario..." value={mq} onChange={e => { setMq(e.target.value); setMPage(1); }}/></div>
          <select className="ivr-select" value={mStatus} onChange={e => { setMStatus(e.target.value as typeof mStatus); setMPage(1); }} aria-label="Filtrar usuarios"><option value="all">Todos</option><option value="active">Disponibles</option><option value="inactive">No disponibles</option><option value="leader">Líder</option></select></div></div>
      <div className="ivr-members">
        {rows.length === 0 ? <div className="ivr-empty ivr-empty-flat"><span><Icon name="users" size={22}/></span><h3>{teamMembers(team.id).length === 0 ? "Este interventor aún no tiene usuarios" : "Ningún usuario coincide con el filtro"}</h3><p>{teamMembers(team.id).length === 0 ? "Asocia usuarios para que puedan recibir y completar tareas de este equipo." : "Ajusta la búsqueda o el estado seleccionado."}</p>{teamMembers(team.id).length === 0 ? <Button variant="primary" icon="plus" onClick={() => setDrawer({ kind: "member" })}>Asociar usuario</Button> : <Button onClick={() => { setMq(""); setMStatus("all"); }}>Limpiar filtros</Button>}</div> :
        <div className="table-wrap"><table className="member-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Turno</th><th>Líder</th><th>Asociado desde</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>
          {pagedRows.map(({ m, u }) => <tr key={m.id}>
            <td data-label="Usuario"><span className="table-avatar">{initials(u.name)}</span><div className="ivr-user"><strong>{u.name}</strong><small>{u.email}</small></div></td>
            <td data-label="Rol">{u.role}</td><td data-label="Turno">{u.shift}</td>
            <td data-label="Líder">{m.isLeader ? <Badge tone="info">Líder</Badge> : <span className="ivr-dash">—</span>}</td>
            <td data-label="Asociado desde">{fmtDate(m.createdAt)}</td>
            <td data-label="Disponibilidad"><button type="button" className={`availability ${m.isActive ? "online" : "offline"}`} onClick={() => toggleActive(m.id)} title="Cambiar disponibilidad"><i/>{m.isActive ? "Disponible" : "No disponible"}</button></td>
            <td data-label="Acciones" className="cell-actions"><button type="button" className="icon-button" aria-label={`Opciones de ${u.name}`} aria-haspopup="menu" onClick={e => openMenu(e, m.id)}><Icon name="more"/></button></td>
          </tr>)}
        </tbody></table></div>}
        {rows.length > 0 && <Pagination total={rows.length} page={safeMPage} pageSize={mSize} onPage={setMPage} onSize={s => { setMSize(s); setMPage(1); }} sizes={[5, 10, 20]} label="usuarios"/>}
      </div>
    </section> : <div className="ivr-empty panel"><span><Icon name="users" size={22}/></span><h3>No hay interventores</h3><p>Crea el primero para empezar a asociar usuarios.</p><Button variant="primary" icon="plus" onClick={() => setDrawer({ kind: "team", editing: false })}>Nuevo interventor</Button></div>}
 
    {menu && menuRow && team && <><div className="ivr-menu-back" onClick={() => setMenu(null)}/><div className="ivr-menu" role="menu" style={{ top: menu.top, right: menu.right }}>
      <button type="button" role="menuitem" onClick={() => { setMenu(null); toggleLeader(menuRow.id); }}><Icon name="spark" size={15}/>{menuRow.isLeader ? "Quitar liderazgo" : "Nombrar líder"}</button>
      <button type="button" role="menuitem" onClick={() => { setMenu(null); toggleActive(menuRow.id); }}><Icon name={menuRow.isActive ? "pause" : "play"} size={15}/>{menuRow.isActive ? "Marcar no disponible" : "Marcar disponible"}</button>
      <button type="button" role="menuitem" onClick={() => { setMenu(null); notify(`${userById(menuRow.userId)?.name} · ${userById(menuRow.userId)?.email}`); }}><Icon name="eye" size={15}/>Ver contacto</button>
      <div className="ivr-menu-sep"/>
      <button type="button" role="menuitem" className="danger" onClick={() => { setMenu(null); setConfirm({ kind: "remove", id: menuRow.id }); }}><Icon name="logout" size={15}/>Quitar del equipo</button>
    </div></>}
 
    {drawer?.kind === "team" && <TeamDrawer key={drawer.editing ? `edit-${team?.id}` : "new"} team={drawer.editing ? team : null} teams={teams} onClose={() => setDrawer(null)} onSave={saveTeam} onDelete={drawer.editing && team ? () => setConfirm({ kind: "delete", id: team.id }) : undefined}/>}
    {drawer?.kind === "member" && team && <MemberDrawer team={team} candidates={candidates} currentLeader={leaderOf(team.id)} onClose={() => setDrawer(null)} onAdd={addMember}/>}
    {confirm?.kind === "remove" && <ConfirmDialog title="¿Quitar usuario del equipo?" text={`${confirmMember ? userById(confirmMember.userId)?.name : "El usuario"} dejará de pertenecer a ${team?.name ?? "este equipo"} y no recibirá sus tareas.`} confirmLabel="Quitar del equipo" onCancel={() => setConfirm(null)} onConfirm={() => removeMember(confirm.id)}/>}
    {confirm?.kind === "delete" && <ConfirmDialog title="¿Eliminar este interventor?" text={`Se eliminará ${teams.find(t => t.id === confirm.id)?.name ?? "el equipo"} y sus ${teamMembers(confirm.id).length} asociaciones de usuarios. Esta acción no se puede deshacer.`} confirmLabel="Eliminar interventor" onCancel={() => setConfirm(null)} onConfirm={() => deleteTeam(confirm.id)}/>}
  </>;
}
 
function SettingsPage() {
  const { notify } = useApp();
  const [section, setSection] = useState<"org"|"notifications"|"sla"|"users">("org");
  const [saved, setSaved] = useState(false);
  const [users, setUsers] = useState([["David Leudo","david@clinica.co","Administrador","Activo"],["Carolina Vélez","carolina@clinica.co","Coordinador","Activo"],["María López","maria@clinica.co","Operador","Activo"],["Ana Ríos","ana@clinica.co","Analista","Invitado"]]);
  const save=()=>{setSaved(true);notify("Configuración guardada correctamente","success");window.setTimeout(()=>setSaved(false),2500)};
  const toggle=(event:MouseEvent<HTMLButtonElement>)=>event.currentTarget.classList.toggle("on");
  return <><PageHeader title="Configuración" subtitle="Administra la organización, alertas, SLA, usuarios y permisos." actions={<Button variant="primary" icon="check" onClick={save}>Guardar cambios</Button>}/>{saved&&<div className="success-banner"><Icon name="check"/><span>Los cambios fueron guardados y ya están activos.</span></div>}<div className="settings-layout"><aside className="settings-nav"><button className={section==="org"?"active":""} onClick={()=>setSection("org")}><Icon name="building"/>Organización</button><button className={section==="notifications"?"active":""} onClick={()=>setSection("notifications")}><Icon name="bell"/>Notificaciones</button><button className={section==="sla"?"active":""} onClick={()=>setSection("sla")}><Icon name="clock"/>SLA y escalamiento</button><button className={section==="users"?"active":""} onClick={()=>setSection("users")}><Icon name="users"/>Usuarios y permisos</button></aside>
    <section className="panel settings-form">
      {section==="org"&&<><h2>Información de la organización</h2><p>Datos visibles para todos los usuarios de esta clínica.</p><div className="form-grid"><label>Nombre de la clínica<input defaultValue="Clínica Antioquia"/></label><label>Código de sede<input defaultValue="ANT-001"/></label><label>Zona horaria<select defaultValue="America/Bogota"><option value="America/Bogota">Bogotá (GMT-5)</option></select></label><label>Idioma<select defaultValue="es"><option value="es">Español</option><option value="en">English</option></select></label></div><div className="form-divider"/><h3>Operación de la sede</h3><div className="form-grid"><label>Inicio del turno diurno<input type="time" defaultValue="07:00"/></label><label>Fin del turno diurno<input type="time" defaultValue="19:00"/></label></div></>}
      {section==="notifications"&&<><h2>Notificaciones</h2><p>Define qué eventos generan alertas y por cuáles canales se entregan.</p><div className="settings-group"><h3>Eventos operativos</h3>{[["Nueva tarea asignada","Notificar inmediatamente al responsable.",true],["SLA próximo a vencer","Alertar cuando una tarea alcance el umbral definido.",true],["SLA vencido","Notificar al responsable y al coordinador.",true],["Cama disponible","Informar a la central de camas.",true],["Resumen diario","Enviar consolidado de indicadores a líderes.",false]].map(x=><div className="setting-switch" key={String(x[0])}><div><strong>{x[0]}</strong><span>{x[1]}</span></div><button className={`toggle ${x[2]?"on":""}`} onClick={toggle}><i/></button></div>)}</div><div className="form-divider"/><h3>Canales de entrega</h3><div className="channel-grid">{[["bell","Dentro de la aplicación",true],["logout","Correo electrónico",true],["bell","Notificación móvil",false]].map(x=><button className={x[2]?"active":""} key={String(x[1])} onClick={e=>e.currentTarget.classList.toggle("active")}><Icon name={x[0] as IconName}/><span>{x[1]}</span><i><b/></i></button>)}</div><div className="form-grid notification-fields"><label>Hora del resumen diario<input type="time" defaultValue="07:00"/></label><label>Destinatarios<select defaultValue="leaders"><option value="leaders">Líderes y administradores</option><option value="admins">Solo administradores</option></select></label></div></>}
      {section==="sla"&&<><h2>SLA y escalamiento</h2><p>Configura umbrales globales y la cadena de respuesta ante incumplimientos.</p><div className="sla-settings"><div><label>Umbral de advertencia<strong>80%</strong></label><input type="range" min="50" max="95" defaultValue="80"/></div><div><label>Periodo de gracia<strong>5 min</strong></label><input type="range" min="0" max="20" defaultValue="5"/></div></div><div className="form-divider"/><div className="setting-switch"><div><strong>Escalamiento automático</strong><span>Activa la cadena cuando una tarea supera su SLA.</span></div><button className="toggle on" onClick={toggle}><i/></button></div><h3 className="escalation-title">Cadena de escalamiento</h3><div className="escalation-list">{[["1","Al vencer el SLA","Responsable de la tarea","Inmediato"],["2","Primer escalamiento","Líder del interventor","+ 5 minutos"],["3","Segundo escalamiento","Coordinación operativa","+ 15 minutos"],["4","Escalamiento crítico","Administrador de sede","+ 30 minutos"]].map(x=><div key={x[0]}><span>{x[0]}</span><div><strong>{x[1]}</strong><small>{x[2]}</small></div><Badge tone={x[0]==="4"?"danger":"neutral"}>{x[3]}</Badge><button className="icon-button" onClick={()=>notify(`Editando nivel ${x[0]} de escalamiento`)}><Icon name="more"/></button></div>)}</div><Button icon="plus" onClick={()=>notify("Nivel de escalamiento agregado","success")}>Agregar nivel</Button></>}
      {section==="users"&&<><div className="settings-section-head"><div><h2>Usuarios y permisos</h2><p>Administra acceso, rol y estado de los usuarios.</p></div><Button variant="primary" icon="plus" onClick={()=>{setUsers(current=>[...current,[`Nuevo usuario ${current.length+1}`,`usuario${current.length+1}@clinica.co`,"Operador","Invitado"]]);notify("Invitación creada","success")}}>Invitar usuario</Button></div><div className="role-cards">{[["Administrador","4","Acceso completo"],["Coordinador","12","Gestión operativa"],["Operador","183","Tareas asignadas"],["Analista","8","Reportes y lectura"]].map(x=><button key={x[0]} onClick={()=>notify(`Permisos del rol ${x[0]} abiertos`)}><Icon name={x[0]==="Administrador"?"settings":"users"}/><div><strong>{x[0]}</strong><span>{x[2]}</span></div><b>{x[1]}</b></button>)}</div><div className="detail-section-head"><div><h3>Usuarios de la organización</h3><span>{users.length} usuarios mostrados</span></div><div className="search small-search"><Icon name="search"/><input placeholder="Buscar usuario..."/></div></div><div className="table-wrap"><table><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{users.map((u,i)=><tr key={u[1]}><td><span className="table-avatar">{u[0].split(" ").map(x=>x[0]).join("").slice(0,2)}</span><strong>{u[0]}</strong></td><td>{u[1]}</td><td><select defaultValue={u[2]} onChange={()=>notify(`Rol de ${u[0]} actualizado`,"success")}><option>Administrador</option><option>Coordinador</option><option>Operador</option><option>Analista</option></select></td><td><Badge tone={u[3]==="Activo"?"success":"warning"}>{u[3]}</Badge></td><td><button className="icon-button" onClick={()=>notify(`Opciones de ${u[0]}`)}><Icon name="more"/></button></td></tr>)}</tbody></table></div></>}
    </section></div></>;
}
 
function ServicesPage() {
  const { notify, navigate } = useApp();
  const [selected,setSelected]=useState(0);
  const [services,setServices]=useState([
    {name:"Hospitalización Adultos",code:"HOSP-AD",beds:48,available:8,turnover:14,sla:86,floors:"Pisos 3 y 4"},
    {name:"Unidad de Cuidados Intensivos",code:"UCI",beds:16,available:2,turnover:4,sla:91,floors:"Piso 2"},
    {name:"Hospitalización Pediátrica",code:"PED",beds:24,available:5,turnover:6,sla:89,floors:"Piso 5"},
    {name:"Urgencias",code:"URG",beds:20,available:3,turnover:9,sla:74,floors:"Piso 1"},
  ]);
  const service=services[selected];
  return <><PageHeader title="Servicios" subtitle="Administra servicios hospitalarios, capacidad y reglas operativas." actions={<Button variant="primary" icon="plus" onClick={()=>{setServices(current=>[...current,{name:`Nuevo servicio ${current.length+1}`,code:`SRV-${current.length+1}`,beds:0,available:0,turnover:0,sla:100,floors:"Sin ubicación"}]);setSelected(services.length);notify("Servicio creado como borrador","success")}}>Nuevo servicio</Button>}/>
    <div className="service-summary">{[["108","Camas configuradas","bed"],["18","Disponibles","check"],["33","En giro","clock"],["84%","SLA global","chart"]].map(x=><div key={x[1]}><span><Icon name={x[2] as IconName}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div></div>)}</div>
    <div className="services-layout"><section className="service-list"><div className="search"><Icon name="search"/><input placeholder="Buscar servicio..."/></div>{services.map((s,i)=><button className={selected===i?"active":""} key={s.code} onClick={()=>setSelected(i)}><div className="service-icon"><Icon name="building"/></div><div><strong>{s.name}</strong><span>{s.code} · {s.floors}</span></div><Badge tone={s.sla<80?"danger":"success"}>{s.sla}% SLA</Badge><Icon name="chevron"/></button>)}</section>
    <section className="panel service-detail"><div className="service-detail-head"><div><span>SERVICIO {service.code}</span><h2>{service.name}</h2><p>{service.floors} · Operación 24 horas</p></div><div><Button onClick={()=>notify("Cambios del servicio guardados","success")}>Editar servicio</Button><button className="icon-button"><Icon name="more"/></button></div></div><div className="service-kpis"><div><strong>{service.beds}</strong><span>Camas totales</span></div><div><strong>{service.available}</strong><span>Disponibles</span></div><div><strong>{service.turnover}</strong><span>En giro</span></div><div><strong>{service.sla}%</strong><span>Cumplimiento</span></div></div>
      <div className="capacity-head"><div><h3>Capacidad por piso</h3><span>Distribución y ocupación actual</span></div><Button icon="plus" onClick={()=>notify("Piso agregado al servicio","success")}>Agregar piso</Button></div><div className="floor-list">{[["Piso 3","24","21","3"],["Piso 4","24","19","5"]].map((f,i)=><div key={f[0]}><div className="floor-icon"><Icon name="building"/></div><div><strong>{f[0]}</strong><span>{f[1]} camas configuradas</span></div><div className="occupancy"><span>{f[2]} ocupadas · {f[3]} disponibles</span><div><i style={{width:`${i===0?88:79}%`}}/></div></div><button className="icon-button" onClick={()=>navigate("Camas")}><Icon name="eye"/></button></div>)}</div>
      <div className="service-rules"><h3>Reglas del servicio</h3><div className="setting-switch"><div><strong>Asignación automática de workflow</strong><span>Aplicar “Alta Hospitalaria” a nuevas altas.</span></div><button className="toggle on" onClick={e=>e.currentTarget.classList.toggle("on")}><i/></button></div><div className="setting-switch"><div><strong>Alertas a coordinación</strong><span>Notificar eventos críticos de este servicio.</span></div><button className="toggle on" onClick={e=>e.currentTarget.classList.toggle("on")}><i/></button></div></div>
    </section></div></>;
}
 
function GenericPage({ page }: { page: Page }) {
  const { notify } = useApp();
  const isAudit=page==="Auditoría";
  return <><PageHeader title={page} subtitle={page==="Interventores"?"Gestiona los equipos responsables de cada etapa del proceso.":page==="Versiones"?"Administra el historial y publicación de tus workflows.":"Administra y consulta la información de la operación."} actions={<Button variant="primary" icon="plus" onClick={()=>notify(page==="Versiones"?"Nueva versión v1.3 creada como borrador":`Formulario de ${page.toLowerCase()} abierto`,"success")}>{page==="Versiones"?"Crear nueva versión":`Crear ${page.toLowerCase()}`}</Button>}/>
    {page==="Versiones"&&<div className="alert-box"><Icon name="alert"/><span>Los procesos actualmente activos continuarán utilizando su versión actual.</span></div>}
    <section className="panel generic-table"><div className="workflow-tools"><div className="search small-search"><Icon name="search"/><input placeholder={`Buscar en ${page.toLowerCase()}...`}/></div><Button icon="filter">Filtros</Button></div>
    <div className="table-wrap"><table><thead><tr>{(isAudit?["Fecha","Usuario","Acción","Entidad","Descripción"]:page==="Versiones"?["Versión","Estado","Creada","Autor","Publicada","Procesos activos"]:["Nombre","Usuarios","Tareas pendientes","Tiempo promedio","SLA"]).map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>
      {(isAudit?[["09:42","María López","TASK_COMPLETED","Tarea #5002",'Completó "Facturación"'],["09:43","Sistema","TASK_CREATED","Tarea #5003","Creó tarea de Enfermería"],["09:43","Sistema","NOTIFICATION_CREATED","Notificación","Nueva tarea para Enfermería"]]:page==="Versiones"?[["v1.2","Publicada","18 Jun 2025","David Leudo","20 Jun 2025","14"],["v1.1","Archivada","02 May 2025","Ana Ríos","04 May 2025","0"],["v1.0","Archivada","12 Mar 2025","David Leudo","15 Mar 2025","0"]]:[["Enfermería","128","7","22 min","77%"],["Facturación","25","2","18 min","89%"],["Camilleros","18","1","9 min","94%"],["Servicios Generales","32","3","34 min","69%"]]).map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{j===1&&!isAudit?<Badge tone={c==="Publicada"?"success":c==="Archivada"?"neutral":"info"}>{c}</Badge>:j===0?<strong>{c}</strong>:c}</td>)}</tr>)}
    </tbody></table></div></section></>;
}
 
export default function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [menu, setMenu] = useState(false);
  const [selectedBed, setSelectedBed] = useState<typeof beds[number] | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>(["Pendiente","En proceso","Pendiente"]);
  const [unread, setUnread] = useState(3);
  const [toast, setToast] = useState<{message:string;tone:Tone}|null>(null);
  const notify = (message:string,tone:Tone="info") => {
    setToast({message,tone});
    window.setTimeout(()=>setToast(null),3200);
  };
  const context: AppContextValue = {
    navigate: setPage,
    notify,
    taskStatuses,
    updateTask: (index,status)=>setTaskStatuses(current=>current.map((value,i)=>i===index?status:value)),
    unread,
    readAll: ()=>setUnread(0),
  };
  const content = page === "Dashboard" ? <Dashboard setPage={setPage} openBed={setSelectedBed}/> :
    page === "Giro de camas" || page === "Camas" ? <BedsPage openBed={setSelectedBed}/> :
    page === "Mis tareas" ? <Tasks/> : page === "Workflows" ? <Workflows setPage={setPage}/> :
    page === "Workflow Detail" ? <WorkflowDetail/> : page === "Versiones" ? <WorkflowVersions/> :
    page === "Workflow Executions" ? <WorkflowExecutions/> : page === "Execution Detail" ? <ExecutionDetail/> :
    page === "Workflow Builder" ? <WorkflowBuilder/> : page === "Analytics" ? <Analytics/> :
    page === "Notificaciones" ? <Notifications setPage={setPage}/> : page === "Documentación" ? <Documentation/> :
    page === "Interventores" ? <Interveners/> : page === "Servicios" ? <ServicesPage/> :
    page === "Configuración" ? <SettingsPage/> : <GenericPage page={page}/>;
  return <AppContext.Provider value={context}><div className="app-shell"><Sidebar page={page} setPage={setPage} open={menu} close={()=>setMenu(false)}/><div className="app-main"><Topbar page={page} toggleMenu={()=>setMenu(!menu)} setPage={setPage}/><main className={`content ${page==="Workflow Builder"?"builder-content":""}`}>{content}</main></div>{selectedBed&&<BedDrawer bed={selectedBed} close={()=>setSelectedBed(null)}/>}<div className={`toast ${toast?`show toast-${toast.tone}`:""}`}>{toast&&<><Icon name={toast.tone==="success"?"check":toast.tone==="danger"?"alert":"bell"}/><span>{toast.message}</span></>}</div></div></AppContext.Provider>;
}
 