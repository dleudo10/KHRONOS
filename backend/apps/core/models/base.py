from django.db import models
from simple_history.models import HistoricalRecords

class BaseModel(models.Model):
    is_active = models.BooleanField(
        "estado",
        default=True,
        db_index=True
    )

    created_at = models.DateTimeField(
        "fecha de creación",
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        "fecha de actualización",
        auto_now=True
    )
    
    history = HistoricalRecords(inherit=True)
    
    def soft_delete(self, user=None):
        self.is_active = False
        self.save(update_fields=["is_active", "updated_at",])
        
    def restore(self, user=None):
        self.is_active = True
        self.save(update_fields=["is_active", "updated_at",])
    

    class Meta:
        abstract = True