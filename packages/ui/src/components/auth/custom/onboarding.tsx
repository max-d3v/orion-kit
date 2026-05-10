"use client"

import { useAuth } from "@better-auth-ui/react"

import { CreateOrganization } from "@workspace/ui/components/auth/custom/create-organization"
import { OrganizationList } from "@workspace/ui/components/auth/custom/organization-list"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useOrganizations } from "@workspace/ui/hooks/use-organizations"
import {
  assertAuthClientHasOrganizationOrThrow,
  cn
} from "@workspace/ui/lib/utils"

export type OnboardingProps = {
  className?: string
}

export function Onboarding({ className }: OnboardingProps) {
  const { authClient } = useAuth()
  assertAuthClientHasOrganizationOrThrow(authClient)

  const { data: organizations, isPending } = useOrganizations(authClient)

  if (isPending) {
    return (
      <Card className={cn("w-full max-w-sm", className)}>
        <CardHeader>
          <CardTitle className="text-center font-semibold text-xl">
            <Skeleton className="mx-auto h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!organizations?.length) {
    return <CreateOrganization className={className} />
  }

  return <OrganizationList className={className} />
}
