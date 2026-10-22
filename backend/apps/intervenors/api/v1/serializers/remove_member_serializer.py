from rest_framework import serializers

class RemoveMemberSerializer(serializers.Serializer):
    membership_id = serializers.IntegerField(min_value=1)