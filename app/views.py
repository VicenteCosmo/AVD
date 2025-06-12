
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import OTP
from rest_framework import status, generics
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import CreateAPIView, ListAPIView
import face_recognition
import numpy as np
from rest_framework.views import APIView
import base64
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image
import uuid
import os
import random
from datetime import timedelta

from .models import (
    Course, Funcionario, Assiduidade,
    FaceEncoding, FaceImage, Dispensas
)
from io import BytesIO
from .serializers import (
    FuncionarioSerializer, FuncionarioRegisterSerializer,
    SetPasswordSerializer, VerifyOTPSerializer,
    AssiduidadeSerializer, CourseSerializer, CourseUserSerializer,
    FaceImageSerializer, LeaveRequestSerializer, #RegistrarSerializers
)


###class registrar_empresa(generics.CreateAPIView):
    #serializer_class=RegistrarSerializers
    ##permission_classes=[AllowAny]
class FuncionarioCreateView(generics.CreateAPIView):
    
    serializer_class = FuncionarioRegisterSerializer
    permission_classes = [AllowAny] 
class EnviarOTPView(APIView):
   
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            funcionario = Funcionario.objects.get(email=email)
        except Funcionario.DoesNotExist:
            return Response({'detail': 'Funcionário não existe.'},
                            status=status.HTTP_404_NOT_FOUND)

        codigo = get_random_string(length=6, allowed_chars='0123456789')
        OTP.objects.create(funcionario=funcionario, codigo=codigo)

        send_mail(
            subject="Seu código OTP",
            message=f"Olá {funcionario.nome}, Seja Bem-Vindo ao sistema AVD , foste cadastrado com sucesso. O seu código OTP é: {codigo} Faça a verificação para ter a sua conta activa",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[funcionario.email],
            fail_silently=False,
        )
        return Response({'detail': 'OTP enviado.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_otp(request):
    
    serializer = VerifyOTPSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    codigo = serializer.validated_data['otp']

    try:
        otp = OTP.objects.filter(
            funcionario__email=email,
            codigo=codigo,
            usado=False
        ).latest('criado_em')
    except OTP.DoesNotExist:
        return Response({'detail': 'OTP inválido ou expirado.'},
                        status=status.HTTP_400_BAD_REQUEST)

    otp.usado = True
    otp.save()
    return Response({'detail': 'OTP verificado.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def set_password(request):

    serializer = SetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data['email']
    senha = serializer.validated_data['senha']

    funcionario = Funcionario.objects.filter(email=email).first()
    if not funcionario:
        return Response({'detail': 'Funcionário não existe.'},
                        status=status.HTTP_404_NOT_FOUND)

    funcionario.set_password(senha)
    funcionario.save()
    return Response({'detail': 'Senha criada com sucesso.'},
                    status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_do_funcionario(request):
    serializer = FuncionarioSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def courses_list(request):
    if request.method == 'GET':
        courses = Course.objects.all().order_by('-course_init_date')
        serializer = CourseSerializer(courses, many=True)
        return Response({'message': serializer.data})

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("Erro de validação:", serializer.errors)
        return Response({'message': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_available_courses(request):
    courses = Course.objects.all().order_by('-course_init_date')
    serializer = CourseUserSerializer(courses, many=True, context={'request': request})
    return Response({'message': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_course(request, id):
    try:
        course = Course.objects.get(pk=id)
    except Course.DoesNotExist:
        return Response({'error': 'Curso não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    course.enrolled_users.add(request.user)
    return Response({'message': 'Inscrição feita com sucesso!'}, status=status.HTTP_200_OK)
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_course(request, id):
    try:
        course = Course.objects.get(pk=id)
    except Course.DoesNotExist:
        return Response({'error': 'Curso não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CourseSerializer(course, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_course(request, id):
    try:
        course = Course.objects.get(pk=id)
    except Course.DoesNotExist:
        return Response({'error': 'Curso não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    course.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
class FuncionarioListCreate(generics.ListCreateAPIView):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [AllowAny] 
class FuncionarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
    permission_classes = [AllowAny] 

class AssiduidadeList(generics.ListCreateAPIView):
    queryset = Assiduidade.objects.all()
    serializer_class = AssiduidadeSerializer
    permission_classes = [AllowAny] 
class AssiduidadeListCreate(generics.ListCreateAPIView):
    serializer_class = AssiduidadeSerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return Assiduidade.objects.filter(funcionario=self.request.user)
class AssiduidadeRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assiduidade.objects.all()
    serializer_class = AssiduidadeSerializer
    permission_classes = [AllowAny] 

@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def facial_recognition(request):
    try:
        image_data = request.data.get('image')
        if not image_data:
            return Response({'error': 'Imagem não fornecida'}, status=status.HTTP_400_BAD_REQUEST)

        if ';base64,' in image_data:
            _, imgstr = image_data.split(';base64,')
        else:
            imgstr = image_data
        image_bytes = base64.b64decode(imgstr)
        image = face_recognition.load_image_file(BytesIO(image_bytes))
        input_encodings = face_recognition.face_encodings(image)
        if not input_encodings:
            return Response({'error': 'Nenhum rosto detectado'}, status=status.HTTP_400_BAD_REQUEST)
        input_encoding = input_encodings[0]

        tolerance = 0.5

        best_match_id = None
        best_distance = None

        for funcionario in Funcionario.objects.select_related('face_encoding').all():
            if not hasattr(funcionario, 'face_encoding'):
                continue

            known_encoding = np.frombuffer(funcionario.face_encoding.encoding, dtype=np.float64)

            distance = face_recognition.face_distance([known_encoding], input_encoding)[0]

            if best_distance is None or distance < best_distance:
                best_distance = distance
                best_match_id = funcionario.id

        if best_distance is not None and best_distance <= tolerance:
            return Response({'funcionario_id': best_match_id, 'distance': best_distance})

        return Response({'error': 'Funcionário não reconhecido', 'best_distance': best_distance},
                        status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, JSONParser])
def register_face(request):
    try:    
        print(" Dados recebidos no POST:")
        print(request.data)
        if request.FILES.get('image'):
            image_file = request.FILES['image']
            funcionario = request.user          
        else:
            image_data = request.data.get('image')
            nome = request.data.get('funcionario_')
            
            if not image_data or not nome:
                return Response({'error': 'Dados incompletos'}, status=status.HTTP_400_BAD_REQUEST)
            
            if ';base64,' in image_data:
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]
            else:
                imgstr = image_data
                ext = 'jpg'
            
            image_bytes = base64.b64decode(imgstr)
            image_file = ContentFile(image_bytes, name=f"{uuid.uuid4()}.{ext}")
        
        image = face_recognition.load_image_file(image_file)
        face_encodings = face_recognition.face_encodings(image)
        
        if not face_encodings:
            return Response({'error': 'Nenhum rosto detectado'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(face_encodings) > 1:
            return Response({'error': 'Múltiplos rostos detectados'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        face_image = FaceImage(funcionario=funcionario)
        face_image.image.save(image_file.name, image_file)
        face_image.save()
        
        encoding = FaceEncoding.objects.create(
            funcionario=funcionario,
            encoding=face_encodings[0].tobytes()
        )
        
        return Response({
            'success': True
        },status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FaceImageList(generics.ListCreateAPIView):
    queryset = FaceImage.objects.all()
    serializer_class = FaceImageSerializer
    parser_classes = [MultiPartParser]
class FaceImageDetail(generics.RetrieveDestroyAPIView):
    queryset = FaceImage.objects.all()
    serializer_class = FaceImageSerializer
@method_decorator(csrf_exempt, name='dispatch')
class CreateLeaveRequestAPIView(CreateAPIView):
    queryset = Dispensas.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        leave = serializer.save(funcionario=self.request.user)

@method_decorator(csrf_exempt, name='dispatch')
class ListMyLeavesAPIView(ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("Usuário autenticado:", user)
        print("ID:", user.id)
        return Dispensas.objects.filter(funcionario=self.request.user).order_by('-created_at')


@api_view(['GET'])
@permission_classes([AllowAny])
def ListAllLeavesAPIView(request):
    leaves = Dispensas.objects.all().order_by('-created_at')
    serializer = LeaveRequestSerializer(leaves, many=True)
    return Response({'message': serializer.data})


@api_view(['PUT'])
@permission_classes([AllowAny])
def UpdateLeaveStatusAPIView(request, id):
    try:
        leave = Dispensas.objects.get(pk=id)
    except Dispensas.DoesNotExist:
        return Response({'error': 'Pedido não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    status_ = request.data.get('status')
    comment = request.data.get('admin_comentario', '')
    nome=request.data.get('funcionario_nome')    
    if status_ not in ['aprovado', 'rejeitado']:
        print(f"Status inválido recebido: {status_}")
        return Response({'error': 'Status inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
    leave.status = status_
    leave.admin_comentario = comment
    leave.save(update_fields=['status', 'admin_comentario'])
    serializer = LeaveRequestSerializer(leave)
    if status_ == 'aprovado':
        send_mail(
            subject='Sua dispensa foi aprovada',
            message=f"Olá ,\n\nSua dispensa foi aprovada.\n\nComentário do administrador:\n{comment}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[leave.funcionario.email],
            fail_silently=False
        )
    elif status_ =='rejeitado':
        send_mail(
            subject='Sua dispensa foi Reprovada',
            message=f"Olá Caríssimo(a) ,\n\nSua dispensa foi Rejectada.\n\nComentário do administrador:\n{comment}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[leave.funcionario.email],
            fail_silently=False
        )
    serializer = LeaveRequestSerializer(leave)
    return Response({'message': 'Atualizado com sucesso.', 'data': serializer.data})