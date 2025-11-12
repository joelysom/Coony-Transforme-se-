Mini-projeto Django com app `accounts` demonstrando cadastro e login por email ou telefone.

Passos rápidos (Windows PowerShell):

1. Criar e ativar ambiente virtual

    python -m venv .venv; .\.venv\Scripts\Activate.ps1

2. Instalar dependências

    pip install -r django_project\requirements.txt

3. Aplicar migrações

    python django_project\manage.py migrate

4. Criar superusuário (opcional)

    python django_project\manage.py createsuperuser

5. Rodar servidor

    python django_project\manage.py runserver

A aplicação inclui um app `accounts` com:
- `CustomUser` (extende AbstractUser e adiciona `phone`)
- formulário de registro (nome, telefone, email, senha, confirmar senha)
- autenticação permitindo login por telefone ou email

Arquivos principais: `django_project/`, `django_project/manage.py`, `django_project/django_project/`, `django_project/accounts/`, `django_project/templates/`.
