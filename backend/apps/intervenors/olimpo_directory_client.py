import requests

from django.conf import settings
from rest_framework.exceptions import APIException


class OlimpoDirectoryUnavailable(APIException):
    status_code = 503
    default_detail = "El directorio de usuarios no está disponible."
    default_code = "directory_unavailable"
    
class OlimpoDirectoryClient:
    @staticmethod
    def lookup_users(external_ids: list, access_token: str):
        if not external_ids:
            return {}
        
        try:
            response = requests.get(
                settings.OLIMPO_USERS_LOOKUP_URL,
                params=[("external_id", value) for value in external_ids],
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json",
                },
                timeout=5,
            )
            response.raise_for_status()
            payload = response.json()
        except (requests.RequestException, ValueError) as exc:
            raise OlimpoDirectoryUnavailable() from exc
        
        users = payload.get("data", []).get("results", [])
        return {
            user["external_id"]: user
            for user in users
            if user.get("external_id")
        }