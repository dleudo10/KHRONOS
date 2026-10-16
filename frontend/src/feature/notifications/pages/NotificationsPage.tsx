import PageHeader from "../../../components/common/PageHeader"
import Button from "../../../components/ui/Button"
import Icon from "../../../components/ui/Icon";
import { useUnreadNotifications } from "../../../hooks/useUnreadNotifications";

const NotificationsPage = () => {
    const unread = useUnreadNotifications();
    
    const notes = [
        ["Nueva tarea","Retiro de dispositivos","Habitación 304","Hace 2 minutos","info"],
        ["SLA próximo a vencer","Facturación","Habitación 201","Hace 5 minutos","warning"],
        ["SLA vencido","Servicios Generales","Habitación 402","Hace 8 minutos","danger"],
        ["Cama disponible","Desinfección completada","Habitación 306","Hace 14 minutos","success"]
    ];

    return (
        <>
            <PageHeader 
                title="Notificaciones"
                subtitle="Mantente al día con la operación en tiempo real."
                actions={<>
                    <Button>
                        Marcar todas como leídas
                    </Button>
                </>}
            />

            <div className="tabs">
                <button className="active">Todas 12</button>
                <button>No leídas {unread}</button>
            </div>
                
            <section className="panel notifications-list">
                {notes.map((n,i) => 
                    <button key={n[0]+i}>
                        <div className={`note-icon note-${n[4]}`}>
                            <Icon name={n[4]==="danger"?"alert":n[4]==="success"?"check":n[4]==="warning"?"clock":"bell"}/>
                        </div>
                            
                        <div>
                            <span>{n[0].toUpperCase()}</span>
                            <strong>{n[1]}</strong>
                            <p>{n[2]} · {n[3]}</p>
                        </div>
                            
                        {i<unread&&<i className="unread"/>}
                        
                        <Icon name="chevron"/>
                    </button>
                )}
            </section>
        </>

    )
}

export default NotificationsPage