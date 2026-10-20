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
    
    def set_active(self, value: bool, user=None) -> bool:
        """Único punto que cambia el estado. Devuelve True si hubo cambio."""
        if self.is_active == value:
            return False

        self.is_active = value
        # self._change_reason = "Activación" if value else "Desactivación"
        # if user is not None:
        #     self._history_user = user  # simple_history registra quién lo hizo

        self.save(update_fields=["is_active", "updated_at"])
        return True
    
    class Meta:
        abstract = True