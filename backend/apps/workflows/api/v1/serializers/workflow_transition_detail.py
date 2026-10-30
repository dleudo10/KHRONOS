from rest_framework import serializers

from ....models import WorkflowTransition

class WorkflowTransitionDetailSerializer(serializers.ModelSerializer):
    source_node_name = serializers.CharField(
        source="source_node.name",
        read_only=True,
    )
    target_node_name = serializers.CharField(
        source="target_node.name",
        read_only=True,
    )

    class Meta:
        model = WorkflowTransition
        fields = [
            "id",
            "source_node",
            "source_node_name",
            "target_node",
            "target_node_name",
            "condition_type",
            "condition_config",
        ]