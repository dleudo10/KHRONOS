from django.db.models import (
    Count,
    OuterRef,
    Subquery,
    Q,
    Value,
    IntegerField,
    CharField,
    FloatField,
    Exists,
)
from ....models import (
    Intervenor,
    IntervenorMembership
)

class IntervenorRepository:
    @staticmethod
    def list_queryset():
        leader_query = (
            IntervenorMembership.objects
            .filter(
                intervenor_id=OuterRef("pk"),
                is_active=True,
                is_leader=True,
            )
            .order_by()
            .values("user")[:1]
        )

        return (
            Intervenor.objects
            .annotate(
                total_users=Count(
                    "memberships",
                    filter=Q(memberships__is_active=True),
                    distinct=True,
                ),
                leader=Subquery(leader_query),
                pending=Value(
                    0,
                    output_field=IntegerField(),
                ),
                average=Value(
                    "—",
                    output_field=CharField(),
                ),
                sla=Value(
                    None,
                    output_field=FloatField(),
                ),
                compliance=Value(
                    None,
                    output_field=FloatField(),
                ),
            )
        )
        
    @staticmethod
    def get_summary():
        intervenors = Intervenor.objects.aggregate(
            total_intervenors=Count("id"),
            active_intervenors=Count(
                "id",
                filter=Q(is_active=True),
            ),
        )

        active_memberships = IntervenorMembership.objects.filter(
            is_active=True,
        )

        total_users = (
            active_memberships
            .values("user")
            .distinct()
            .count()
        )

        active_leaders = IntervenorMembership.objects.filter(
            intervenor_id=OuterRef("pk"),
            is_active=True,
            is_leader=True,
        )

        intervenors_without_leader = (
            Intervenor.objects
            .filter(is_active=True)
            .annotate(
                has_active_leader=Exists(active_leaders),
            )
            .filter(has_active_leader=False)
            .count()
        )

        return {
            **intervenors,
            "total_users": total_users,
            "intervenors_without_leader": intervenors_without_leader,
        }
    
    @staticmethod
    def get_memberships(intervenor_id):
        return (
            IntervenorMembership.objects
            .filter(
                intervenor_id=intervenor_id,
            )
            .order_by("user")
        )