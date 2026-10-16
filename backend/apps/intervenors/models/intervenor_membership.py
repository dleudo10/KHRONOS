from django.db import models
from apps.core.models import BaseModel
from .intervenor import Intervenor
from django.db.models import Q

class IntervenorMembership(BaseModel):
    user = models.CharField(max_length=128)
    intervenor = models.ForeignKey(Intervenor, on_delete=models.PROTECT, related_name="memberships")
    is_leader = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user} - {self.intervenor_id}"
    
    class Meta:
        db_table = "user_intervenor"
        verbose_name = "Interventor de usuario"
        verbose_name_plural = "Interventores de usuarios"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "intervenor"],
                name="user_intervenor_unique",
            ),
            models.UniqueConstraint(
                fields=["intervenor"],
                condition=Q(is_active=True, is_leader=True),
                name="uq_active_intervenor_leader",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "is_active"], name="user_is_active_idx"),
            models.Index(fields=["intervenor", "is_active"], name="intervenor_is_active_idx"),
        ]