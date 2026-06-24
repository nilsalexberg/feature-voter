from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core import mail

class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword123'
        )
        self.login_url = reverse('token_obtain_pair')
        self.me_url = reverse('me')
        self.forgot_url = reverse('forgot_password')
        self.reset_url = reverse('reset_password')

    def test_login_success(self):
        data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid(self):
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        data = {'username': 'testuser', 'password': 'testpassword123'}
        login_res = self.client.post(self.login_url, data, format='json')
        token = login_res.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'testuser@example.com')

    def test_forgot_password_user_exists(self):
        mail.outbox = []
        data = {'email': 'testuser@example.com'}
        response = self.client.post(self.forgot_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Password Reset Request', mail.outbox[0].subject)

    def test_forgot_password_user_does_not_exist(self):
        mail.outbox = []
        data = {'email': 'unknown@example.com'}
        response = self.client.post(self.forgot_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_password_success(self):
        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        data = {
            'uidb64': uidb64,
            'token': token,
            'password': 'newpassword789'
        }
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword789'))

    def test_reset_password_invalid_token(self):
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        data = {
            'uidb64': uidb64,
            'token': 'invalid-token-123',
            'password': 'newpassword789'
        }
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
