from rest_framework.routers import DefaultRouter
from .views import (
    IntervenorViewSet
)

router = DefaultRouter()
router.register('intervenors', IntervenorViewSet, basename='intervenor')

urlpatterns = router.urls