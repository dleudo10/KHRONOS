from rest_framework import serializers

class IntervenorSummarySerializer(serializers.Serializer):
    total_intervenors = serializers.IntegerField()
    active_intervenors = serializers.IntegerField()
    total_users = serializers.IntegerField()
    intervenors_without_leader = serializers.IntegerField()
