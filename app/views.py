from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Assiduidade,Funcionario
from .serializers import AssiduidadeSerializer,FuncionarioSerializer

class AssiduidadeSaidaUpdateView(APIView):
    """
    View para atualizar apenas o campo 'saida' de um registro de assiduidade.
    """
    def get_object(self, pk):
        try:
            return Assiduidade.objects.get(pk=pk)
        except Assiduidade.DoesNotExist:
            return None

    def put(self, request, pk):
        assiduidade = self.get_object(pk)
        if not assiduidade:
            return Response({"detail": "Registro não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Verifica se 'saida' foi enviado na requisição
        if 'saida' not in request.data:
            return Response({"detail": "O campo 'saida' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        # Atualiza o campo 'saida' do objeto
        assiduidade.saida = request.data['saida']
        assiduidade.save()

        # Serializa a resposta para retornar o registro atualizado
        serializer = AssiduidadeSerializer(assiduidade)
        return Response(serializer.data, status=status.HTTP_200_OK)

# As views existentes continuam inalteradas
class FuncionarioListCreateView(generics.ListCreateAPIView):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer

class FuncionarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer

class AssiduidadeListCreateView(generics.ListCreateAPIView):
    queryset = Assiduidade.objects.all().order_by('-data')
    serializer_class = AssiduidadeSerializer

class AssiduidadeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assiduidade.objects.all()
    serializer_class = AssiduidadeSerializer
