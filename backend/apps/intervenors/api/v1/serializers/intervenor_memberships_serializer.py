from rest_framework import serializers
from ....models import IntervenorMembership

class IntervenorMembershipsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntervenorMembership
        fields = [
            "id",
            "user",
            "intervenor",
            "is_leader",
        ]