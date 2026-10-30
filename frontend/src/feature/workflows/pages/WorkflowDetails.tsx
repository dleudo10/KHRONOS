import { useNavigate, useParams } from "react-router-dom";
import { useDetailsWorkflow } from "../hooks/useDetailsWorkflow";
import Button from "../../../components/ui/Button";
import Badge, { type Tone } from "../../../components/ui/Badge";
import Icon from "../../../components/ui/Icon";
import { fmtDate } from "../../../utils/fmtDate";
import type { Status } from "../types/workflow.types";
import { useAnchoredMenu } from "../../../hooks/useAnchoredMenu";
import { useRef, useState } from "react";
import { ActionsMenu } from "../../../components/common/ActionsMenu";
import { STACKED_LAYOUT_BREAKPOINT } from "../../../const";
import { useAddNewWorkflowVersion } from "../hooks/useAddNewWorkflowVersion";

const WorkflowDetails = () => {
    const { id } = useParams<{ id: string }>();
    const workflowId = Number(id);
    const navigate = useNavigate();
    const isValidId = !!id && Number.isInteger(workflowId) && workflowId > 0;

    const { data, isLoading, isError } = useDetailsWorkflow(workflowId);

    const statusConfig: Record<Status, { label: string; tone: Tone }> = {
        draft: {
            label: "Borrador",
            tone: "warning",
        },
        published: {
            label: "Publicado",
            tone: "success",
        },
        archived: {
            label: "Archivado",
            tone: "neutral",
        },
    };

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [publishConfirm, setPublishConfirm] = useState(false);
    const menu = useAnchoredMenu();
    const detailRef = useRef<HTMLElement | null>(null);
    const { mutate, isPending, } = useAddNewWorkflowVersion();

    const handleNewVersion = (id: number) => {
        mutate(
            { id },
            {
                onSuccess: () => {
                    setPublishConfirm(false);
                },
            }
        );
    };
    


    if (!isValidId) {
        return <p>ID de workflow inválido.</p>;
    }

    if (isLoading) {
        return <p>Cargando workflow...</p>;
    }

    if (isError) {
        return <p>Error al cargar el workflow.</p>;
    }


    const workflowDetails = data?.data;
    
    if (!workflowDetails) {
        return <p>Sin datos.</p>;
    }
    
    const menuVersion = menu.anchor ? workflowDetails?.versions.find(w => w.id === menu.anchor?.id) : undefined
    const selected = workflowDetails?.versions.find(item => item.id === selectedId) ?? workflowDetails?.versions[0] ?? null;
    
    const handleSelect = (id: number) => {
        setSelectedId(id);

        if (window.innerWidth < STACKED_LAYOUT_BREAKPOINT) {
            window.setTimeout(
                () => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                60,
            );
        }
    };
    
    return (
        <>
            <div className="detail-back">
                <Button
                    variant="ghost" 
                    icon="arrow" 
                    onClick={() => navigate("/workflows")}
                >
                    Volver a workflows
                </Button>
            </div>
            
            <div className="page-header">
                <div>
                    <div className="flex gap-2">
                        <span className="table-avatar h-10! w-10!">
                            <Icon name="flow" size={22}/>
                        </span>
                        <h1>{workflowDetails.name}</h1>   
                        <span>
                            <Badge 
                                tone={workflowDetails.is_active ? "success" : "warning"} 
                                classname="text-[8px]!" 
                            >
                                {workflowDetails.is_active ? "ACTIVO" : "INACTIVO"}
                            </Badge> 
                        </span>                    
                    </div>
                    <p>{workflowDetails.description}</p>
                    <div className="mt-2">
                        <Badge tone="info" icon={false}>
                            {workflowDetails.code}
                        </Badge>
                    </div>
                </div>
                <div className="page-actions">
                    <Button 
                        variant="primary" 
                        icon="plus" 
                        onClick={() => setPublishConfirm(true)}
                    >
                        Crear nueva versión
                    </Button>
                </div>
            </div>

            <div className="detail-summary">
                <section className="panel workflow-overview">
                    <div className="overview-head">
                        <div>
                            <h2>Lista de versiones</h2>
                            <p>Las ejecuciones iniciadas conservan siempre la versión con la que comenzaron.</p>
                        </div>
                        
                    </div>
                    
                    <div className="table-wrap">
                        <table className="workflow-table">
                            <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Nodos</th>
                                    <th>Estado</th>
                                    <th>Fecha de publicación</th>
                                    <th>Última modificación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workflowDetails.versions.map( row => {
                                    const status = statusConfig[row.status] ?? {
                                        label: row.status || "Desconocido",
                                        tone: "neutral" as Tone,
                                    };

                                    return (
                                        <tr key={row.id} >
                                            <td>
                                                <span className="table-avatar">
                                                    v{`${row.version_number}`}
                                                </span>
                                                <strong>Versión {row.version_number}</strong>
                                            </td>
                                            <td>
                                                <span>{row.nodes_count}</span>
                                            </td>
                                            <td>
                                                <Badge tone={status.tone}>
                                                    {status.label}
                                                </Badge>

                                            </td>
                                            <td>
                                                <strong>{row.published ? fmtDate(row.published) : '—'}</strong>
                                            </td>
                                            <td>{fmtDate(row.updated_at)}</td>
                                            <td>
                                                <button 
                                                    type="button"
                                                    className="icon-button"
                                                    aria-label={`Opciones de ${row.version_number}`}
                                                    aria-haspopup="menu"
                                                    onClick={e => menu.toggle(e, row.id)}
                                                >
                                                    <Icon name="more"/>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="panel published-summary">
                    <div className="panel-title">
                        <div>
                            <h2>Versión publicada</h2>
                        </div>
                    </div>
                    
                    <strong className="version-number">v{workflowDetails.summary.published_version ?? 0}</strong>
                    <div className="version-stats">
                        <span><b>{workflowDetails.summary.total_nodes}</b>Nodos</span>
                        <span><b>{workflowDetails.summary.versions_count}</b>Cantidad de versiones</span>
                    </div>
                    
                    {workflowDetails.summary.published_version && (
                        <Button 
                            icon="eye" 
                            // onClick={()=>navigate("Workflow Builder")}
                        >
                            Consultar definición
                        </Button>
                    )}
                
                </section>
            </div>

            {menu.anchor && menuVersion && (
                <ActionsMenu 
                    top={menu.anchor.top}
                    right={menu.anchor.right}
                    onClose={menu.close}
                >

                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => navigate(`/workflows/${workflowDetails.id}/version/${menuVersion.id}/builder`)}
                    >
                        <Icon name="eye" size={15} />
                        Ver flujo
                    </button>

                    <div className="ivr-menu-sep" />

                    {selected.status === 'published' ? (
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => navigate(`${menuVersion.id}/details`)}
                            className="danger"
                        >
                            <Icon name="close" size={15} />
                            Archivar versión
                        </button>
                    ) : (
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => navigate(`${menuVersion.id}/details`)}
                            className="success"
                        >
                            <Icon name="check" size={15} />
                            Publicar versión
                        </button>
                    )}
                </ActionsMenu>
            )}

            {publishConfirm && (
                <>
                    <div className="builder-overlay" onClick={() => setPublishConfirm(false)} />
                    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="create-version-title" aria-describedby="create-version-description">
                        <span className="confirm-icon"><Icon name="copy-plus" /></span>
                        <h2 id="create-version-title">Crear nueva versión</h2>
                        <p id="create-version-description">
                            Se creará una nueva versión de{" "}
                            <strong>{workflowDetails.name}</strong>{" "}
                            a partir de la definición actual.
                        </p>

                        <div className="version-draft-notice">
                            <Icon name="file-pen" size={20} />

                            <div>
                                <strong className="text-[--var(#003085)]!">Estado inicial: Borrador</strong>
                                <span>
                                    Podrás editar los nodos, las conexiones y las
                                    reglas de ejecución antes de publicar esta versión.
                                </span>
                            </div>
                        </div>

                        <div className="version-info">
                            <Icon name="info" size={18} />

                            <p>
                                Las versiones existentes no se modificarán.
                                Crear este borrador no publica el workflow ni
                                cambia la versión que utilizan las nuevas ejecuciones.
                            </p>
                        </div>
                        <div>
                            <Button onClick={() => setPublishConfirm(false)}>Cancelar</Button>
                            <Button
                                variant="primary"
                                icon={isPending ? undefined : "plus"}
                                disabled={isPending}
                                onClick={() => handleNewVersion(workflowDetails.id)}
                            >
                                {isPending
                                    ? "Creando versión..."
                                    : "Crear versión borrador"}
                            </Button>
                        </div>
                    </div>
                </>
            )}

        </>
    )
};

export default WorkflowDetails;