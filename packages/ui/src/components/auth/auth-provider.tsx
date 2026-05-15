import {
  AuthProvider as AuthProviderPrimitive,
  type AuthProviderProps,
} from "@better-auth-ui/react";

export function AuthProvider({ children, ...config }: AuthProviderProps) {
  return (
    <AuthProviderPrimitive {...config}>{children}</AuthProviderPrimitive>
  );
}
