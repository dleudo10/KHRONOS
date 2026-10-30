from rest_framework import serializers
from ....models import Workflow
from .workflow_version_detail_serializer import WorkflowVersionDetailSerializer
from .workflow_summary_serializer import WorkflowSummarySerializer

class WorkflowDetailsSerializer(serializers.ModelSerializer):
    versions = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()

    class Meta:
        model = Workflow
        fields = [
            "id",
            "name",
            "code",
            "description",
            "is_active",
            "versions",
            "summary",
        ]

    def get_versions(self, obj):
        return WorkflowVersionDetailSerializer(
            obj.ordered_versions,
            many=True,
        ).data

    def get_summary(self, obj):
        return WorkflowSummarySerializer(obj).data