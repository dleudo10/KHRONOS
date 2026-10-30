from .workflow_create_serializer import WorkflowSaveSerializer
from .workflow_detail_serializer import WorkflowDetailsSerializer # Construye el objeto raíz que consume el frontend.
from .workflow_list_serializer import WorkflowSerializer
from .workflow_summary_serializer import WorkflowSummarySerializer #Indicadores del panel lateral y las últimas tres actividades derivadas de las fechas disponibles.
from .workflow_node_detail_serializer import WorkflowNodeDetailSerializer #Datos de los nodos para mostrar o editar el flujo.
from .workflow_transition_detail import WorkflowTransitionDetailSerializer #Relaciones entre nodos y configuración de las condiciones
from .workflow_version_detail_serializer import WorkflowVersionDetailSerializer #Información, nodos, transiciones y contadores de cada versión
from .workflow_version_save_serializer import WorkflowVersionSaveSerializer