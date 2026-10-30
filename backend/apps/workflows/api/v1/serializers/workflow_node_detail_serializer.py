from rest_framework import serializers

from ....models import WorkflowNode


class WorkflowNodeDetailSerializer(serializers.ModelSerializer):
    interventor_id = serializers.IntegerField(
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = WorkflowNode
        fields = [
            "id",
            "name",
            "code",
            "description",
            "node_type",
            "interventor_id",
            "expected_duration_minutes",
            "sla_minutes",
            "position_x",
            "position_y",
            "configuration",
            "created_at",
        ]