from django.db import models
from django.utils import timezone
TIPO_CONTRATO_ESCOLHAS = (
    ('efectivo', 'Efetivo'),
    ('temporario', 'Temporário'),
    ('estagio', 'Estágio'),
)

SITUACAO_ESCOLHAS = (
    ('activo', 'Ativo'),
    ('inactivo', 'Inativo'),
)
GENERO_ESCOLHAS = (
    ('masculino','Masculino'),
    ('femenino','Femenino'),
)
ESTADO_ESCOLHAS = (
    ('solteiro','Solteiro'),
    ('casado','Casado'),
)
class Funcionario(models.Model):
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    cargo = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)
    data_admissao = models.DateField()
    data_Nascimento = models.DateField(null=True, blank=True)
    area_atuacao = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    Genero = models.CharField(max_length=10, choices=GENERO_ESCOLHAS, null=True, blank=True)
    Estado_Civil = models.CharField(max_length=10, choices=ESTADO_ESCOLHAS, null=True, blank=True)
    tipo_contrato = models.CharField(max_length=10, choices=TIPO_CONTRATO_ESCOLHAS, null=True, blank=True)
    iban = models.CharField(max_length=35, null=True,blank=True)
    nss = models.CharField(max_length=20, null=True,blank=True)
    bi = models.CharField(max_length=20,  null=True, blank=True)
    Nivel_academico = models.CharField(max_length=255, null=True, blank=True)
    Situacao_actual = models.CharField(max_length=10, choices=SITUACAO_ESCOLHAS, default='activo')
    formacao_Profissional = models.CharField(max_length=200, null=True, blank=True)
    foto = models.ImageField(upload_to='funcionarios/fotos/', null=True, blank=True)

    def __str__(self):
        return self.nome
class Assiduidade(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='assiduidade')
    entrada = models.TimeField()
    saida = models.TimeField(null=True, blank=True)
    data = models.DateField(default=timezone.now)
    duracao = models.DurationField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Se ambas as horas estiverem preenchidas, calcula a duração
        if self.entrada and self.saida:
            from datetime import datetime
            dt_entrada = datetime.combine(self.data, self.entrada)
            dt_saida = datetime.combine(self.data, self.saida)
            self.duracao = dt_saida - dt_entrada
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.funcionario.nome} - {self.data}"