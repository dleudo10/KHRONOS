from django.db import models
from apps.core.models import BaseModel

class Intervenor(BaseModel):
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=20, unique=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        db_table = "intervenor"
        ordering = ["name"]
        verbose_name = "Interventor"
        verbose_name_plural = "Interventores"