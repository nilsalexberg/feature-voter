from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, EmailTokenObtainPairSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Send email via console/mock backend
            reset_link = f"http://localhost:5173/reset-password/{uidb64}/{token}"
            send_mail(
                subject="Password Reset Request",
                message=f"Use this link to reset password: {reset_link}",
                from_email="noreply@example.com",
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            # Silently succeed to prevent email enumeration
            pass

        return Response(
            {"detail": "If account exists, password reset link has been sent."},
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )
