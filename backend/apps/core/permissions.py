from rest_framework.permissions import BasePermission


def get_permission_codes(context):
    """
    Extrae códigos de permisos del contexto validado por OLIMPO.

    Contrato esperado:
        {"permissions": ["intervenors.view_intervenor", ...]}

    También admite:
        {"permissions": [{"code": "intervenors.view_intervenor"}]}
    """
    if not isinstance(context, dict):
        return set()

    permissions = context.get("permissions", [])

    if not isinstance(permissions, (list, tuple, set)):
        return set()

    codes = set()

    for permission in permissions:
        if isinstance(permission, str):
            codes.add(permission)
        elif isinstance(permission, dict):
            code = permission.get("code")
            if isinstance(code, str):
                codes.add(code)

    return codes


class HasPermission(BasePermission):
    message = "No tienes permiso para realizar esta operación."

    def has_permission(self, request, view):

        action = getattr(view, "action", None)

        if action is None:
            return True

        permission_map = getattr(view, "permission_map", {})
        required_permission = permission_map.get(action)
        
        # acciones que no requieren un permiso específico.
        if not required_permission:
            return True

        if not request.user or not request.user.is_authenticated:
            return False
        
        # request.auth es el contexto que devolvió OIDCAuthentication
        # después de validar la sesión con OLIMPO.
        permission_codes = get_permission_codes(request.auth)

        return required_permission in permission_codes