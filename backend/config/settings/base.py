from pathlib import Path
import os
import environ

# INICIALIZAR VARIABLES DE ENTORNO
env = environ.Env()

# RUTA BASE
BASE_DIR = Path(__file__).resolve().parent.parent.parent

environ.Env.read_env(BASE_DIR / ".env")

# CLAVE SECRETA
SECRET_KEY = env('SECRET_KEY')

# APLICACIONES
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # LIBRERIAS
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
    
    # MIS APLICACIONES
    'apps.core',
    'apps.intervenors',
]

# MIDDLEWARE
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URLs
ROOT_URLCONF = 'config.urls'

# PLANTILLAS HTML
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# BASES DE DATOS
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    
    'clinica': {
        'ENGINE': 'mssql', 
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'TrustServerCertificate': 'yes',
        },
    },
}


# VALIDACIONES DE CONTRASEÑAS
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ======== INTERNALIZACION ==========
LANGUAGE_CODE = 'es-co'  
TIME_ZONE = 'America/Bogota'
USE_I18N = True      
USE_L10N = True      
USE_TZ = True  

# === ARCHIVOS ESTATICOS ===
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_URL = '/media/'


# DJANGO REST FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.core.authentication.OIDCAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# CONFIGURACION CON OLIMPO
APPLICATION_CODE = 'khronos'
OLIMPO_APP_CONTEXT_URL = os.environ.get(
    'OLIMPO_APP_CONTEXT_URL',
    'http://localhost:8000/api/v1/apps/me/',
)
OLIMPO_USERS_LOOKUP_URL = 'http://localhost:8000/api/v1/application-users/'
APPLICATION_ROLES_CLAIM = 'rol'
APPLICATION_ADMIN_ROLE_CODE = os.environ.get('APPLICATION_ADMIN_ROLE_CODE', 'khronos_admin')