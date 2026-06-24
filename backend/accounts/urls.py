from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import MeView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
