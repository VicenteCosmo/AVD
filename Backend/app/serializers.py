from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Departamento, CampoPersonalizado, Role, Funcionario
from django.utils.dateparse import parse_date

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'name', 'funcionarios']


class Campo_PersonalizadoSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=CampoPersonalizado.objects.all(),
                message="Nome técnico já existe"
            )
        ]
    )

    class Meta:
        model = CampoPersonalizado
        fields = ['id', 'nome', 'label', 'type', 'required', 'opcoes']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'permissoes']


class FuncionarioSerializer(serializers.ModelSerializer):
    dados_personalizados = serializers.JSONField(required=False, default=dict)

    class Meta:
        model = Funcionario
        fields = ['id', 'departamento', 'cargo', 'dados_personalizados', 'criado_em', 'atualizado_em']
        read_only_fields = ['criado_em', 'atualizado_em']

    def validate_dados_personalizados(self, value):
        erros = {}
        for field in CampoPersonalizado.objects.all():
            val = value.get(field.name)
            if field.required and (val in (None, '', [])):
                erros[field.name] = 'Campo obrigatório'
            if val is not None:
                if field.type == 'number' and not isinstance(val, (int, float)):
                    erros[field.name] = 'Deve ser um número'
                if field.type == 'date':
                    try:
                        parse_date(val)
                    except:
                        erros[field.name] = 'Data inválida'
                if field.type == 'select':
                    if field.options and val not in field.options:
                        erros[field.name] = f'Opção inválida. Use: {field.options}'
                if field.type == 'checkbox' and not isinstance(val, bool):
                    erros[field.name] = 'Deve ser verdadeiro ou falso'
        if erros:
            raise serializers.ValidationError(erros)
        return value
