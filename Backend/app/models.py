#AVD
from django.db import models

class Departamento(models.Model):
    name = models.CharField(max_length=100)
    funcionarios = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class CampoPersonalizado(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    label = models.CharField(max_length=150)
    type = models.CharField(max_length=50)
    required = models.BooleanField(default=False)
    opcoes = models.JSONField(null=True, blank=True)  
    def __str__(self):
        return self.label


class Role(models.Model):
    name = models.CharField(max_length=100)
    permissoes = models.JSONField(default=list)

    def __str__(self):
        return self.name


class Funcionario(models.Model):
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, null=True)
    cargo = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)
    dados_personalizados = models.JSONField(default=dict)
    criado_em = models.DateTimeField(auto_now_add=True, null=True)
    atualizado_em = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"Funcionário {self.id}"
