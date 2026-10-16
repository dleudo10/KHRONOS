from rest_framework import mixins
from .base_view import BaseViewSet


class CreateViewSet(
    mixins.CreateModelMixin,
    BaseViewSet,
):
    pass