"use client"

import { useActiveOrganizationMembers } from "@workspace/ui/hooks/use-organization"
import { useAuth } from "@better-auth-ui/react"
import {
  AlertCircle,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  UserPlus
} from "lucide-react"
import { useMemo, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export type OrganizationMembersProps = {
  className?: string
}

export function OrganizationMembers({ className }: OrganizationMembersProps) {
  const { authClient } = useAuth()
  const {
    data: membersData,
    isPending,
    error
  } = useActiveOrganizationMembers(authClient)

  const [search, setSearch] = useState("")
  const [inviteOpen, setInviteOpen] = useState(false)

  const members = membersData?.members ?? []

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return members

    return members.filter(
      (member) =>
        member.user.name.toLowerCase().includes(query) ||
        member.user.email.toLowerCase().includes(query)
    )
  }, [members, search])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            disabled={isPending || !!error}
          />
        </div>

        <Button size="sm" onClick={() => setInviteOpen(true)}>
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
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[60px] pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(() => {
              if (isPending) {
                return Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <MemberSkeletonRow key={`skeleton-${i}`} />
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
                        <span>Failed to load members.</span>
                        <span className="text-xs">{error.message}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }

              if (filteredMembers.length === 0) {
                return (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMN_COUNT}
                      className="h-24 text-center text-muted-foreground text-sm"
                    >
                      No members found.
                    </TableCell>
                  </TableRow>
                )
              }

              return filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="pl-4">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={member.user.image ?? undefined}
                        alt={member.user.name}
                      />

                      <AvatarFallback>
                        {getInitials(member.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{member.user.name}</span>

                      <span className="text-muted-foreground text-xs">
                        {member.user.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(member.createdAt))}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{member.role}</Badge>
                  </TableCell>

                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Open actions for ${member.user.name}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Shield />
                          Change role
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem variant="destructive">
                          <Trash2 />
                          Remove member
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

      <InviteMembersSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function MemberSkeletonRow() {
  return (
    <TableRow>
      <TableCell className="pl-4">
        <Skeleton className="size-9 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
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

