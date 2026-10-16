from django.db import models
from django.db.models import Q
from .workflow_version import WorkflowVersion
from .workflow_node import WorkflowNode

class WorkflowTransitionConditionType(models.TextChoices):
    ALWAYS = "always", "Siempre"
    RULE = "rule", "Condición"

class WorkflowTransition(models.Model):
    workflow_version = models.ForeignKey(WorkflowVersion, on_delete=models.PROTECT, related_name="transitions")
    source_node = models.ForeignKey(WorkflowNode, on_delete=models.PROTECT, related_name="outgoing_transitions")
    target_node= models.ForeignKey(WorkflowNode, on_delete=models.PROTECT, related_name="incoming_transitions")
    condition_type = models.CharField(max_length=20, choices=WorkflowTransitionConditionType.choices, default=WorkflowTransitionConditionType.ALWAYS)
    condition_config = models.JSONField(default=dict, blank=True,)
    created_at =models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "workflow_transition"
        verbose_name = "Transición del flujo de trabajo"
        verbose_name_plural = "Transiciones del flujo de trabajo"

        constraints = [
            models.CheckConstraint(
                condition=~Q(source_node=models.F("target_node")),
                name="workflow_transition_distinct_nodes",
            ),
        ]

        indexes = [
            models.Index(
                fields=["workflow_version", "source_node"],
                name="wf_trans_version_source_idx",
            ),
            models.Index(
                fields=["workflow_version", "target_node"],
                name="wf_trans_version_target_idx",
            ),
        ]

    def __str__(self):
        return f"{self.source_node} -> {self.target_node}"
