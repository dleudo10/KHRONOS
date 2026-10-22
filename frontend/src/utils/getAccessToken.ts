export function getAccessToken(): string | undefined {
    const key = `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${import.meta.env.VITE_OIDC_CLIENT_ID}`;
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { access_token?: string }).access_token : undefined;
}