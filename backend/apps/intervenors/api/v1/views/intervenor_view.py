from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.views import SoftDeleteViewSet
from apps.intervenors.models import (
    Intervenor, 
)
from ..serializers import (
    IntervenorSerializer,
    InterventorListSerializer,
    IntervenorSummarySerializer,
    IntervenorMembershipsSerializer
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
    #     "retrieve": "intervenors.view_intervenor",
        "create": "intervenors.create_intervenor",
        "update": "intervenors.change_intervenor",
        "partial_update": "intervenors.change_intervenor",
    #     "destroy": "intervenors.change_intervenor",
    #     "restore": "intervenors.change_intervenor",
    #     "members": "intervenors.view_intervenor",
    #     "add_member": "intervenors.manage_members",
    #     "member_detail": "intervenors.manage_members",
    #     "leader": "intervenors.manage_leader",
    #     "metrics": "intervenors.view_metrics",
        "summary": "intervenors.view_intervenor",
        "memberships": "intervenors.view_intervenor",
    }    

    serializer_action_classes = {
        "list": InterventorListSerializer,
        "create": IntervenorSerializer,
        "update": IntervenorSerializer,
        "summary": IntervenorSummarySerializer,
        "memberships": IntervenorMembershipsSerializer,
    }

    def get_queryset(self):
        return IntervenorRepository.list_queryset()
    
    @action(detail=False, methods=["get"], url_path="summary",)
    def summary(self, request):
        data = IntervenorRepository.get_summary()
        serializer = self.get_serializer(data)
        return Response(serializer.data)
    
    @action(detail=True, methods=["get"], url_path="memberships",)
    def memberships(self, request, pk=None):
        intervenor = get_object_or_404(Intervenor, pk=pk)
        data = IntervenorRepository.get_memberships(intervenor_id=intervenor.pk)
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)