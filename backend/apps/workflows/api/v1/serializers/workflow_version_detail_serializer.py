from rest_framework import serializers

from ....models import WorkflowVersion
from .workflow_node_detail_serializer import WorkflowNodeDetailSerializer
from .workflow_transition_detail import WorkflowTransitionDetailSerializer

class WorkflowVersionDetailSerializer(serializers.ModelSerializer):
    nodes_count = serializers.SerializerMethodField()
    transitions_count = serializers.SerializerMethodField()
    nodes = serializers.SerializerMethodField()
    transitions = serializers.SerializerMethodField()

    class Meta:
        model = WorkflowVersion
        fields = [
            "id",
            "version_number",
            "status",
            "created_at",
            "published",
            "updated_at",
            "nodes_count",
            "transitions_count",
            "nodes",
            "transitions",
        ]

    def get_nodes_count(self, obj):
        return len(obj.ordered_nodes)

    def get_transitions_count(self, obj):
        return len(obj.ordered_transitions)

    def get_nodes(self, obj):
        return WorkflowNodeDetailSerializer(
            obj.ordered_nodes,
            many=True,
        ).data

    def get_transitions(self, obj):
        return WorkflowTransitionDetailSerializer(
            obj.ordered_transitions,
            many=True,
        ).data