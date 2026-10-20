from rest_framework import serializers
from ....models import Intervenor

class InterventorListSerializer(serializers.ModelSerializer):
    leader = serializers.CharField(read_only=True, allow_null=True)
    total_users = serializers.IntegerField(read_only=True)
    pending = serializers.IntegerField(read_only=True)
    average = serializers.CharField(read_only=True)
    sla = serializers.FloatField(
        read_only=True,
        allow_null=True,
    )
    compliance = serializers.FloatField(
        read_only=True,
        allow_null=True,
    )
    
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
            "leader",
            "total_users",
            "pending",
            "average",
            "sla",
            "compliance",
        ]