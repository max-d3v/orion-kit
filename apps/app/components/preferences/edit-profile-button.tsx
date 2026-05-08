"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";

export function EditProfileButton() {
  const { data: user } = useQuery(orpc.users.getUser.queryOptions());

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm" variant="outline">
        Edit Profile
      </Button>

      <EditProfileModal onOpenChange={setIsOpen} open={isOpen} user={user} />
    </>
  );
}
