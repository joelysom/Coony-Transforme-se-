from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Mantemos os campos de username padrão, mas tornamos o email único
    email = models.EmailField('email address', unique=True)
    phone = models.CharField('telefone', max_length=20, unique=True, null=True, blank=True)

    def __str__(self):
        return self.get_full_name() or self.username or self.email
