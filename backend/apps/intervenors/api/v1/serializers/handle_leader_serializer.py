from rest_framework import serializers

class HandleLeaderSerializer(serializers.Serializer):
    membership_id = serializers.IntegerField(min_value=1)
    is_leader = serializers.BooleanField()
