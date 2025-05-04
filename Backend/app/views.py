from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Departamento, CampoPersonalizado, Role, Funcionario
from .serializers import (
    DepartmentSerializer, CustomFieldSerializer,
    RoleSerializer, FuncionarioSerializer
)

@api_view(['GET', 'POST'])
def batch_config(request):
    if request.method == 'GET':
        deps = DepartmentSerializer(Departamento.objects.all(), many=True)
        fields = CustomFieldSerializer(CampoPersonalizado.objects.all(), many=True)
        roles = RoleSerializer(Role.objects.all(), many=True)
        return Response({
            'departamentos': deps.data,
            'campos_personalizado': fields.data,
            'roles': roles.data,
        })

    Departamento.objects.all().delete()
    CampoPersonalizado.objects.all().delete()
    Role.objects.all().delete()

    data = request.data
    deps_ser = DepartmentSerializer(data=data.get('departamentos', []), many=True)
    fields_ser = CustomFieldSerializer(data=data.get('campos_personalizado', []), many=True)
    roles_ser = RoleSerializer(data=data.get('roles', []), many=True)

    deps_ser.is_valid(raise_exception=True)
    fields_ser.is_valid(raise_exception=True)
    roles_ser.is_valid(raise_exception=True)

    deps_ser.save()
    fields_ser.save()
    roles_ser.save()

    return Response({'status': 'ok'}, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
def funcionarios_list_create(request):
    if request.method == 'GET':
        qs = Funcionario.objects.all()
        ser = FuncionarioSerializer(qs, many=True)
        return Response(ser.data)

    ser = FuncionarioSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def funcionario_detail_update_delete(request, pk):
    try:
        obj = Funcionario.objects.get(pk=pk)
    except Funcionario.DoesNotExist:
        return Response({'detail': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        ser = FuncionarioSerializer(obj)
        return Response(ser.data)

    if request.method == 'PUT':
        ser = FuncionarioSerializer(obj, data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
