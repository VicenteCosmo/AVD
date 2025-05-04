from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/empresa/', include('app.urls')),  # Certifique-se de que a app 'hr' esteja instalada
]
