from rest_framework.routers import DefaultRouter

from .views import FeatureRequestViewSet

router = DefaultRouter()
router.register("feature-requests", FeatureRequestViewSet, basename="featurerequest")

urlpatterns = router.urls
