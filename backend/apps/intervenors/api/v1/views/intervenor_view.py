from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from utils.get_bearer_token import get_bearer_token
from apps.core.views import SoftDeleteViewSet
from apps.intervenors.models import (
    Intervenor, 
)
from ..serializers import (
    IntervenorSerializer,
    InterventorListSerializer,
    IntervenorSummarySerializer,
    IntervenorMembershipsSerializer,
    CreateIntervenorMembershipSerializer,
    HandleLeaderSerializer,
    RemoveMemberSerializer,
)

from ..repositories.intervenor_repository import IntervenorRepository 

class IntervenorViewSet(SoftDeleteViewSet):
    queryset = Intervenor.objects.all()
    serializer_class = IntervenorSerializer

    search_fields = ["name", "code", "description",]
    filterset_fields = ["is_active",]
    ordering_fields = ["name", "created_at", "updated_at", "total_users",]
    ordering = ["name",]
    
    permission_map = {
        "list": "intervenors.view_intervenor",
        "retrieve": "intervenors.view_intervenor",
        "create": "intervenors.create_intervenor",
        "update": "intervenors.change_intervenor",
        "partial_update": "intervenors.change_intervenor",
        "change_status": "intervenors.change_intervenor",
        "summary": "intervenors.view_intervenor",
        "add_member": "intervenors.manage_members",
        "memberships": "intervenors.view_intervenor",
        "handle_leader": "intervenors.manage_members",
        "remove_member": "intervenors.manage_members",
    }    

    serializer_action_classes = {
        "list": InterventorListSerializer,
        "create": IntervenorSerializer,
        "update": IntervenorSerializer,
        "summary": IntervenorSummarySerializer,
        "add_member": CreateIntervenorMembershipSerializer,
        "memberships": IntervenorMembershipsSerializer,
        "handle_leader": HandleLeaderSerializer,
        "remove_member": RemoveMemberSerializer,
    }

    def get_queryset(self):
        return IntervenorRepository.list_queryset()
    
    @action(detail=False, methods=["get"], url_path="summary",)
    def summary(self, request):
        data = IntervenorRepository.get_summary()
        serializer = self.get_serializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"], url_path="memberships",)
    def memberships(self, request, pk=None):
        intervenor = get_object_or_404(Intervenor, pk=pk)
        access_token = get_bearer_token(request=request)
        
        results = IntervenorRepository.get_memberships(intervenor_id=intervenor, access_token=access_token)
        search = request.query_params.get("search", "").strip().casefold()
        is_active = request.query_params.get("is_active")
        is_leader = request.query_params.get("is_leader")
        
        if search:
            results = [
                item for item in results
                if item["user"] and any(
                    search in str(item["user"].get(field) or "").casefold()
                    for field in ("external_id", "full_name", "email")
                )
            ]
        
        if is_active is not None:
            active = is_active.lower() in ("true", "1")
            results = [
                item for item in results
                if item["user"] is not None
                and item["user"].get("is_active") is active
            ]

        if is_leader is not None:
            leader = is_leader.lower() in ("true", "1")
            results = [
                item for item in results
                if item["is_leader"] is leader
            ]
        
        page = self.paginate_queryset(results)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"], url_path="add_member",)
    def add_member(self, request, pk=None):
        intervenor = get_object_or_404(Intervenor, pk=pk)
        serializer = self.get_serializer(
            data=request.data,
            context={
                **self.get_serializer_context(),
                "intervenor": intervenor,
            },
        )
        serializer.is_valid(raise_exception=True)
        
        membership = IntervenorRepository.add_member(
            intervenor_id=intervenor.pk,
            user=serializer.validated_data["user"],
            is_leader=serializer.validated_data["is_leader"],
        )
        return Response(
            CreateIntervenorMembershipSerializer(membership).data, 
            status=status.HTTP_200_OK
        )
        
    @action(detail=True, methods=["post"], url_path="handle_leader",)
    def handle_leader(self, request, pk=None):
        intervenor = get_object_or_404(Intervenor, pk=pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            membership = IntervenorRepository.handle_leader(
                intervenor_id=intervenor.pk,
                membership_id=serializer.validated_data["membership_id"],
                is_leader=serializer.validated_data["is_leader"],
            )
        except IntervenorMembership.DoesNotExist:
            raise NotFound(
                "No se encontró una asociación activa para este interventor."
            )

        return Response(
            {
                "id": membership.pk,
                "intervenor_id": membership.intervenor_id,
                "user": membership.user,
                "is_leader": membership.is_leader,
            },
            status=status.HTTP_200_OK,
        )
    
    @action(detail=True, methods=["post"], url_path="remove_member")
    def remove_member(self, request, pk=None):
        intervenor = get_object_or_404(Intervenor, pk=pk)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            membership = IntervenorRepository.remove_member(
                intervenor_id=intervenor.pk,
                membership_id=serializer.validated_data["membership_id"],
            )
        except IntervenorMembership.DoesNotExist:
            raise NotFound(
                "No se encontró una asociación activa para este interventor."
            )

        return Response(
            {
                "detail": "Usuario retirado del equipo correctamente.",
                "membership_id": membership.pk,
            },
            status=status.HTTP_200_OK,
        )