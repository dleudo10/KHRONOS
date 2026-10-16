
class ResponseWrapperMixin:

    success_messages = {
        "list": "Datos obtenidos exitosamente.",
        "retrieve": "Registro obtenido exitosamente.",
        "create": "Registro creado exitosamente.",
        "update": "Registro actualizado exitosamente.",
        "partial_update": "Registro actualizado exitosamente.",
        "destroy": "Registro eliminado exitosamente.",
        "restore": "Registro restaurado correctamente.",
    }

    def should_wrap_response(self):
        action = getattr(self, "action", None)

        if action in getattr(self, "wrap_response_actions", {}):
            return self.wrap_response_actions[action]

        return getattr(self, "wrap_response", True)

    def finalize_response(self, request, response, *args, **kwargs):

        response = super().finalize_response(
            request,
            response,
            *args,
            **kwargs
        )

        if not self.should_wrap_response():
            return response

        content_type = response.get("Content-Type", "")

        if (
            content_type.startswith("application/pdf")
            or content_type.startswith("image/")
            or content_type.startswith("application/octet-stream")
        ):
            return response

        if getattr(response, "exception", False):
            detail = response.data.get("detail") if isinstance(
                response.data,
                dict
            ) else None
            
            response.data = {
                "success": False,
                "message": detail or "Ocurrió un error en la solicitud.",
                "data": None,
                "errors": response.data,
            }
            return response

        if isinstance(response.data, dict):
            message = self.success_messages.get(
                getattr(self, "action", ""),
                "Operación realizada correctamente.",
            )

            response.data = {
                "success": True,
                "message": message,
                "data": response.data,
                "errors": None,
            }

        return response