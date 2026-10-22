from rest_framework import serializers
from ....models import IntervenorMembership

class CreateIntervenorMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntervenorMembership
        fields = ["user", "is_leader", "intervenor",]
        read_only_fields = ["intervenor",]
        
    def validate(self, attrs):
        intervenor = self.context.get("intervenor")
        user = attrs["user"]

        exists = IntervenorMembership.objects.filter(
            intervenor=intervenor,
            user=user,
            is_active=True,
        ).exists()

        if exists:
            raise serializers.ValidationError({
                "user": "Este usuario ya pertenece a este interventor."
            })

        return attrs