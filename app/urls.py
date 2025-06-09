# app2/urls.py

from django.urls import path
from . import views
from .views import (
    CreateLeaveRequestAPIView,
    ListMyLeavesAPIView,
    ListAllLeavesAPIView,
    UpdateLeaveStatusAPIView,
)
urlpatterns = [
    # ——— FUNCIONÁRIOS & OTP & SENHA ——————————————————————————
    # Cria funcionário (só admin pode): gera e envia OTP
    path(
        'funcionarios/',
        views.FuncionarioCreateView.as_view(),
        name='funcionario-create'
    ),
    # (Opcional) Listar/atualizar/remover funcionários, se você quiser:
    path(
        'funcionarios/all/',
        views.FuncionarioListCreate.as_view(),
        name='funcionario-list'
    ),
    path(
        'funcionarios/<int:pk>/',
        views.FuncionarioRetrieveUpdateDestroy.as_view(),
        name='funcionario-detail'
    ),

    # Login inicial: envia novo OTP
    path(
        'funcionarios/send-otp/',
        views.EnviarOTPView.as_view(),
        name='funcionario-send-otp'
    ),
    # Verifica o código OTP
    path(
        'funcionarios/verify-otp/',
        views.verificar_otp,
        name='funcionario-verify-otp'
    ),
    # Cria a senha após OTP validado
    path(
        'funcionarios/set-password/',
        views.set_password,
        name='funcionario-set-password'
    ),
    # Retorna dados do funcionário autenticado
    path(
        'funcionarios/me/',
        views.perfil_do_funcionario,
        name='funcionario-me'
    ),


    # ——— ASSIDUIDADE ——————————————————————————————————————
    path(
        'assiduidade/',
        views.AssiduidadeListCreate.as_view(),
        name='assiduidade-list-create'
    ),
    path(
        'assiduidade/<int:pk>/',
        views.AssiduidadeRetrieveUpdateDestroy.as_view(),
        name='assiduidade-detail'
    ),
    path(
        'assiduidade/todos/',
        views.AssiduidadeList.as_view(),
        name='assiduidade-l-create'
    ),
    # ——— CURSOS ————————————————————————————————————————————
    path(
        'get_courses/',
        views.courses_list,
        name='courses-list-create'
    ),
    path(
        'courses/<int:id>/',
        views.update_course,
        name='courses-update'
    ),
    path(
        'courses/<int:id>/delete/',
        views.delete_course,
        name='courses-delete'
    ),
    path(
        'courses/available/',
        views.list_available_courses,
        name='courses-available'
    ),
    path(
        'courses/enroll/<int:id>/',
        views.enroll_in_course,
        name='courses-enroll'
    ),

    # ——— RECONHECIMENTO FACIAL —————————————————————————————
    path(
        'facial_recognition/',
        views.facial_recognition,
        name='face-recognition'
    ),
    path(
        'register_face/',
        views.register_face,
        name='face-register'
    ),
    path(
        'face/images/',
        views.FaceImageList.as_view(),
        name='face-image-list'
    ),
    path(
        'face/images/<int:pk>/',
        views.FaceImageDetail.as_view(),
        name='face-image-detail'
    ),

    # ——— DISPENSAS (Leave Requests) —————————————————————————
    path(
        'dispensa/create/',
        CreateLeaveRequestAPIView.as_view(),
        name='leave-create'
    ),
    path(
        'dispensa/my/',
        ListMyLeavesAPIView.as_view(),
        name='leave-my'
    ),
    path(
        'leaves/all/',
        ListAllLeavesAPIView,
        name='leave-all'
    ),
    path(
        'leaves/update/<int:id>/',
        UpdateLeaveStatusAPIView,
        name='leave-update'
    ),
]
