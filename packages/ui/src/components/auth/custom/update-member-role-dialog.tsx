"use client"

import { useAuth } from "@better-auth-ui/react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog"
import { Field } from "@workspace/ui/components/field"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select"
import { Spinner } from "@workspace/ui/components/spinner"
import { useUpdateMemberRole } from "@workspace/ui/hooks/update-member-role-mutation"
import { type BaseOrganizationRoles } from "@workspace/ui/lib/utils"
import { AlertCircle } from "lucide-react"
import { type SyntheticEvent, useEffect, useState } from "react"
import { toast } from "sonner"

export type UpdateMemberRoleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: {
    id: string
    role: string
    user: { name: string; email: string }
  }
}

export function UpdateMemberRoleDialog({
  open,
  onOpenChange,
  member
}: UpdateMemberRoleDialogProps) {
  const { authClient } = useAuth()
  const [role, setRole] = useState<BaseOrganizationRoles>(
    member.role as BaseOrganizationRoles
  )

  const {
    mutate: updateMemberRole,
    isPending,
    error,
    reset
  } = useUpdateMemberRole(authClient, {
    onSuccess: () => {
      toast.success("Role updated successfully")
      onOpenChange(false)
    }
  })

  useEffect(() => {
    if (open) {
      setRole(member.role as BaseOrganizationRoles)
      reset()
    }
  }, [open, member.role, reset])

  function handleOpenChange(next: boolean) {
    if (isPending) return
    onOpenChange(next)
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    if (role === member.role) {
      onOpenChange(false)
      return
    }

    updateMemberRole({
      memberId: member.id,
      role
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>

            <DialogDescription>
              Update the role for{" "}
              <span className="font-medium text-foreground">
                {member.user.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <Field>
            <Label htmlFor="member-role">Role</Label>

            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as BaseOrganizationRoles)
              }
              disabled={isPending}
            >
              <SelectTrigger id="member-role" className="w-full">
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
