def get_bearer_token(request):
    header = request.headers.get("Authorization", "")
    parts = header.split()

    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]

    return None