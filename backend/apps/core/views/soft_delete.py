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
    @transaction.atomic
    def perform_destroy(self, instance):
 
        self._call_hook("before_destroy", instance)

        instance.soft_delete(
            user=self.request.user
        )

        self._call_hook("after_destroy", instance)
        
    @transaction.atomic
    @action(detail=True, methods=["patch"])
    def restore(self, request, pk=None):

        instance = self.get_object()

        self._call_hook("before_restore", instance)

        instance.restore(
            user=request.user
        )

        self._call_hook("after_restore", instance)

        return Response()