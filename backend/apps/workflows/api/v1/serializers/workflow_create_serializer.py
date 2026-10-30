from rest_framework import serializers
from ....models import Workflow

class WorkflowSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = [
            "id",
            "name", 
            "code", 
            "description", 
            "is_active"
        ]