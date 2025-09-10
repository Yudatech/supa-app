"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use, useState } from "react";
import type { User } from "../lib/types";
import { Button } from "@/components/ui/button";
import { EditRoles } from "./admin/roles";
import { updateUser } from "../lib/update-users";
// import { createClient } from "@/utils/supabase/server";

export const UserEditDialog: React.FC<{
  auth: User;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
}> = ({ auth, isEditDialogOpen, setIsEditDialogOpen }) => {
  // const supabase = await createClient();
  const [formData, setFormData] = useState<User>({
    id: auth.id,
    firstName: auth.firstName,
    lastName: auth.lastName,
    email: auth.email,
    roles: auth.roles,
    updatedAt: auth.updatedAt,
  });

  // const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditUser = async (formData: User) => {
    if (!formData) return;

    updateUser({
      id: auth.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      roles: formData.roles, // only admins can set; others omit
    });
  };

  const isAdmin = auth.roles.includes("admin");

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user account details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">First Name</Label>
            <Input
              id="edit-name"
              value={formData.firstName || ""}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Enter full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Last Name</Label>
            <Input
              id="edit-name"
              value={formData.lastName || ""}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Enter full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email address"
            />
          </div>
          {isAdmin && (
            <EditRoles
              roles={formData.roles}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleEditUser(formData)}
            disabled={!formData.email || formData.roles.length < 1}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
