"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Edit,
  Plus,
  Search,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";
import { Role, User, UserOverviewProps } from "../../lib/types";
import { SearchHeader } from "./user-search";
import { RoleBadge, EditRoles } from "./roles";

export function UserOverview({ initUsers }: UserOverviewProps) {
  const [users, setUsers] = useState<User[]>(initUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
    updatedAt: "",
  });

  // 🔁 Load from server route
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data: User[] = await res.json();
        if (!cancelled) setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = () => {
    if (!editingUser) return;

    setUsers(
      users.map((user) =>
        user.id === editingUser.id ? { ...user, ...formData } : user
      )
    );
    setEditingUser(null);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      roles: [],
      updatedAt: "",
    });
    setIsEditDialogOpen(false);
  };

  // const handleDeleteUser = (userId: string) => {
  //   setUsers(users.filter((user) => user.id !== userId));
  // };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      updatedAt: user.updatedAt,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">User Management</h1>
          <p className="text-muted-foreground text-pretty">
            Manage users, roles, and permissions from this central dashboard
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.roles?.includes("admin")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <SearchHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {`${user.lastName} ${user.firstName}`}
                    </TableCell>
                    <TableCell>
                      {user.roles.map((role) => (
                        <RoleBadge key={`${user.id}-${role}`} role={role} />
                      ))}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || ""}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-destructive hover:text-destructive bg-transparent"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the user account for{" "}
                                {user.firstName}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            {/* <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter> */}
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
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
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <EditRoles
              roles={formData.roles}
              formData={formData}
              setFormData={setFormData}
            />
            {/* <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.roles.map((role) => (
                  <Badge
                    key={role}
                    variant={getRoleBadgeVariant(role)}
                    className="gap-1"
                  >
                    {getRoleIcon(role)}
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Select
                value={formData.role}
                onValueChange={(value: User["role"]) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={!formData.email || formData.roles.length < 1}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
