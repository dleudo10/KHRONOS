from .base_view import BaseViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from rest_framework import mixins

class SoftDeleteViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    BaseViewSet,
):
    @action(detail=True, methods=["patch"], url_path="status")
    @transaction.atomic
    def change_status(self, request, pk=None):
        instance = self.get_object()

        requested = request.data.get("is_active")
        new_state = not instance.is_active if requested is None else bool(requested)

        if instance.is_active != new_state:
            self._call_hook("before_status_change", instance, new_state)
            instance.set_active(new_state, user=request.user)
            self._call_hook("after_status_change", instance, new_state)

        return Response(self.get_serializer(instance).data)