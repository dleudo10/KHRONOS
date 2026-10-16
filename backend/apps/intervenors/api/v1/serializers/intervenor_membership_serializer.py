from rest_framework import serializers
from apps.intervenors.models import (
    IntervenorMembership
)

class IntervenorMembershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = IntervenorMembership
        fields = [
            "id",
            "user",
            "intervenor",
            "is_leader",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    
class AddIntervenorMemberSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=128, trim_whitespace=True)
    
    def validate_user_id(self, value):
        if not value:
            raise serializers.ValidationError(
                "El identificador externo es obligatorio."
            )
        return value

class SetIntervenorLeaderSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=128, trim_whitespace=True)
    
class UpdateIntervenorMembershipSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "Debes proporcionar al menos un campo modificable."
            )
        return attrs