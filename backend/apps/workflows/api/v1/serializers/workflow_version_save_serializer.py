from rest_framework import serializers
from ....models import WorkflowVersion, WorkflowVersionStatus

class WorkflowVersionSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowVersion
        fields = [
            "id",
            "version_number",
            "status",
            "created_at"
        ]
        
    def validate(self, attrs):
        workflow_id = self.context.get("workflow_id")

        has_draft = WorkflowVersion.objects.filter(
            workflow_id=workflow_id,
            status=WorkflowVersionStatus.DRAFT
        ).exists()

        if has_draft:
            raise serializers.ValidationError({
                "detail": "No se puede crear una nueva versión porque ya existe una versión en borrador."
            })

        return attrs