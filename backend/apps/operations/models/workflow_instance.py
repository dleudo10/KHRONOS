from django.db import models
from apps.workflows.models import WorkflowVersion

class WorkflowInstanceStatus(models.TextChoices):
    PENDING = "pending", "Pendiente"
    IN_PROGRESS = "in_progress", "En ejecución"
    COMPLETED = "completed", "Completada"
    CANCELLED = "cancelled", "Cancelada"

class WorkflowInstance(models.Model):
    workflow_version = models.ForeignKey(WorkflowVersion, on_delete=models.PROTECT, related_name="instances")
    status = models.CharField(max_length=20, choices=WorkflowInstanceStatus.choices, default=WorkflowInstanceStatus.PENDING)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = "workflow_instance"
        ordering = ["-created_at"]
        verbose_name = "Instancia del flujo de trabajo"
        verbose_name_plural = "Instancias de flujos de trabajo"

        indexes = [
            models.Index(
                fields=["workflow_version", "status"],
                name="wf_instance_version_status_idx",
            ),
            models.Index(
                fields=["status", "created_at"],
                name="wf_instance_status_created_idx",
            ),
        ]
    
    def __str__(self):
        return f"Instancia {self.pk} - {self.get_status_display()}"