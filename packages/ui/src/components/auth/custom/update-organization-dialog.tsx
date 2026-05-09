"use client"

import { useAuth } from "@better-auth-ui/react"
import { useUpdateOrganization } from "@workspace/ui/hooks/update-organization.mutation"
import { AlertCircle } from "lucide-react"
import { type SyntheticEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  OrganizationFormFields,
  type OrganizationFormValues
} from "@workspace/ui/components/auth/custom/organization-form-fields"

export type UpdateOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: {
    id: string
    name: string
    slug: string
    logo?: string | null
  }
}

function organizationToValues(
  organization: UpdateOrganizationDialogProps["organization"]
): OrganizationFormValues {
  return {
    name: organization.name,
    slug: organization.slug,
    logo: organization.logo ?? undefined
  }
}

export function UpdateOrganizationDialog({
  open,
  onOpenChange,
  organization
}: UpdateOrganizationDialogProps) {
  const { authClient } = useAuth()

  const [values, setValues] = useState<OrganizationFormValues>(() =>
    organizationToValues(organization)
  )

  const {
    mutate: updateOrganization,
    isPending,
    error,
    reset
  } = useUpdateOrganization(authClient, {
    onSuccess: () => {
      toast.success("Organization updated successfully")
      onOpenChange(false)
    },
    onError: (err) => {
      toast.error(`Failed to update organization. ${err.error.message}`)
    }
  })

  useEffect(() => {
    if (open) {
      setValues(organizationToValues(organization))
      reset()
    }
  }, [open, organization, reset])

  function handleOpenChange(next: boolean) {
    if (isPending) return
    onOpenChange(next)
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const data: { name?: string; slug?: string; logo?: string } = {}

    if (values.name !== organization.name) data.name = values.name
    if (values.slug !== organization.slug) data.slug = values.slug
    if (values.logo !== (organization.logo ?? undefined)) {
      data.logo = values.logo ?? ""
    }

    if (Object.keys(data).length === 0) {
      onOpenChange(false)
      return
    }

    updateOrganization({
      organizationId: organization.id,
      data
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Update organization</DialogTitle>

            <DialogDescription>
              Change your organization's logo, name, or slug.
            </DialogDescription>
          </DialogHeader>

          <OrganizationFormFields
            values={values}
            onChange={setValues}
            isPending={isPending}
            idPrefix="update-org"
          />

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error.error.message}</span>
            </div>
          )}

          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
