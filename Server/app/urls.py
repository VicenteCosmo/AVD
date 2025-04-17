from django.urls import path
from .views import AssiduidadeSaidaUpdateView, FuncionarioListCreateView, FuncionarioRetrieveUpdateDestroyView, AssiduidadeListCreateView,AssiduidadeRetrieveUpdateDestroyView

urlpatterns = [
    path('funcionarios/', FuncionarioListCreateView.as_view(), name="funcionario-list-create"),
    path('funcionarios/<int:pk>/', FuncionarioRetrieveUpdateDestroyView.as_view(), name="funcionario-detail"),
    path('assiduidade/', AssiduidadeListCreateView.as_view(), name="assiduidade-list-create"),
    path('assiduidade/<int:pk>/', AssiduidadeRetrieveUpdateDestroyView.as_view(), name="assiduidade-detail"),
     path('assiduidade/<int:pk>/', AssiduidadeRetrieveUpdateDestroyView.as_view(), name='assiduidade-detail'),
    path('assiduidade/<int:pk>/saida/', AssiduidadeSaidaUpdateView.as_view(), name='assiduidade-saida-update'), 
]