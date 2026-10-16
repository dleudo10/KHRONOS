from rest_framework import serializers
from apps.intervenors.models import (
    Intervenor
    
)

class IntervenorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervenor
        fields = [
            "id",
            "name",
            "code",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
        
    def validate_code(self, value):
        return value.strip().lower()