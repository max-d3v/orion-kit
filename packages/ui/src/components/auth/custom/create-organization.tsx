"use client"

import { useAuth } from "@better-auth-ui/react"
import { useCreateOrganization } from "@workspace/ui/hooks/create-organization-mutation"
import { useSetActiveOrganization } from "@workspace/ui/hooks/use-set-active-organization"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"
import {
  OrganizationFormFields,
  type OrganizationFormValues
} from "@workspace/ui/components/auth/custom/organization-form-fields"

export type CreateOrganizationProps = {
  className?: string
}

export function CreateOrganization({ className }: CreateOrganizationProps) {
  const { authClient, navigate } = useAuth()

  const [values, setValues] = useState<OrganizationFormValues>({
    name: "",
    slug: ""
  })

  const { mutate: setActiveOrganization } = useSetActiveOrganization(authClient)

  const { mutate: createOrganization, isPending } = useCreateOrganization(
    authClient,
    {
      onSuccess: (organization) => {
        setActiveOrganization(organization.id, {
          onSuccess: () => {
            toast.success("Organization created successfully")
            navigate({ to: "/settings/organization/general" })
          },
          onError: (error) => toast.error(error.error.message)
        })
      }
    }
  )

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    createOrganization({
      name: values.name,
      slug: values.slug,
      logo: values.logo
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="font-semibold text-xl">
            Create Organization
          </CardTitle>
        </CardHeader>

        <CardContent>
          <OrganizationFormFields
            values={values}
            onChange={setValues}
            isPending={isPending}
            idPrefix="create-org"
          />
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending && <Spinner />}
            Create Organization
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
