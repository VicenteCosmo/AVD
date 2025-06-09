from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.core.files.base import ContentFile
import numpy as np
import base64
import uuid
import os
from datetime import datetime, time, timedelta
import random
# ———————————————— User Manager ————————————————
class FuncionarioManager(BaseUserManager):
    def create_user(self, email, nome, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, nome=nome, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nome, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, nome, password, **extra_fields)

# ———————————————— Usuário (Funcionário) ————————————————
class Funcionario(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    objects = FuncionarioManager()

    def __str__(self):
        return self.nome
    def gerar_otp(self):
        codigo = str(random.randint(100000, 999999))
        OTP.objects.create(funcionario=self, codigo=codigo)
        return codigo
# ———————————————— OTP ————————————————
class OTP(models.Model):
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=6)
    criado_em = models.DateTimeField(default=timezone.now)
    usado = models.BooleanField(default=False)

    class Meta:
        ordering = ['-criado_em']

    def __str__(self):
        return f"{self.funcionario.email} - {self.codigo}"


# ----------------------------
# 2) Cursos
# ----------------------------

class Course(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendente"),
        ("processing", "Em Processamento"),
        ("success", "Concluído"),
        ("failed", "Falhou"),
    ]

    course_name = models.CharField(max_length=200)
    course_description = models.TextField(blank=True)
    course_init_date = models.DateField()
    course_finish_date = models.DateField()
    course_instructors = models.CharField(max_length=200)
    course_requirements = models.TextField(blank=True)
    enrolled_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="cursos_inscritos"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return self.course_name


# ----------------------------
# 3) Reconhecimento Facial
# ----------------------------

def face_image_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("face_images", filename)


class FaceEncoding(models.Model):
    funcionario = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="face_encoding"
    )
    encoding = models.BinaryField()

    def set_encoding(self, encoding_array: np.ndarray):
        # Salva o array numpy como bytes
        self.encoding = encoding_array.tobytes()

    def get_encoding(self) -> np.ndarray:
        return np.frombuffer(self.encoding, dtype=np.float64)


class FaceImage(models.Model):
    funcionario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="face_images"
    )
    image = models.ImageField(upload_to=face_image_path)
    created_at = models.DateTimeField(auto_now_add=True)


# ----------------------------
# 4) Assiduidade
# ----------------------------

class Assiduidade(models.Model):
    funcionario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assiduidades"
    )
    entrada = models.TimeField()
    saida = models.TimeField(blank=True, null=True)
    data = models.DateField(default=timezone.now)
    duracao = models.DurationField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Se houver horário de saída, calcula duração
        if self.saida:
            ent = (
                time.fromisoformat(self.entrada)
                if isinstance(self.entrada, str)
                else self.entrada
            )
            sai = (
                time.fromisoformat(self.saida)
                if isinstance(self.saida, str)
                else self.saida
            )
            dt_ent = datetime.combine(self.data, ent)
            dt_sai = datetime.combine(self.data, sai)
            if dt_sai < dt_ent:
                dt_sai += timedelta(days=1)
            self.duracao = dt_sai - dt_ent
        super().save(*args, **kwargs)


# ----------------------------
# 5) Dispensas (Solicitação de Faltas)
# ----------------------------

class Dispensas(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendente"),
        ("approved", "Aprovada"),
        ("rejected", "Rejeitada"),
    ]

    funcionario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leave_requests"
    )
    motivo = models.TextField()
    inicio = models.DateField()
    fim = models.DateField()
    justificativo = models.FileField(upload_to="justifications/", blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    admin_comentario = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.funcionario.email} - {self.status}"
