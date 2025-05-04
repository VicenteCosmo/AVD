# empresa/admin.py
from django.contrib import admin
from .models import Funcionario, CustomField

@admin.register(Funcionario)
class FuncionarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'departamento', 'cargo', 'dados_formatados']
    search_fields = ['dados_personalizados']
    list_filter = ['departamento', 'cargo']

    def dados_formatados(self, obj):
        return ', '.join([f"{k}: {v}" for k, v in obj.dados_personalizados.items()])
    dados_formatados.short_description = 'Dados Personalizados'

@admin.register(CustomField)
class CustomFieldAdmin(admin.ModelAdmin):
    list_display = ['name', 'label', 'type', 'required']
    search_fields = ['name', 'label']
    list_filter = ['type', 'required']