import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";

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

type Page = "Dashboard" | "Giro de camas" | "Mis tareas" | "Notificaciones" | "Workflows" | "Versiones" | "Workflow Builder" | "Interventores" | "Camas" | "Servicios" | "Analytics" | "Auditoría" | "Configuración" | "Documentación";
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
  { label: "Workflows", icon: "flow" }, { label: "Versiones", icon: "layers" },
  { label: "Workflow Builder", icon: "spark" },
];
const navAdmin: {label: Page; icon: IconName}[] = [
  { label: "Interventores", icon: "users" }, { label: "Camas", icon: "bed" },
  { label: "Servicios", icon: "building" }, { label: "Analytics", icon: "chart" },
  { label: "Auditoría", icon: "history" }, { label: "Configuración", icon: "settings" },
  { label: "Documentación", icon: "layers" },
];

function Button({ children, variant = "secondary", icon, onClick }: { children: ReactNode; variant?: "primary"|"secondary"|"ghost"|"danger"; icon?: IconName; onClick?: () => void }) {
  return <button className={`btn btn-${variant}`} onClick={onClick}>{icon && <Icon name={icon} size={16}/>}<span>{children}</span></button>;
}
function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot"/>{children}</span>;
}
function SelectPill({ children }: { children: ReactNode }) {
  return <button className="select-pill"><span>{children}</span><Icon name="chevron" size={14}/></button>;
}

function Sidebar({ page, setPage, open, close }: { page: Page; setPage: (p: Page) => void; open: boolean; close: () => void }) {
  const { unread } = useApp();
  const section = (items: typeof navTop) => items.map(item =>
    <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} onClick={() => { setPage(item.label); close(); }}>
      <Icon name={item.icon}/><span>{item.label}</span>{item.label === "Notificaciones" && unread > 0 && <b>{unread}</b>}
    </button>);
  return <>
    {open && <div className="backdrop" onClick={close}/>}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <Icon name="bed" size={22}/>
          <span/>
        </div>
        
        <div>
          <strong>Giro de Camas</strong>
          <small>OPERACIONES</small>
        </div>
        
        <button className="mobile-close" onClick={close}>
          <Icon name="close"/>
        </button>
      </div>
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
  return <header className="topbar">
    <div className="crumb">
      <button className="menu-button" onClick={toggleMenu}>
        <Icon name="menu"/>
        </button><span>Operación</span><Icon name="chevron" size={13}/><strong>{page}</strong></div>
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
    <PageHeader 
      title="Buenos días, David" 
      subtitle="Resumen operativo del giro de camas" 
      actions={<><SelectPill>Hoy</SelectPill><Button icon="chart" onClick={() => setPage("Analytics")}>Ver reporte</Button></>}
    />
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

function Workflows({ setPage }: { setPage:(p:Page)=>void }) {
  const flows=[["Alta Hospitalaria","v1.2","12 pasos","8 interventores","Publicado","David Leudo"],["Alta UCI","v1.0","15 pasos","10 interventores","Borrador","Ana Ríos"],["Alta Ambulatoria","v2.1","8 pasos","5 interventores","Publicado","David Leudo"]];
  return <><PageHeader title="Workflows" subtitle="Configura los procesos que coordinan el giro de camas." actions={<Button variant="primary" icon="plus" onClick={()=>setPage("Workflow Builder")}>Crear workflow</Button>}/>
    <section className="panel workflow-panel"><div className="workflow-tools"><div className="search small-search"><Icon name="search"/><input placeholder="Buscar workflow..."/></div><SelectPill>Todos los estados</SelectPill></div>
    <div className="workflow-list">{flows.map((f,i)=><div className="workflow-row" key={f[0]}><div className="flow-icon"><Icon name="flow"/></div><div className="flow-name"><strong>{f[0]}</strong><span>Modificado hace {i+1} días por {f[5]}</span></div><div><span>VERSIÓN</span><strong>{f[1]}</strong></div><div><span>ESTRUCTURA</span><strong>{f[2]}</strong><small>{f[3]}</small></div><Badge tone={f[4]==="Publicado"?"success":"warning"}>{f[4]}</Badge><Button onClick={()=>setPage("Workflow Builder")}>Editar</Button><button className="icon-button"><Icon name="more"/></button></div>)}</div></section>
  </>;
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
  const selected=nodes.find(n=>n.id===selectedId)||nodes[0];
  const relationCount=nodes.reduce((total,node)=>total+node.dependencies.length,0);
  const commit=(next:FlowNode[])=>{setHistory(h=>[...h,nodes]);setFuture([]);setNodes(next);setPublished(false)};
  const update=(field:keyof FlowNode,value:string|number|boolean|number[])=>setNodes(current=>current.map(n=>n.id===selected.id?{...n,[field]:value}:n));
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
  return <div className="builder-shell"><div className="builder-top"><div><Button variant="ghost" icon="arrow" onClick={()=>navigate("Workflows")}>Volver</Button><div><strong>Alta Hospitalaria</strong><span>v1.3 — {published?"Publicado":"Borrador"} · grafo dirigido</span></div></div><div><Button variant="ghost" onClick={undo}>Deshacer</Button><Button variant="ghost" onClick={redo}>Rehacer</Button><Button icon="play" onClick={simulate}>{simulation===null?"Simular":simulation>=maxLevel?"Reiniciar":"Siguiente etapa"}</Button><Button onClick={()=>notify("Grafo guardado como borrador","success")}>Guardar</Button><Button onClick={()=>validate()}>Validar</Button><Button variant="primary" onClick={()=>{if(validate(false)){setPublished(true);notify("Workflow v1.3 publicado correctamente","success")}}}>Publicar</Button></div></div>
    <div className="builder-body"><aside className="components-panel"><h3>Nodos</h3><p>Agrega unidades al grafo</p>{componentList.map(item=><button key={item.type} onClick={()=>addNode(item.type)}><span><Icon name={item.icon}/></span><div><strong>{item.label}</strong><small>{item.hint}</small></div><Icon name="plus" size={15}/></button>)}<div className="builder-help"><Icon name="flow"/><div><strong>Dependencias reales</strong><span>Selecciona un nodo y agrega uno o varios predecesores desde el panel derecho.</span></div></div><div className="graph-legend"><strong>Simulación</strong><span><i className="sim-running"/>Ejecutando ahora</span><span><i className="sim-complete"/>Completado</span><span><i/>Esperando dependencias</span></div></aside>
    <main className="canvas graph-canvas" onMouseMove={onMove} onMouseUp={()=>setDragging(null)} onMouseLeave={()=>setDragging(null)}><div className="canvas-grid"/><div className="zoom-tools"><button onClick={()=>setZoom(z=>Math.max(45,z-10))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(120,z+10))}>+</button><button title="Ajustar vista" onClick={()=>setZoom(75)}><Icon name="eye" size={15}/></button></div><div className="canvas-meta"><Badge tone={published?"success":"warning"}>{published?"Publicado":"Cambios sin publicar"}</Badge><span>{nodes.length} nodos · {relationCount} relaciones</span></div>
      <div className="graph-stage" style={{transform:`scale(${zoom/100})`,transformOrigin:"top left"}}><svg className="graph-edges" width="1900" height="760" viewBox="0 0 1900 760"><defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z"/></marker></defs>{nodes.flatMap(node=>node.dependencies.map(depId=>{const dep=nodes.find(n=>n.id===depId);if(!dep)return null;const x1=dep.x+220,y1=dep.y+55,x2=node.x,y2=node.y+55,curve=Math.max(50,(x2-x1)/2);return <g key={`${depId}-${node.id}`}><path className={`edge edge-${executionState(node)}`} d={`M${x1},${y1} C${x1+curve},${y1} ${x2-curve},${y2} ${x2},${y2}`} markerEnd="url(#arrowhead)"/><text x={(x1+x2)/2} y={(y1+y2)/2-7}>{node.activation==="all"?"TODAS":"CUALQUIERA"}</text></g>}))}</svg>
      {nodes.map(node=><div key={node.id} className={`graph-node workflow-node node-${node.type} ${selectedId===node.id?"node-selected":""} simulation-${executionState(node)}`} style={{left:node.x,top:node.y}} onMouseDown={e=>{if((e.target as HTMLElement).closest("button"))return;setSelectedId(node.id);setDependencyCandidate(nodes.find(n=>n.id!==node.id)?.id||node.id);setDragging({id:node.id,clientX:e.clientX,clientY:e.clientY,x:node.x,y:node.y})}}><span className="node-icon"><Icon name={nodeIcon(node.type)} size={16}/></span><div><span className="node-type">{typeLabelFor(node.type)}</span><strong>{node.name}</strong><small>{node.description||"Sin descripción"}</small>{node.type==="task"&&<p><Icon name="clock" size={12}/> {node.owner} · {node.sla} min</p>}<div className="dependency-count"><Icon name="flow" size={11}/>{node.dependencies.length} dependencia{node.dependencies.length===1?"":"s"}</div></div><div className="node-actions"><button title="Duplicar" onClick={e=>{e.stopPropagation();duplicateNode(node)}}><Icon name="layers" size={12}/></button><button title="Eliminar" onClick={e=>{e.stopPropagation();removeNode(node.id)}}><Icon name="close" size={12}/></button></div><span className="port port-in"/><span className="port port-out"/></div>)}</div></main>
    <aside className="config-panel"><div className="config-head"><div><h3>Configuración de {typeLabel.toLowerCase()}</h3><span>ID #{selected.id.toString().slice(-6)}</span></div><Badge tone={selected.type==="start"||selected.type==="end"?"success":"info"}>{typeLabel}</Badge></div><label>Nombre<input value={selected.name} onChange={e=>update("name",e.target.value)}/></label><label>Descripción<textarea value={selected.description} onChange={e=>update("description",e.target.value)}/></label>
      {selected.type==="task"&&<><label>Interventor<select value={selected.owner} onChange={e=>update("owner",e.target.value)}><option>Enfermería</option><option>Facturación</option><option>Camillero</option><option>Servicios Generales</option><option>Coordinación</option></select></label><div className="field-row"><label>SLA (min)<input type="number" min="1" value={selected.sla} onChange={e=>update("sla",Number(e.target.value))}/></label><label>Advertencia (%)<input type="number" min="1" max="100" value={selected.warning} onChange={e=>update("warning",Number(e.target.value))}/></label></div><label>Prioridad<select value={selected.priority} onChange={e=>update("priority",e.target.value)}><option>Baja</option><option>Normal</option><option>Alta</option><option>Crítica</option></select></label></>}
      {selected.type==="condition"&&<><label>Campo a evaluar<select value={selected.field} onChange={e=>update("field",e.target.value)}><option>Tipo de alta</option><option>Requiere copago</option><option>Servicio</option><option>Estado de facturación</option></select></label><label>Operador<select value={selected.operator} onChange={e=>update("operator",e.target.value)}><option>Es igual a</option><option>No es igual a</option><option>Contiene</option></select></label><label>Valor<input value={selected.value} onChange={e=>update("value",e.target.value)}/></label></>}
      {selected.type==="join"&&<label>Estrategia de unión<select value={selected.strategy} onChange={e=>update("strategy",e.target.value)}><option>Esperar todas</option><option>Continuar con la primera</option><option>Esperar rutas obligatorias</option></select></label>}
      {selected.type!=="start"&&<div className="dependency-editor"><div className="dependency-head"><div><h4>Dependencias</h4><span>Qué debe terminar antes</span></div><Badge tone={selected.dependencies.length>1?"info":"neutral"}>{selected.dependencies.length}</Badge></div><label>Política de activación<select value={selected.activation} onChange={e=>update("activation",e.target.value)}><option value="all">Todas las dependencias</option><option value="any">Cualquiera de las dependencias</option></select></label><div className="dependency-list">{selected.dependencies.length===0&&<p>Este nodo todavía no tiene predecesores.</p>}{selected.dependencies.map(id=>{const dep=nodes.find(n=>n.id===id);return <div key={id}><span><Icon name={dep?nodeIcon(dep.type):"flow"} size={12}/>{dep?.name||"Nodo eliminado"}</span><button onClick={()=>removeDependency(id)}><Icon name="close" size={12}/></button></div>})}</div><div className="add-dependency"><select value={dependencyCandidate} onChange={e=>setDependencyCandidate(Number(e.target.value))}>{nodes.filter(n=>n.id!==selected.id).map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select><Button icon="plus" onClick={addDependency}>Conectar</Button></div><div className="dependency-note"><Icon name="spark"/><span>{selected.activation==="all"?"Se ejecutará cuando todos los predecesores terminen.":"Se ejecutará cuando termine cualquiera de sus predecesores."}</span></div></div>}
      <div className="config-actions"><Button variant="primary" icon="check" onClick={()=>{setHistory(h=>[...h,nodes]);notify("Nodo y relaciones guardados","success")}}>Guardar cambios</Button>{selected.type!=="start"&&selected.type!=="end"&&<Button variant="danger" onClick={()=>removeNode(selected.id)}>Eliminar nodo</Button>}</div></aside></div>
  </div>;
}
function typeLabelFor(type:"start"|"task"|"condition"|"split"|"join"|"end"){
  return {start:"INICIO",task:"TAREA",condition:"CONDICIÓN",split:"DIVISIÓN",join:"UNIÓN",end:"FIN"}[type];
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
  return <>
    <PageHeader title="Notificaciones" subtitle="Mantente al día con la operación en tiempo real." actions={<Button onClick={()=>{readAll();notify("Todas las notificaciones fueron marcadas como leídas","success")}}>Marcar todas como leídas</Button>}/>
    <div className="tabs"><button className="active">Todas 12</button><button>No leídas {unread}</button></div><section className="panel notifications-list">{notes.map((n,i)=><button key={n[0]+i} onClick={()=>{if(n[0]==="Nueva tarea")setPage("Mis tareas");else notify(`${n[1]} — ${n[2]}`,n[4] as Tone)}}><div className={`note-icon note-${n[4]}`}><Icon name={n[4]==="danger"?"alert":n[4]==="success"?"check":n[4]==="warning"?"clock":"bell"}/></div><div><span>{n[0].toUpperCase()}</span><strong>{n[1]}</strong><p>{n[2]} · {n[3]}</p></div>{i<unread&&<i className="unread"/>}<Icon name="chevron"/></button>)}</section></>;
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

function Interveners() {
  const { navigate, notify } = useApp();
  const [selected, setSelected] = useState(0);
  const [members, setMembers] = useState(["María López","Laura Mejía","Andrés Restrepo"]);
  const [available, setAvailable] = useState([true,true,false]);
  const teams=[
    {name:"Enfermería",users:128,pending:7,average:"22 min",sla:77,tone:"warning" as Tone,lead:"Carolina Vélez"},
    {name:"Facturación",users:25,pending:2,average:"18 min",sla:89,tone:"info" as Tone,lead:"Ana Velásquez"},
    {name:"Camilleros",users:18,pending:1,average:"9 min",sla:94,tone:"success" as Tone,lead:"Felipe Mora"},
    {name:"Servicios Generales",users:32,pending:3,average:"34 min",sla:69,tone:"danger" as Tone,lead:"Carlos Páez"},
  ];
  const team=teams[selected];
  return <><PageHeader title="Interventores" subtitle="Gestiona equipos, usuarios, disponibilidad y desempeño operativo." actions={<><Button icon="chart" onClick={()=>navigate("Analytics")}>Ver Analytics</Button><Button variant="primary" icon="plus" onClick={()=>notify("Nuevo interventor creado como borrador","success")}>Nuevo interventor</Button></>}/>
    <div className="intervener-grid">{teams.map((t,i)=><button className={selected===i?"selected":""} key={t.name} onClick={()=>setSelected(i)}><div className={`team-icon ta-${t.tone}`}><Icon name="users"/></div><div className="team-head"><h3>{t.name}</h3><Badge tone={t.sla<75?"danger":t.sla<85?"warning":"success"}>{t.sla}% SLA</Badge></div><span>{t.users} usuarios · Líder: {t.lead}</span><div className="team-stats"><div><strong>{t.pending}</strong><span>Pendientes</span></div><div><strong>{t.average}</strong><span>Promedio</span></div><div><strong>{t.sla}%</strong><span>Cumplimiento</span></div></div><div className="progress"><i className={`fill-${t.tone}`} style={{width:`${t.sla}%`}}/></div><small>{selected===i?"Equipo seleccionado":"Seleccionar equipo"}</small></button>)}</div>
    <section className="panel team-detail"><div className="team-detail-head"><div><div className={`team-icon ta-${team.tone}`}><Icon name="users"/></div><div><span>DETALLE DEL INTERVENTOR</span><h2>{team.name}</h2><p>Líder responsable: {team.lead}</p></div></div><div><Button onClick={()=>notify(`Configuración de ${team.name} actualizada`,"success")}>Editar equipo</Button><Button variant="primary" icon="plus" onClick={()=>{setMembers(current=>[...current,`Nuevo usuario ${current.length+1}`]);setAvailable(current=>[...current,true]);notify("Usuario asociado al interventor","success")}}>Asociar usuario</Button></div></div>
      <div className="team-detail-kpis"><div><span>Usuarios activos</span><strong>{team.users}</strong><small>+4 este mes</small></div><div><span>Tareas pendientes</span><strong>{team.pending}</strong><small>2 próximas a vencer</small></div><div><span>Tiempo promedio</span><strong>{team.average}</strong><small>Objetivo: 20 min</small></div><div><span>Productividad</span><strong>8.4</strong><small>Tareas por turno</small></div></div>
      <div className="detail-section-head"><div><h3>Usuarios asociados</h3><span>Disponibilidad del turno actual</span></div><div className="search small-search"><Icon name="search"/><input placeholder="Buscar usuario..."/></div></div>
      <div className="table-wrap"><table><thead><tr><th>Usuario</th><th>Rol</th><th>Turno</th><th>Tareas activas</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>{members.map((member,i)=><tr key={member}><td><span className="table-avatar">{member.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><strong>{member}</strong></td><td>{i===0?"Coordinador":"Auxiliar"}</td><td>{i%2===0?"Mañana":"Tarde"}</td><td>{i+1}</td><td><button className={`availability ${available[i]?"online":"offline"}`} onClick={()=>setAvailable(current=>current.map((v,j)=>j===i?!v:v))}><i/>{available[i]?"Disponible":"No disponible"}</button></td><td><button className="icon-button" onClick={()=>notify(`Opciones de ${member}`)}><Icon name="more"/></button></td></tr>)}</tbody></table></div>
    </section></>;
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

export default function Prueba() {
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
        page === "Workflow Builder" ? <WorkflowBuilder/> : page === "Analytics" ? <Analytics/> :
        page === "Notificaciones" ? <Notifications setPage={setPage}/> : page === "Documentación" ? <Documentation/> :
        page === "Interventores" ? <Interveners/> : page === "Servicios" ? <ServicesPage/> :
        page === "Configuración" ? <SettingsPage/> : <GenericPage page={page}/>;

    return <AppContext.Provider value={context}>
        <div className="app-shell">
            <Sidebar page={page} setPage={setPage} open={menu} close={()=>setMenu(false)}/>
            <div className="app-main">
                <Topbar page={page} toggleMenu={()=>setMenu(!menu)} setPage={setPage}/>
                <main className={`content ${page==="Workflow Builder"?"builder-content":""}`}>{content}</main>
            </div>
            
            {selectedBed && <BedDrawer bed={selectedBed} close={()=>setSelectedBed(null)}/>}
                
            <div className={`toast ${toast?`show toast-${toast.tone}`:""}`}>
                {toast && <> 
                    <Icon name={toast.tone==="success"?"check":toast.tone==="danger"?"alert":"bell"}/>
                    <span>{toast.message}</span>
                </>}
            </div>
        </div>
    </AppContext.Provider>;
}
