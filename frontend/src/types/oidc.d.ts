import "oidc-client-ts";

declare module "oidc-client-ts" {
    interface IdTokenClaims  {
        rol: string;
    }
}