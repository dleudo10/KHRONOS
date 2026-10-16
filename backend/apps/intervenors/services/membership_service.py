
# apps/intervenors/services/membership_service.py

from django.db import IntegrityError, transaction
from django.core.exceptions import ValidationError

from apps.intervenors.models import (
    Intervenor,
    IntervenorMembership,
)


class MembershipService:

    @staticmethod
    def _get_intervenor(intervenor_id, *, active_only=True):
        queryset = Intervenor.objects.all()

        if active_only:
            queryset = queryset.filter(is_active=True)

        intervenor = queryset.filter(pk=intervenor_id).first()

        if intervenor is None:
            raise ValidationError(
                "El interventor no existe o no está disponible."
            )

        return intervenor

    @staticmethod
    def add_member(*, intervenor_id, external_user_id):
        external_user_id = str(external_user_id).strip()

        if not external_user_id:
            raise ValidationError({
                "user_id": "El identificador es obligatorio."
            })

        try:
            with transaction.atomic():
                intervenor = MembershipService._get_intervenor(
                    intervenor_id
                )

                membership = (
                    IntervenorMembership.objects
                    .filter(
                        intervenor=intervenor,
                        user=external_user_id,
                    )
                    .first()
                )

                if membership and membership.is_active:
                    raise ValidationError({
                        "user_id": "El usuario ya pertenece al equipo."
                    })

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

                return IntervenorMembership.objects.create(
                    intervenor=intervenor,
                    user=external_user_id,
                    is_active=True,
                    is_leader=False,
                )

        except IntegrityError as exc:
            raise ValidationError(
                "No se pudo guardar la membresía por un conflicto "
                "de integridad. Verifica si ya existe."
            ) from exc

    @staticmethod
    def set_leader(*, intervenor_id, external_user_id):
        external_user_id = str(external_user_id).strip()

        if not external_user_id:
            raise ValidationError({
                "user_id": "El identificador es obligatorio."
            })

        try:
            with transaction.atomic():
                intervenor = (
                    Intervenor.objects
                    .filter(pk=intervenor_id, is_active=True)
                    .first()
                )

                if intervenor is None:
                    raise ValidationError(
                        "El interventor no existe o está inactivo."
                    )

                membership = (
                    IntervenorMembership.objects
                    .filter(
                        intervenor=intervenor,
                        user=external_user_id,
                        is_active=True,
                    )
                    .first()
                )

                if membership is None:
                    raise ValidationError({
                        "user_id": (
                            "El usuario debe ser miembro activo del "
                            "interventor antes de ser designado líder."
                        )
                    })

                # Retirar el liderazgo previo y designar el nuevo
                # dentro de la misma transacción.
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

        except IntegrityError as exc:
            raise ValidationError(
                "No se pudo cambiar el líder por un conflicto "
                "de integridad. Intenta de nuevo."
            ) from exc

    @staticmethod
    def update_membership(
        *,
        intervenor_id,
        external_user_id,
        is_active,
    ):
        with transaction.atomic():
            membership = (
                IntervenorMembership.objects
                .filter(
                    intervenor_id=intervenor_id,
                    user=str(external_user_id),
                )
                .first()
            )

            if membership is None:
                raise ValidationError("La membresía no existe.")

            if not is_active and membership.is_leader:
                raise ValidationError({
                    "is_active": (
                        "Debes designar otro líder antes de desactivar "
                        "al líder actual."
                    )
                })

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
