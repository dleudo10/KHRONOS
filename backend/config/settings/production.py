from .base import *

# ========= DEBUG ==========
DEBUG = False

ALLOWED_HOSTS = [
    "10.0.0.3",
]



# ========== CONFIGURACION DE LOGS ==========
LOG_DIR = BASE_DIR / "logs"

LOG_DIR.mkdir(exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "verbose": {
            "format": "{asctime} [{levelname}] {name} - {message}",
            "style": "{",
        },
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },

        "file": {
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": LOG_DIR / "django.log",
            "when": "midnight",
            "interval": 1,
            "backupCount": 30,
            "encoding": "utf-8",
            "formatter": "verbose",
        },
    },

    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },

        "django.request": {
            "handlers": ["console", "file"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}


# ========== CORS ==========
CORS_ALLOWED_ORIGINS = [
    "http://10.0.0.3",
]


CSRF_TRUSTED_ORIGINS = [
    "http://10.0.0.3",
]

# ========== BASE DE DATOS ==========
DATABASES['default']['NAME'] = BASE_DIR / 'db_production.sqlite3'
