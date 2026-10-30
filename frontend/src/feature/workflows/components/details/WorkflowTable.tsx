import Icon from '../../../../components/ui/Icon';
import Badge from '../../../../components/ui/Badge';
import type { Workflow } from '../../types/workflow.types';
import type { MouseEvent } from "react";
import { fmtDate } from '../../../../utils/fmtDate';

type WorkflowTableProps = {
    workflow: Workflow[];
    onOpenMenu: (e: MouseEvent<HTMLButtonElement>, workflowId: number) => void;
};

const WorkflowTable = ({ workflow, onOpenMenu }: WorkflowTableProps) => {

    return (
        <div className="table-wrap">
            <table className="workflow-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Versión publicada</th>
                        <th>Versiones</th>
                        <th>Última modificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {workflow.map( row => 
                        <tr key={row.code} >
                            <td>
                                <span className="table-avatar">
                                    <Icon name="flow" size={14}/>
                                </span>
                                <strong>{row.name}</strong>
                            </td>
                            <td>
                                <code>{row.code}</code>
                            </td>
                            <td className="description-cell">
                                {row.description}
                            </td>
                            <td>
                                <Badge tone={row.is_active?"success":"neutral"}>
                                    {row.is_active?"Activo":"Inactivo"}
                                </Badge>
                            </td>
                            <td>
                                <strong>{row.published ? fmtDate(row.published) : '—'}</strong>
                            </td>
                            <td>V.{row.version_number}</td>
                            <td>{fmtDate(row.updated_at)}</td>
                            <td>
                                <button 
                                    type="button"
                                    className="icon-button"
                                    aria-label={`Opciones de ${row.name}`}
                                    aria-haspopup="menu"
                                    onClick={e => onOpenMenu(e, row.id)}
                                >
                                    <Icon name="more"/>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default WorkflowTable