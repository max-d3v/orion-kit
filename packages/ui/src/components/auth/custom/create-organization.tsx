"use client"

import { fileToBase64 } from "@better-auth-ui/core"
import { useCreateOrganization } from "@workspace/ui/hooks/create-organization-mutation"
import { Upload } from "lucide-react"
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldDescription, FieldError } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"
import { useAuth } from "@better-auth-ui/react"

export type CreateOrganizationProps = {
  className?: string
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function CreateOrganization({ className }: CreateOrganizationProps) {
    const { authClient, navigate } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [isUploading, setIsUploading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  const { mutate: createOrganization, isPending: createPending } =
    useCreateOrganization(authClient, {
      onSuccess: () => {
        toast.success("Organization created successfully")
        navigate({ to: "/settings/organization/profile" })
      }
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

    createOrganization({
      name,
      slug,
      logo: logoPreview
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
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload organization logo"
                  className="cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Avatar
                    className={cn(
                      "size-[72px] rounded-md bg-transparent transition-colors",
                      !logoPreview &&
                        "border-2 border-muted-foreground/40 border-dashed hover:border-muted-foreground/70"
                    )}
                  >
                    <AvatarImage
                      src={logoPreview ?? undefined}
                      alt="Organization logo"
                    />

                    <AvatarFallback className="rounded-md bg-transparent">
                      <Upload className="size-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </button>

                <div className="flex flex-col items-start gap-1">
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

                  <FieldDescription>
                    Recommended size 1:1, up to 10MB.
                  </FieldDescription>
                </div>
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
                value={name}
                onChange={(e) => {
                  const newName = e.target.value
                  setName(newName)
                  if (!slugTouched || slug === "") {
                    setSlug(slugify(newName))
                  }
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
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSlugTouched(true)
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
