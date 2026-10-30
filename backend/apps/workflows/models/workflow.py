from django.db import models
from apps.core.models.base import BaseModel

class Workflow(BaseModel):
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=200, unique=True)
    description = models.TextField(null=True, blank=True)
     
    class Meta:
        db_table = "workflow"
        verbose_name = "Flujo de trabajo"
        verbose_name_plural = "Flujo de trabajos"
        indexes = [
            models.Index(fields=["is_active"], name="is_active_idx"),
            models.Index(fields=["code"], name="code_idx"),
        ]
        
    def __str__(self): 
        return f"{self.code} - {self.name}"
