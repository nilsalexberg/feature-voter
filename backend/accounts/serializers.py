from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate(self, data):
        try:
            uid = force_str(urlsafe_base64_decode(data['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uidb64": "Invalid user ID"})

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError({"token": "Invalid or expired token"})

        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['password'])
        user.save()
        return user
