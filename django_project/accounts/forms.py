from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class RegistrationForm(forms.ModelForm):
    password1 = forms.CharField(label='Senha', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Confirmar senha', widget=forms.PasswordInput)
    name = forms.CharField(label='Nome', max_length=150)

    class Meta:
        model = User
        fields = ('name', 'phone', 'email')

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise ValidationError("As senhas não conferem")
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        # name -> armazenar em first_name para simplicidade
        user.first_name = self.cleaned_data.get('name')
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user

class LoginForm(forms.Form):
    login = forms.CharField(label='E-mail ou Telefone')
    password = forms.CharField(widget=forms.PasswordInput)
