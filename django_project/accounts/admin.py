from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ("Informações adicionais", {"fields": ("phone",)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Informações adicionais", {"classes": ("wide",), "fields": ("phone",)}),
    )
