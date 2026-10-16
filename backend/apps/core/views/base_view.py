from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter
)
from apps.core.mixin import ResponseWrapperMixin
from ..pagination import CustomPagination
from ..permissions import HasPermission
from ..authentication import OIDCAuthentication

class BaseViewSet(
    ResponseWrapperMixin,
    viewsets.GenericViewSet
):
    # -------------------------
    # CONFIGURACIÓN
    # -------------------------
    pagination_class = CustomPagination
    permission_classes = [HasPermission]
    
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    search_fields = []
    filterset_fields = []
    ordering_fields = []
    ordering = []
    
    action_querysets = {}
    serializer_action_classes = {}
    
    permission_action_classes = {}
    permission_map = {}
    
    wrap_response = True
    wrap_response_actions = {}
    
    authentication_classes = [OIDCAuthentication, ]
    
    # -------------------------
    # QUERY POR ACCIÓN
    # -------------------------
    def get_queryset(self):

        action = getattr(self, "action", None)
        queryset = self.action_querysets.get(action)

        if queryset is not None:
            return queryset

        return super().get_queryset()
    
    # -------------------------
    # PERMISOS POR ACCIÓN
    # -------------------------
    def get_permissions(self):
        base_permissions = [p() for p in self.permission_classes]

        if hasattr(self, "action"):
            extra_permissions = self.permission_action_classes.get(self.action)
            if extra_permissions:
                return base_permissions + [p() for p in extra_permissions]

        return base_permissions
    
    # -------------------------
    # SERIALIZER POR ACCIÓN
    # -------------------------
    def get_serializer_class(self):
        if hasattr(self, "action"):
            return self.serializer_action_classes.get(
                self.action,
                super().get_serializer_class()
            )
        return super().get_serializer_class()
    
    
    
    # -------------------------
    # HOOK RUNNER
    # -------------------------
    def _call_hook(self, hook_name, *args, **kwargs):
        method = getattr(self, hook_name, None)

        if callable(method):
            return method(*args, **kwargs)
        
        
    # -------------------------
    # OVERRIDES LIMPIOS
    # -------------------------
    def perform_create(self, serializer):
        self._call_hook("before_create", serializer)
        serializer.save()
        self._call_hook("after_create", serializer)

    def perform_update(self, serializer):
        self._call_hook("before_update", serializer)
        serializer.save()
        self._call_hook("after_update", serializer)

    def perform_destroy(self, instance):
        self._call_hook("before_destroy", instance)
        instance.delete()
        self._call_hook("after_destroy", instance)