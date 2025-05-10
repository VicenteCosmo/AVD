from rest_framework import serializers
from .models import Funcionario, Assiduidade

class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionario
        fields = '__all__'
class AssiduidadeSerializer(serializers.ModelSerializer):
    funcionario_nome = serializers.CharField(source="funcionario.nome", read_only=True)

    class Meta:
        model = Assiduidade
        fields = '__all__'