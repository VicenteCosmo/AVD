from django.urls import path
from .views import (
    batch_config,
    funcionarios_list_create,
    funcionario_detail_update_delete
)

urlpatterns = [
    path('batch-config/', batch_config, name='batch-config'),
    path('funcionarios/', funcionarios_list_create, name='funcionarios-list-create'),
    path('funcionarios/<int:pk>/', funcionario_detail_update_delete, name='funcionario-detail'),
]
