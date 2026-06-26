from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, FeatureRequestViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("feature-requests", FeatureRequestViewSet, basename="featurerequest")

urlpatterns = router.urls
