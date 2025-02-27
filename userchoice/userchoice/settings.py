import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# Load environment variables from .env file
load_dotenv()

# Base directory for the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# User model for authentication
AUTH_USER_MODEL = 'authApp.UserProfile'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

# Allowed hosts configuration (restrict to production domain or localhost during development)
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(' ') if not DEBUG else ["127.0.0.1", "localhost"]

# Installed applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'rest_framework.authtoken',
    
    "corsheaders",
    
    'book',
    'musicapp',
    'authApp',
]

# Authentication backends
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

# Middleware configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # WhiteNoise for static files in production
    "corsheaders.middleware.CorsMiddleware",
]

# URL configuration
ROOT_URLCONF = 'userchoice.urls'

# Templates settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = 'userchoice.wsgi.application'

# Database configuration (use DATABASE_URL from environment for production)
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))  # Fallback to local DB if no URL set
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
        'rest_framework.permissions.AllowAny',
    ],
}

# Internationalization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files settings
STATIC_URL = '/static/'

# Directories to look for static files
STATICFILES_DIRS = [
    BASE_DIR / 'static',  # Your main static files
]

# Root directory for user-uploaded media files
MEDIA_URL = '/images/'
MEDIA_ROOT = BASE_DIR / 'static/images'

# Static files for production (WhiteNoise integration)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# WhiteNoise settings for production static files
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings (for production, restrict access to trusted origins)
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",  # React development server for localhost
    "http://localhost:3000",   # React development server for localhost
    "https://music-app-iota-sable.vercel.app"  # Your production frontend URL
]

