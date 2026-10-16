from django.db import models
from .workflow import Workflow
from django.db.models import Q

class WorkflowVersionStatus(models.TextChoices):
    DRAFT = "draft", "Borrador"
    PUBLISHED = "published", "Publicado"
    ARCHIVED = "archived", "Archivado"


class WorkflowVersion(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.PROTECT, related_name="versions")
    version_number = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=WorkflowVersionStatus.choices, default=WorkflowVersionStatus.DRAFT)
    
    class Meta:
        db_table = "workflow_version"
        ordering = ["workflow", "-version_number"]
        verbose_name = "Versión del flujo de trabajo"
        verbose_name_plural = "Versiones de flujos de trabajo"

        constraints = [
            models.UniqueConstraint(
                fields=["workflow", "version_number"],
                name="workflow_version_number_unique",
            ),
            models.CheckConstraint(
                condition=Q(version_number__gte=1),
                name="workflow_version_number_positive",
            ),
        ]
        
    def __str__(self):
        return f"{self.workflow} - v{self.version_number}"
