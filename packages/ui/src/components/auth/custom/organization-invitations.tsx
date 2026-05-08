"use client"

import { useOrganizationInvitations } from "@workspace/ui/hooks/use-invites"
import { useAuth } from "@better-auth-ui/react"
import {
  AlertCircle,
  MailX,
  MoreHorizontal,
  Search,
  Send,
  UserPlus
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  Avatar,
  AvatarFallback
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import { InviteMembersSheet } from "@workspace/ui/components/auth/custom/invite-members-sheet"

const COLUMN_COUNT = 5
const SKELETON_ROWS = 4

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
})

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  accepted: "default",
  rejected: "destructive",
  canceled: "secondary"
}

function getInitial(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export type OrganizationInvitationsProps = {
  className?: string
  organizationId: string | undefined
}

export function OrganizationInvitations({
  className,
  organizationId
}: OrganizationInvitationsProps) {
  const { authClient } = useAuth()
  const {
    data: invitations,
    isPending,
    error
  } = useOrganizationInvitations(authClient, organizationId)

  const [search, setSearch] = useState("")
  const [inviteOpen, setInviteOpen] = useState(false)

  const filteredInvitations = useMemo(() => {
    if (!invitations) return []

    const query = search.trim().toLowerCase()
    if (!query) return invitations

    return invitations.filter((invitation) =>
      invitation.email.toLowerCase().includes(query)
    )
  }, [invitations, search])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <div className="relative w-3/5">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search invitations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            disabled={isPending || !!error}
          />
        </div>

        <Button size="sm" onClick={() => setInviteOpen(true)} className="ml-auto">
          <UserPlus />
          Invite
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[68px] pl-4">
                <span className="sr-only">Photo</span>
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[160px]">Invited</TableHead>
              <TableHead className="w-[120px]">Role</TableHead>
              <TableHead className="w-[60px] pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(() => {
              if (isPending) {
                return Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <InvitationSkeletonRow key={`skeleton-${i}`} />
                ))
              }

              if (error) {
                return (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMN_COUNT}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
                        <AlertCircle className="size-5 text-destructive" />
                        <span>Failed to load invitations.</span>
                        <span className="text-xs">{error.message}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }

              if (filteredInvitations.length === 0) {
                return (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMN_COUNT}
                      className="h-24 text-center text-muted-foreground text-sm"
                    >
                      No invitations found.
                    </TableCell>
                  </TableRow>
                )
              }

              return filteredInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="pl-4">
                    <Avatar className="size-9">
                      <AvatarFallback>
                        {getInitial(invitation.email)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{invitation.email}</span>

                      <Badge
                        variant={
                          STATUS_VARIANTS[invitation.status] ?? "outline"
                        }
                        className="w-fit text-[10px] capitalize"
                      >
                        {invitation.status}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(invitation.createdAt))}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{invitation.role}</Badge>
                  </TableCell>

                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Open actions for ${invitation.email}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Send />
                          Resend invitation
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem variant="destructive">
                          <MailX />
                          Cancel invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            })()}
          </TableBody>
        </Table>
      </Card>

      <InviteMembersSheet
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        organizationId={organizationId}
      />
    </div>
  )
}

function InvitationSkeletonRow() {
  return (
    <TableRow>
      <TableCell className="pl-4">
        <Skeleton className="size-9 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-md" />
      </TableCell>
      <TableCell className="pr-4 text-right">
        <Skeleton className="ml-auto size-8" />
      </TableCell>
    </TableRow>
  )
}
