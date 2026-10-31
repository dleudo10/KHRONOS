from django.db import transaction
from django.db.models import Prefetch
from ....models import (
    Workflow, 
    WorkflowVersion, 
    WorkflowVersionStatus,
    WorkflowNode,
    WorkflowTransition,
    WorkflowNodeTypeChoice
)
from django.shortcuts import get_object_or_404


class WorkflowRepository:
    
    @staticmethod
    @transaction.atomic
    def create(name: str, code: str, description: str, is_active: bool) -> Workflow:
        workflow = Workflow.objects.create(
            name=name,
            code=code,
            description=description,
            is_active=is_active
        )
        
        workflow_version = WorkflowVersion.objects.create(
            workflow=workflow,
            version_number=1,
            status=WorkflowVersionStatus.DRAFT
        )
        
        WorkflowNode.objects.bulk_create([
            WorkflowNode(
                workflow_version=workflow_version,
                name="Alta Médica",
                code="ALT-MED",
                description="Inicio del proceso",
                node_type=WorkflowNodeTypeChoice.START,
                position_x=50,
                position_y=265,
            ),
            WorkflowNode(
                workflow_version=workflow_version,
                name="Cama Disponible",
                code="CAM-DIS",
                description="Fin del proceso",
                node_type=WorkflowNodeTypeChoice.END,
                position_x=350,
                position_y=265,
            ),
        ])
        
        return workflow, workflow_version.id
    
          
    @staticmethod
    def list_queryset():
        return Workflow.objects.prefetch_related(
            Prefetch(
                "versions",
                queryset=WorkflowVersion.objects.order_by("-version_number"),
                to_attr="ordered_versions"
            )
        ).all()
        
    @staticmethod
    def details(workflow_id: int) -> Workflow:
        versions_queryset = (
            WorkflowVersion.objects
            .order_by("-version_number")
            .prefetch_related(
                Prefetch(
                    "nodes",
                    queryset=WorkflowNode.objects.order_by("id"),
                    to_attr="ordered_nodes",
                ),
                Prefetch(
                    "transitions",
                    queryset=WorkflowTransition.objects.select_related(
                        "source_node",
                        "target_node",
                    ).order_by("id"),
                    to_attr="ordered_transitions",
                ),
            )
        )

        queryset = Workflow.objects.prefetch_related(
            Prefetch(
                "versions",
                queryset=versions_queryset,
                to_attr="ordered_versions",
            )
        )

        return get_object_or_404(queryset, pk=workflow_id)
    
    @staticmethod
    @transaction.atomic
    def new_version(workflow_id: int) -> WorkflowVersion:
        workflow = Workflow.objects.get(pk=workflow_id)
        
        latest_version_number = (
            WorkflowVersion.objects
            .filter(workflow=workflow)
            .order_by("-version_number")
            .values_list("version_number", flat=True)
            .first()
        ) or 0
        
        workflow_version = WorkflowVersion.objects.create(
            workflow=workflow,
            version_number=latest_version_number + 1,
            status=WorkflowVersionStatus.DRAFT,
        )
        
        WorkflowNode.objects.bulk_create([
            WorkflowNode(
                workflow_version=workflow_version,
                name="Alta Médica",
                code="ALT-MED",
                description="Inicio del proceso",
                node_type=WorkflowNodeTypeChoice.START,
                position_x=50,
                position_y=265,
            ),
            WorkflowNode(
                workflow_version=workflow_version,
                name="Cama Disponible",
                code="CAM-DIS",
                description="Fin del proceso",
                node_type=WorkflowNodeTypeChoice.END,
                position_x=350,
                position_y=265,
            ),
        ])
        
        return workflow_version  
    
    @staticmethod
    def save_draft(workflow_id: int, workflow_version_id: int):
        workflow_version = WorkflowVersion.objects.get(
            workflow=workflow_id,
            pk=workflow_version_id
        )
        
        