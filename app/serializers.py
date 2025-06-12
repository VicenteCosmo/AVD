# serializers.py

from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings

from .models import (
    Funcionario, Assiduidade,
    FaceImage, Course, Dispensas # Registrar_Empresa
)

#class RegistrarSerializers(serializers.ModelSerializer):
 #   class Meta:
  #     model=Registrar_Empresa
   #    fields='__all__'

class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionario
        fields = ['id', 'nome', 'email','is_admin']


class FuncionarioRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionario
        fields = ['id', 'nome', 'email']
        read_only_fields = ['id']

    def create(self, validated_data):
        funcionario = Funcionario.objects.create_user(
            email=validated_data['email'],
            nome=validated_data['nome'],
            password=None
        )
        codigo = funcionario.gerar_otp()
        send_mail(
            subject="Seu código OTP",
            message=f"Olá {funcionario.nome}, seu código OTP é: {codigo} http://localhost:3000//verificar-otp?email={funcionario.email}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[funcionario.email],
            fail_silently=False,
        )
        return funcionario


class VerifyOTPSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class SetPasswordSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    senha = serializers.CharField(min_length=6, write_only=True)

    def validate(self, attrs):
        try:
            funcionario = Funcionario.objects.get(email=attrs['email'])
        except Funcionario.DoesNotExist:
            raise serializers.ValidationError("Funcionário não existe.")
        
        attrs['funcionario_obj'] = funcionario
        return attrs

    def save(self, **kwargs):
        funcionario = self.validated_data['funcionario_obj']
        senha = self.validated_data['senha']
        funcionario.set_password(senha)
        funcionario.save(update_fields=['password'])
        return funcionario



class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'course_name', 'course_description',
            'course_init_date', 'course_finish_date',
            'course_instructors', 'course_requirements', 'status',
        ]
        read_only_fields = ['id']


class CourseUserSerializer(CourseSerializer):
    is_enrolled = serializers.SerializerMethodField()

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['is_enrolled']

    def get_is_enrolled(self, obj):
        user = self.context['request'].user
        return obj.enrolled_users.filter(pk=user.pk).exists()



class AssiduidadeSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nome', read_only=True)

    class Meta:
        model = Assiduidade
        fields = ['id', 'funcionario', 'funcionario_nome', 'entrada', 'saida', 'data', 'duracao']
        extra_kwargs = {
            'funcionario': {'required': True},
            'entrada': {'required': True},
            'data': {'required': True},
        }


# ——— 4) RECONHECIMENTO FACIAL (apenas imagem) ——————————

class FaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceImage
        fields = ['id', 'funcionario', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']



class LeaveRequestSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source='funcionario.nome', read_only=True)

    class Meta:
        model = Dispensas
        fields = [
            'id', 'funcionario_nome',
            'motivo', 'inicio', 'fim', 'justificativo',
            'status', 'admin_comentario', 'created_at'
        ]
        read_only_fields = ['status', 'admin_comentario', 'created_at', 'funcionario_nome']
