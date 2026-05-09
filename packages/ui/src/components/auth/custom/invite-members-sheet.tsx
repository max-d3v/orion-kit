"use client"

import { useInviteUsers } from "@workspace/ui/hooks/invite-users-mutation"
import { useAuth } from "@better-auth-ui/react"
import { AlertCircle } from "lucide-react"
import { type SyntheticEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Field } from "@workspace/ui/components/field"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@workspace/ui/components/sheet"
import { Spinner } from "@workspace/ui/components/spinner"
import { Textarea } from "@workspace/ui/components/textarea"
import { type BaseOrganizationRoles } from "@workspace/ui/lib/utils"

export type InviteMembersSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMembersSheet({
  open,
  onOpenChange
}: InviteMembersSheetProps) {
  const { authClient } = useAuth()
  const [emails, setEmails] = useState("")
  const [role, setRole] = useState<BaseOrganizationRoles>("member")

  const {
    mutate: inviteUsers,
    isPending,
    error,
    reset
  } = useInviteUsers(authClient, {
    onSuccess: (data) => {
      toast.success(
        `Sent ${data.length} invitation${data.length === 1 ? "" : "s"}.`
      )
      setEmails("")
      setRole("member")
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(
        `Failed to send invitations. ${error.error.message}`
      )
    }
  })

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const parsed = emails
      .split(/[\s,;]+/)
      .map((value) => value.trim())
      .filter(Boolean)

    if (parsed.length === 0) {
      toast.error("Enter at least one email address.")
      return
    }

    inviteUsers({ emails: parsed, role })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col gap-4"
        >
          <SheetHeader>
            <SheetTitle>Invite members</SheetTitle>

            <SheetDescription>
              Add new people to your organization. They'll receive an email
              invitation.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4">
            <Field>
              <Label htmlFor="invite-emails">Email addresses</Label>

              <Textarea
                id="invite-emails"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="jane@example.com, john@example.com"
                rows={5}
                disabled={isPending}
                required
              />

              <p className="text-muted-foreground text-xs">
                Separate multiple emails with a comma, space, or new line.
              </p>
            </Field>

            <Field>
              <Label htmlFor="invite-role">Role</Label>

              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as BaseOrganizationRoles)
                }
                disabled={isPending}
              >
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error.error.message}</span>
              </div>
            )}
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </SheetClose>

            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />}
              Send invitations
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
