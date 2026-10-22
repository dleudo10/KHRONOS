from django.db import transaction
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
from ....olimpo_directory_client import OlimpoDirectoryClient

class IntervenorRepository:
    @staticmethod
    def list_queryset() -> Intervenor:
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
    def get_summary() -> object:
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
    def get_memberships(intervenor_id: int, access_token):
        memberships = list(
            IntervenorMembership.objects.filter(
                intervenor=intervenor_id,
                is_active=True,
            ).order_by("id")
        )
        
        external_ids = list({
            membership.user
            for membership in memberships
        })
        
        profiles = OlimpoDirectoryClient.lookup_users(
            external_ids=external_ids,
            access_token=access_token
        )
        
        results = []
        
        for membership in memberships:
            profile = profiles.get(membership.user)
            print(profile)
            
            results.append({
                "id": membership.pk,
                "intervenor_id": membership.intervenor_id,
                "is_leader": membership.is_leader,
                "membership_active": membership.is_active,
                "user": profile,
                "created_at": membership.created_at,
            })
            
        return results
        
    @staticmethod
    @transaction.atomic
    def add_member(intervenor_id: int, user: str, is_leader: bool = False) -> IntervenorMembership:
        membership = IntervenorMembership.objects.filter(
            intervenor_id=intervenor_id,
            user=user,
            is_active=False,
        ).order_by("-id").first()

        if is_leader:
            IntervenorMembership.objects.filter(
                intervenor_id=intervenor_id,
                is_active=True,
                is_leader=True,
            ).update(is_leader=False)

        if membership:
            membership.is_active = True
            membership.is_leader = is_leader
            membership.save(update_fields=["is_active", "is_leader"])
            return membership

        return IntervenorMembership.objects.create(
            intervenor_id=intervenor_id,
            user=user,
            is_leader=is_leader,
        )
        
    @staticmethod
    @transaction.atomic
    def handle_leader(
        intervenor_id: int,
        membership_id: int,
        is_leader: bool,
    ) -> IntervenorMembership:
        membership = IntervenorMembership.objects.get(
            pk=membership_id,
            intervenor_id=intervenor_id,
            is_active=True,
        )

        if is_leader:
            IntervenorMembership.objects.filter(
                intervenor_id=intervenor_id,
                is_active=True,
                is_leader=True,
            ).exclude(pk=membership.pk).update(is_leader=False)

        membership.is_leader = is_leader
        membership.save(update_fields=["is_leader"])

        return membership
    
    @staticmethod
    @transaction.atomic
    def remove_member(
        intervenor_id: int,
        membership_id: int,
    ) -> IntervenorMembership:
        membership = IntervenorMembership.objects.get(
            pk=membership_id,
            intervenor_id=intervenor_id,
            is_active=True,
        )

        membership.is_active = False
        membership.is_leader = False
        membership.save(update_fields=["is_active", "is_leader"])

        return membership