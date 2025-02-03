from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin URL
    path('admin/', admin.site.urls),
    path('account/', include('authApp.urls')),  # Account management
    path('', include('musicapp.urls')),   # Music-related API
    path('book/', include('book.urls')), 
    
]

# Serve media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static files in production using WhiteNoise or Django's default handling
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
