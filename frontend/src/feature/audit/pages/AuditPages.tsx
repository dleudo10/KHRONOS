import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";

const AuditPages = () => {
    const auditData = [
        [
            "09:42",
            "María López",
            "TASK_COMPLETED",
            "Tarea #5002",
            'Completó "Facturación"',
        ],
        [
            "09:43",
            "Sistema",
            "TASK_CREATED",
            "Tarea #5003",
            "Creó tarea de Enfermería",
        ],
        [
            "09:43",
            "Sistema",
            "NOTIFICATION_CREATED",
            "Notificación",
            "Nueva tarea para Enfermería",
        ],
    ];

    const columns = [
        "Fecha",
        "Usuario",
        "Acción",
        "Entidad",
        "Descripción",
    ];

    return (
        <>
            <PageHeader
                title="Auditoría"
                subtitle="Administra y consulta la información de la operación."
                actions={
                    <Button variant="primary" icon="plus">
                        Crear Auditoría
                    </Button>
                }
            />

            <section className="panel generic-table">
                <div className="workflow-tools">
                    <div className="search small-search">
                        <Icon name="search" />
                        <input placeholder="Buscar en auditoría..." />
                    </div>

                    <Button icon="filter">Filtros</Button>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {auditData.map((row, index) => (
                                <tr key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>
                                            {cellIndex === 0 ? (
                                                <strong>{cell}</strong>
                                            ) : (
                                                cell
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default AuditPages;