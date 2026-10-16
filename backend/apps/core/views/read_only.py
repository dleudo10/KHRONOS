from rest_framework import mixins
from .base_view import BaseViewSet


class ReadOnlyViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    BaseViewSet,
):
    pass