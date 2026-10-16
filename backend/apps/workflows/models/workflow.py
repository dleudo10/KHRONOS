from django.db import models
from core.models.base import BaseModel

class Workflow(BaseModel):
    clinic = models.ForeignKey()
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=200)
    description = models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = "workflow"
        ordering = ["name"]
        verbose_name = "Flujo de trabajo"
        verbose_name_plural = "Flujo de trabajos"
        constraints = [
            models.UniqueConstraint(
                fields=["clinic", "code"],
                name="clinic_code_unique",
            ),
        ]
        indexes = [
            models.Index(fields=["clinic", "is_active"], name="clinic_is_active_idx"),
        ]
        
    def __str__(self):
        return f"{self.code} - {self.name}"
