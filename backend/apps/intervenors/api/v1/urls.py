from rest_framework.routers import DefaultRouter
from .views import (
    IntervenorViewSet
)

router = DefaultRouter()
router.register('intervenors', IntervenorViewSet, basename='intervenor')
# router.register('list-intervenors', IntervenorListViewSet, basename='list-intervenor')

urlpatterns = router.urls