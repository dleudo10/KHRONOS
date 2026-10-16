from django.db import models
from .workflow_version import WorkflowVersion
from apps.intervenors.models import Intervenor
from django.core.validators import MinValueValidator

class WorkflowNodeTypeChoice(models.TextChoices):
    START = "start", "Inicio"
    TASK = "task", "Tarea"
    END = "end", "Fin"
    SYSTEM_ACTION = "system_action", "Acción del sistema"

class WorkflowNode(models.Model):
    workflow_version = models.ForeignKey(WorkflowVersion, on_delete=models.PROTECT, related_name="nodes")
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=100)
    description = models.TextField(blank=True, default="")
    node_type = models.CharField(max_length=20, choices=WorkflowNodeTypeChoice.choices)
    interventor = models.ForeignKey(Intervenor, on_delete=models.SET_NULL, null=True, blank=True, related_name="workflow_nodes")
    expected_duration_minutes = models.PositiveIntegerField()
    sla_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    configuration = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "workflow_node"
        ordering = ["name"]
        verbose_name = "Nodo del flujo de trabajo"
        verbose_name_plural = "Nodos del flujo de trabajo"
        constraints = [
            models.UniqueConstraint(
                fields=["workflow_version", "code"],
                name="workflow_node_version_code_uniq",
            ),
        ]
        indexes = [
            models.Index(fields=["workflow_version", "node_type"], name="workflow_version_node_type_idx",),
        ]
        
    def __str__(self):
        return f"{self.name} ({self.node_type})"
