
from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError

from apps.intervenors.models import (
    Intervenor,
    IntervenorMembership,
)

class MembershipService:
    """
    Reglas de negocio para las membresías de interventores.

    La validación de identidades externas debe realizarse antes
    de crear o activar una membresía.
    """

    @staticmethod
    def _get_active_intervenor(intervenor_id):
        try:
            return Intervenor.objects.get(
                pk=intervenor_id,
                is_active=True,
            )
        except Intervenor.DoesNotExist:
            raise ValidationError(
                "El interventor no existe o está inactivo."
            )

    @staticmethod
    def add_member(*, intervenor_id, external_user_id):
        external_user_id = str(external_user_id).strip()

        if not external_user_id:
            raise ValidationError(
                {"user_id": "El identificador es obligatorio."}
            )

        with transaction.atomic():
            intervenor = (
                Intervenor.objects.select_for_update()
                .filter(pk=intervenor_id, is_active=True)
                .first()
            )

            if intervenor is None:
                raise ValidationError(
                    "El interventor no existe o está inactivo."
                )

            membership = (
                IntervenorMembership.objects
                .select_for_update()
                .filter(
                    intervenor=intervenor,
                    user=external_user_id,
                )
                .first()
            )

            if membership and membership.is_active:
                raise ValidationError(
                    {"user_id": "El usuario ya pertenece al interventor."}
                )

            if membership:
                membership.is_active = True
                membership.is_leader = False
                membership.save(
                    update_fields=[
                        "is_active",
                        "is_leader",
                        "updated_at",
                    ]
                )
                return membership

            try:
                return IntervenorMembership.objects.create(
                    intervenor=intervenor,
                    user=external_user_id,
                    is_active=True,
                    is_leader=False,
                )
            except IntegrityError:
                raise ValidationError(
                    "No se pudo crear la membresía. "
                    "Verifica si el usuario ya pertenece al equipo."
                )

    @staticmethod
    def set_leader(*, intervenor_id, external_user_id):
        external_user_id = str(external_user_id).strip()

        if not external_user_id:
            raise ValidationError(
                {"user_id": "El identificador es obligatorio."}
            )

        with transaction.atomic():
            intervenor = (
                Intervenor.objects.select_for_update()
                .filter(pk=intervenor_id, is_active=True)
                .first()
            )

            if intervenor is None:
                raise ValidationError(
                    "El interventor no existe o está inactivo."
                )

            membership = (
                IntervenorMembership.objects
                .select_for_update()
                .filter(
                    intervenor=intervenor,
                    user=external_user_id,
                )
                .first()
            )

            if membership is None:
                raise ValidationError(
                    {
                        "user_id": (
                            "El usuario debe pertenecer al interventor "
                            "antes de ser designado líder."
                        )
                    }
                )

            if not membership.is_active:
                raise ValidationError(
                    "No se puede designar líder a una membresía inactiva."
                )

            # Primero se retira el liderazgo anterior.
            IntervenorMembership.objects.filter(
                intervenor=intervenor,
                is_active=True,
                is_leader=True,
            ).exclude(pk=membership.pk).update(
                is_leader=False
            )

            membership.is_leader = True
            membership.save(
                update_fields=["is_leader", "updated_at"]
            )

            return membership

    @staticmethod
    def update_membership(
        *,
        intervenor_id,
        external_user_id,
        is_active=None,
    ):
        with transaction.atomic():
            intervenor = (
                Intervenor.objects.select_for_update()
                .filter(pk=intervenor_id)
                .first()
            )

            if intervenor is None:
                raise ValidationError("El interventor no existe.")

            membership = (
                IntervenorMembership.objects
                .select_for_update()
                .filter(
                    intervenor=intervenor,
                    user=str(external_user_id),
                )
                .first()
            )

            if membership is None:
                raise ValidationError("La membresía no existe.")

            if is_active is False and membership.is_leader:
                raise ValidationError(
                    "Debes designar otro líder antes de desactivar "
                    "al líder actual."
                )

            if is_active is not None:
                membership.is_active = is_active

                if not is_active:
                    membership.is_leader = False

                membership.save(
                    update_fields=[
                        "is_active",
                        "is_leader",
                        "updated_at",
                    ]
                )

            return membership
