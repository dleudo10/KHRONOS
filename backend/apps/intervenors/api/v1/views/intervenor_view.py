from django.db import transaction
from django.db.models import Count, Q

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.core.views import SoftDeleteViewSet
from apps.intervenors.models import (
    Intervenor, IntervenorMembership
)
from ..serializers import (
    IntervenorSerializer,
    IntervenorMembershipSerializer,
    AddIntervenorMemberSerializer,
    SetIntervenorLeaderSerializer,
    UpdateIntervenorMembershipSerializer
)

class IntervenorViewSet(SoftDeleteViewSet):
    queryset = Intervenor.objects.all()
    serializer_class = IntervenorSerializer

    search_fields = ["name", "code"]
    filterset_fields = ["is_active"]
    ordering_fields = ["name", "code", "created_at"]
    ordering = ["name"]

    permission_map = {
        "list": "intervenors.view_intervenor",
        "retrieve": "intervenors.view_intervenor",
        "create": "intervenors.create_intervenor",
        "update": "intervenors.change_intervenor",
        "partial_update": "intervenors.change_intervenor",
        "destroy": "intervenors.change_intervenor",
        "restore": "intervenors.change_intervenor",
        "members": "intervenors.view_intervenor",
        "add_member": "intervenors.manage_members",
        "member_detail": "intervenors.manage_members",
        "leader": "intervenors.manage_leader",
        "metrics": "intervenors.view_metrics",
    }

    serializer_action_classes = {
        "members": IntervenorMembershipSerializer,
        "add_member": AddIntervenorMemberSerializer,
        "leader": SetIntervenorLeaderSerializer,
        "member_detail": UpdateIntervenorMembershipSerializer,
    }

    def get_queryset(self):
        queryset = super().get_queryset()

        # El queryset conserva los inactivos para permitir restore.
        # El listado normal solo muestra interventores activos.
        if self.action == "list":
            queryset = queryset.filter(is_active=True)

        return queryset

    def perform_destroy(self, instance):
        if instance.memberships.filter(
            is_active=True,
            is_leader=True,
        ).exists():
            raise ValidationError(
                "Designa otro líder o desactiva la membresía de "
                "liderazgo de forma segura antes de desactivar "
                "el interventor."
            )

        # No se borran físicamente registros.
        super().perform_destroy(instance)

    def perform_update(self, serializer):
        # Evita desactivar un equipo que aún tiene miembros activos.
        # Si luego operations administra tareas activas, agregar
        # también la comprobación de tareas antes de desactivar.
        instance = serializer.instance
        requested_active = serializer.validated_data.get(
            "is_active",
            instance.is_active,
        )

        if not requested_active and instance.is_active:
            if instance.memberships.filter(is_active=True).exists():
                raise ValidationError({
                    "is_active": (
                        "No puedes desactivar el interventor mientras "
                        "tenga miembros activos."
                    )
                })

        super().perform_update(serializer)

    @action(detail=True, methods=["get", "post"], url_path="members")
    def members(self, request, pk=None):
        intervenor = self.get_object()

        if request.method == "GET":
            memberships = (
                IntervenorMembership.objects
                .filter(
                    intervenor=intervenor,
                    is_active=True,
                )
                .order_by("-is_leader", "user")
            )

            page = self.paginate_queryset(memberships)
            if page is not None:
                serializer = IntervenorMembershipSerializer(
                    page,
                    many=True,
                )
                return self.get_paginated_response(serializer.data)

            serializer = IntervenorMembershipSerializer(
                memberships,
                many=True,
            )
            return Response(serializer.data)

        serializer = AddIntervenorMemberSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        try:
            membership = MembershipService.add_member(
                intervenor_id=intervenor.pk,
                external_user_id=serializer.validated_data["user_id"],
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc.message_dict if hasattr(
                exc, "message_dict"
            ) else exc.messages)

        return Response(
            IntervenorMembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["put"],
        url_path="leader",
    )
    def leader(self, request, pk=None):
        intervenor = self.get_object()

        serializer = SetIntervenorLeaderSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        try:
            membership = MembershipService.set_leader(
                intervenor_id=intervenor.pk,
                external_user_id=serializer.validated_data["user_id"],
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc.message_dict if hasattr(
                exc, "message_dict"
            ) else exc.messages)

        return Response(
            IntervenorMembershipSerializer(membership).data
        )

    @action(
        detail=True,
        methods=["patch", "delete"],
        url_path=r"members/(?P<user_id>[^/.]+)",
    )
    def member_detail(self, request, pk=None, user_id=None):
        intervenor = self.get_object()

        membership = IntervenorMembership.objects.filter(
            intervenor=intervenor,
            user=user_id,
        ).first()

        if membership is None:
            raise NotFound("No existe esa membresía en el interventor.")

        if request.method == "DELETE":
            serializer = UpdateIntervenorMembershipSerializer(
                data={"is_active": False}
            )
        else:
            serializer = UpdateIntervenorMembershipSerializer(
                data=request.data,
                partial=True,
            )

        serializer.is_valid(raise_exception=True)

        # Para PATCH, si no se envía is_active, no hay campo
        # modificable actualmente; el serializador lo rechazará.
        is_active = serializer.validated_data.get("is_active")

        if is_active is None:
            raise ValidationError({
                "is_active": "Debes indicar el nuevo estado."
            })

        try:
            membership = MembershipService.update_membership(
                intervenor_id=intervenor.pk,
                external_user_id=user_id,
                is_active=is_active,
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc.message_dict if hasattr(
                exc, "message_dict"
            ) else exc.messages)

        return Response(
            IntervenorMembershipSerializer(membership).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["get"],
        url_path="metrics",
    )
    def metrics(self, request, pk=None):
        intervenor = self.get_object()

        metrics = IntervenorMembership.objects.filter(
            intervenor=intervenor
        ).aggregate(
            active_members=Count(
                "id",
                filter=Q(is_active=True),
            ),
            active_leaders=Count(
                "id",
                filter=Q(is_active=True, is_leader=True),
            ),
            inactive_members=Count(
                "id",
                filter=Q(is_active=False),
            ),
        )

        return Response(metrics)