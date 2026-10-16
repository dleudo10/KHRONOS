from .base import *

# ========= DEBUG ==========
DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]


# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5175',
    'http://127.0.0.1:5175',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5175',
    'http://127.0.0.1:5175',
]

# ========== BASE DE DATOS ==========
DATABASES['default']['NAME'] = BASE_DIR / 'db_development.sqlite3'
