"use client"

import { useAuth } from "@better-auth-ui/react"
import { useActiveOrganization } from "@workspace/ui/hooks/use-active-organization"
import { useDeleteOrganization } from "@workspace/ui/hooks/delete-organization.mutation"
import { useLeaveOrganization } from "@workspace/ui/hooks/leave-organization.mutation"
import { useSetActiveOrganization } from "@workspace/ui/hooks/use-set-active-organization"
import { Building2, LogOut, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@workspace/ui/components/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  assertAuthClientHasOrganizationOrThrow,
  cn
} from "@workspace/ui/lib/utils"
import { UpdateOrganizationDialog } from "@workspace/ui/components/auth/custom/update-organization-dialog"

export type OrganizationGeneralProps = {
  className?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function OrganizationGeneral({ className }: OrganizationGeneralProps) {
  const { authClient, Link } = useAuth()
  assertAuthClientHasOrganizationOrThrow(authClient)

  const { data: activeOrganization, isPending } =
    useActiveOrganization(authClient)

  const [updateOpen, setUpdateOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: setActiveOrganization } = useSetActiveOrganization(authClient)

  const { mutate: leaveOrganization, isPending: isLeaving } =
    useLeaveOrganization(authClient, {
      onSuccess: () => {
        setActiveOrganization(null, {
          onSuccess: () => {
            toast.success("You left the organization")
            setLeaveOpen(false)
          },
          onError: (error) => toast.error(error.message)
        })
      },
      onError: (error) => {
        toast.error(`Failed to leave organization. ${error.message}`)
      }
    })

  const { mutate: deleteOrganization, isPending: isDeleting } =
    useDeleteOrganization(authClient, {
      onSuccess: () => {
        setActiveOrganization(null, {
          onSuccess: () => {
            toast.success("Organization deleted")
            setDeleteOpen(false)
          },
          onError: (error) => toast.error(error.message)
        })
      },
      onError: (error) => {
        toast.error(`Failed to delete organization. ${error.message}`)
      }
    })

  if (isPending) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <h1 className="font-bold text-3xl">General</h1>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <Skeleton className="size-16 rounded-md" />

            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!activeOrganization) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <h1 className="font-bold text-3xl">General</h1>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium">No active organization</p>
              <p className="text-muted-foreground text-sm">
                Create an organization to manage its settings.
              </p>
            </div>

            <Button asChild size="sm">
              <Link href="/auth/onboarding">Create organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h1 className="font-bold text-3xl">General</h1>

      <Card>
        <CardHeader>
          <CardTitle>Organization profile</CardTitle>

          <CardDescription>
            The logo, name, and slug shown across your workspace.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-md">
              <AvatarImage
                src={activeOrganization.logo ?? undefined}
                alt={activeOrganization.name}
              />

              <AvatarFallback className="rounded-md">
                {getInitials(activeOrganization.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-semibold text-base">
                {activeOrganization.name}
              </span>

              <span className="text-muted-foreground text-sm">
                {activeOrganization.slug}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button size="sm" onClick={() => setUpdateOpen(true)}>
            Update organization
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave organization</CardTitle>

          <CardDescription>
            Remove yourself from this organization. You'll lose access to its
            members, invitations, and resources.
          </CardDescription>
        </CardHeader>

        <CardFooter className="justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLeaveOpen(true)}
            disabled={isLeaving}
          >
            {isLeaving && <Spinner />}
            <LogOut />
            Leave organization
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle>Delete organization</CardTitle>

          <CardDescription>
            Permanently delete this organization and all of its data. This
            action cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardFooter className="justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner />}
            <Trash2 />
            Delete organization
          </Button>
        </CardFooter>
      </Card>

      <UpdateOrganizationDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        organization={{
          id: activeOrganization.id,
          name: activeOrganization.name,
          slug: activeOrganization.slug,
          logo: activeOrganization.logo
        }}
      />

      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave organization?</AlertDialogTitle>

            <AlertDialogDescription>
              You'll be removed from{" "}
              <span className="font-medium text-foreground">
                {activeOrganization.name}
              </span>{" "}
              and lose access to its members and resources. You can be invited
              back later.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isLeaving}
              onClick={(e) => {
                e.preventDefault()
                leaveOrganization({ organizationId: activeOrganization.id })
              }}
            >
              {isLeaving && <Spinner />}
              Leave organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete organization?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {activeOrganization.name}
              </span>{" "}
              along with all of its members, invitations, and data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault()
                deleteOrganization({ organizationId: activeOrganization.id })
              }}
            >
              {isDeleting && <Spinner />}
              Delete organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
