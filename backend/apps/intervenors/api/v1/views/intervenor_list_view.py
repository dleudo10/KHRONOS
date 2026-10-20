from apps.core.views import ReadOnlyViewSet
from rest_framework.decorators import action
from ..serializers import (
    InterventorListSerializer,
    IntervenorSummarySerializer
)
from ..repositories.intervenor_repository import IntervenorRepository 
from rest_framework.response import Response

class IntervenorListViewSet(ReadOnlyViewSet):
    serializer_class = InterventorListSerializer
    search_fields = ["name", "code", "description",]
    filterset_fields = ["is_active",]
    ordering_fields = ["name", "created_at", "updated_at", "total_users",]
    ordering = ["name",]
    
    def get_queryset(self):
        return IntervenorRepository.list_queryset()
    
    @action(detail=False, methods=["get"], url_path="sumary",)
    def summary(self, request):
        data = IntervenorRepository.get_summary()
        serializer = IntervenorSummarySerializer(data)
        return Response(serializer.data)