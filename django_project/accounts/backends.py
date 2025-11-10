from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrPhoneBackend(ModelBackend):
    """Autentica usando e-mail OU telefone junto com a senha."""
    def authenticate(self, request, username=None, password=None, **kwargs):
        login = username or kwargs.get('login')
        if login is None or password is None:
            return None
        try:
            # Tentar por email
            user = User.objects.get(email__iexact=login)
        except User.DoesNotExist:
            try:
                user = User.objects.get(phone__iexact=login)
            except User.DoesNotExist:
                return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
