"use client"

import { useAuth } from "@better-auth-ui/react";

export interface ShowProps {
    when: "signed-in" | "signed-out";
    children: React.ReactNode;
}

export function Show({ when, children }: ShowProps) {
    const { authClient } = useAuth();
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) return ( <></> );
    if (error) return ( <>Error: {error.error.message}</> );

    if (when === "signed-in" && session) {
        return <>{children}</>;
    }

    if (when === "signed-out" && !session) {
        return <>{children}</>;
    }

    return null;
}