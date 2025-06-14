# app2/urls.py

from django.urls import path
from . import views
from .views import (
    CreateLeaveRequestAPIView,
    ListMyLeavesAPIView,
    ListAllLeavesAPIView,
    UpdateLeaveStatusAPIView,
    facial_recognition
    #registrar_empresa
)
urlpatterns = [
    #path('cadastrar/',registrar_empresa.as_view(), name='cadastro-empresa'),
    
    path(
        'funcionarios/',
        views.FuncionarioCreateView.as_view(),
        name='funcionario-create'
    ),
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

    path(
        'funcionarios/send-otp/',
        views.EnviarOTPView.as_view(),
        name='funcionario-send-otp'
    ),
    path(
        'funcionarios/verify-otp/',
        views.verificar_otp,
        name='funcionario-verify-otp'
    ),
    path(
        'funcionarios/set-password/',
        views.set_password,
        name='funcionario-set-password'
    ),
    path(
        'funcionarios/me/',
        views.perfil_do_funcionario,
        name='funcionario-me'
    ),


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

    path(
        'facial/',
        views.facial_recognition,
        name='facial'
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
