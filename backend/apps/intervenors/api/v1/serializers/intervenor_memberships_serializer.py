from rest_framework import serializers

class OlimpoUserSerializer(serializers.Serializer):
    external_id = serializers.CharField(allow_null=True, required=False)
    full_name = serializers.CharField(allow_null=True, required=False)
    email = serializers.EmailField(allow_null=True, required=False)
    is_active = serializers.BooleanField(required=False)


class IntervenorMembershipsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    intervenor_id = serializers.IntegerField()
    is_leader = serializers.BooleanField()
    membership_active = serializers.BooleanField()
    user = OlimpoUserSerializer(allow_null=True)
    created_at = serializers.DateTimeField()