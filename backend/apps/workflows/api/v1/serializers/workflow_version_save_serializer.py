from rest_framework import serializers
from ....models import WorkflowVersion

class WorkflowVersionSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowVersion
        fields = [
            "id",
            "version_number",
            "status",
            "created_at"
        ]