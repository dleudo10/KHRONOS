from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.core.views import SoftDeleteViewSet
from ....models import Workflow
from ..serializers import (
    WorkflowSerializer,
    WorkflowSaveSerializer,
    WorkflowDetailsSerializer,
    WorkflowVersionSaveSerializer
)
from ..repositories.workflows_repository import WorkflowRepository

class WorkflowViewSet(SoftDeleteViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer

    search_fields = ["name", "code", "description",]
    filterset_fields = ["is_active",]
    ordering_fields = ["name", "created_at", "updated_at",]
    ordering = ["-created_at",]
    
    permission_map = {
        "list": "workflows.view_workflow",
        "retrieve": "workflows.view_workflow",
        "create": "workflows.create_workflow",
        "update": "workflows.change_workflow",
        "partial_update": "workflows.change_workflow",
        "change_status": "workflows.change_workflow",
        # "summary": "workflows.view_metrics",
        "versions": "workflows.create_workflow_versions",
    }    

    serializer_action_classes = {
        "list": WorkflowSerializer,
        "retrieve": WorkflowSerializer,
        "details": WorkflowDetailsSerializer,
        "create": WorkflowSaveSerializer, 
        "update": WorkflowSaveSerializer,
        "partial_update": WorkflowSaveSerializer,
        "versions": WorkflowVersionSaveSerializer,
    }

    def get_queryset(self):
        return WorkflowRepository.list_queryset()
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        workflow, version_number = WorkflowRepository.create(
            name=data["name"],
            code=data["code"],
            description=data["description"],
            is_active=data["is_active"]
        )

        output = self.get_serializer(workflow)
        
        response_data = output.data
        response_data["version_number"] = version_number

        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
        )
        
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @action(detail=True, methods=["post"], url_path="versions")
    def versions(self, request, pk=None):
        validation_serializer = self.get_serializer(
            data=request.data,
            context={
                **self.get_serializer_context(),
                "workflow_id": pk
            }
        )
        validation_serializer.is_valid(raise_exception=True)
        results = WorkflowRepository.new_version(workflow_id=pk)
        serializer = self.get_serializer(results)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=["get"], url_path="details")
    def details(self, request, pk=None):
        workflow = WorkflowRepository.details(workflow_id=pk)

        serializer = self.get_serializer(workflow)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )