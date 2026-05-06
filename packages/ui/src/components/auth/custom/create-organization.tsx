"use client"

import { fileToBase64 } from "@better-auth-ui/core"
import { useCreateOrganization } from "@workspace/ui/hooks/create-organization-mutation"
import { Building2, Upload } from "lucide-react"
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { Field, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"
import { useAuth } from "@better-auth-ui/react"

export type CreateOrganizationProps = {
  className?: string
}

export function CreateOrganization({ className }: CreateOrganizationProps) {
    const { authClient } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [isUploading, setIsUploading] = useState(false)

  const { mutate: createOrganization, isPending: createPending } =
    useCreateOrganization(authClient, {
      onSuccess: () => toast.success("Organization created successfully")
    })

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    slug?: string
  }>({})

  const isPending = createPending || isUploading

  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ""
    setIsUploading(true)

    try {
      const base64 = await fileToBase64(file)
      setLogoPreview(base64)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }

    setIsUploading(false)
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string

    createOrganization({
      name,
      slug,
      logo: logoPreview
    })
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">Create Organization</h2>

      <form onSubmit={handleSubmit}>
        <Card className={cn(className)}>
          <CardContent className="flex flex-col gap-6">
            <Field>
              <Label htmlFor="logo">Logo</Label>

              <input
                ref={fileInputRef}
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />

              <div className="flex items-center gap-4">
                <Avatar className="size-12 rounded-md">
                  <AvatarImage
                    src={logoPreview ?? undefined}
                    alt="Organization logo"
                  />

                  <AvatarFallback className="rounded-md">
                    <Building2 className="size-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isPending && <Spinner />}

                  <Upload className="text-muted-foreground" />
                  Upload Logo
                </Button>
              </div>
            </Field>

            <Field data-invalid={!!fieldErrors.name}>
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                name="name"
                autoComplete="organization"
                placeholder="Acme Inc."
                disabled={isPending}
                required
                onChange={() => {
                  setFieldErrors((prev) => ({
                    ...prev,
                    name: undefined
                  }))
                }}
                onInvalid={(e) => {
                  e.preventDefault()

                  setFieldErrors((prev) => ({
                    ...prev,
                    name: (e.target as HTMLInputElement).validationMessage
                  }))
                }}
                aria-invalid={!!fieldErrors.name}
              />

              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.slug}>
              <Label htmlFor="slug">Slug</Label>

              <Input
                id="slug"
                name="slug"
                placeholder="acme"
                disabled={isPending}
                required
                onChange={() => {
                  setFieldErrors((prev) => ({
                    ...prev,
                    slug: undefined
                  }))
                }}
                onInvalid={(e) => {
                  e.preventDefault()

                  setFieldErrors((prev) => ({
                    ...prev,
                    slug: (e.target as HTMLInputElement).validationMessage
                  }))
                }}
                aria-invalid={!!fieldErrors.slug}
              />

              <FieldError>{fieldErrors.slug}</FieldError>
            </Field>
          </CardContent>

          <CardFooter>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Spinner />}
              Create Organization
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
