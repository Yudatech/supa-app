import { Badge } from "@/components/ui/badge";
import { Role, User } from "../../lib/types";
import {
  Users,
  Shield,
  UserCheck,
  X,
  GraduationCap,
  Speech,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComponentProps } from "react";

type RoleProps = React.PropsWithChildren<
  { role: Role } & ComponentProps<typeof Badge>
>;

type RolesProp = {
  roles: Role[];
  formData: User;
  setFormData: (users: User) => void;
};

const getRoleIcon = (role: Role) => {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4" />;
    case "teacher":
      return <Speech className="h-4 w-4" />;
    case "master":
      return <GraduationCap className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

const getRoleBadgeVariant = (role: Role) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "teacher":
      return "secondary";
    case "master":
      return "default";
    default:
      return "outline";
  }
};

export function RoleBadge({ role, children, ...props }: RoleProps) {
  return (
    <Badge variant={getRoleBadgeVariant(role)} className="gap-1" {...props}>
      {getRoleIcon(role)}
      {role}
      {children}
    </Badge>
  );
}

export function EditRoles({ roles, formData, setFormData }: RolesProp) {
  const removeRole = (roleToRemove: Role) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((role) => role !== roleToRemove),
    });
  };

  const addRole = (role: Role) => {
    if (!formData.roles.includes(role)) {
      setFormData({ ...formData, roles: [...formData.roles, role] });
    }
  };
  return (
    <div className="grid gap-2">
      <Label htmlFor="add-role">Roles</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {roles.map((role, index) => (
          <RoleBadge key={`${role}-${index}`} role={role}>
            <button
              type="button"
              onClick={() => removeRole(role)}
              className="ml-1 hover:bg-black/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </RoleBadge>
        ))}
      </div>
      <Select onValueChange={(value: Role) => addRole(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Add a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user" disabled={formData.roles.includes("user")}>
            User
          </SelectItem>
          <SelectItem
            value="teacher"
            disabled={formData.roles.includes("teacher")}
          >
            Teacher
          </SelectItem>
          <SelectItem
            value="master"
            disabled={formData.roles.includes("master")}
          >
            Master
          </SelectItem>
          <SelectItem value="admin" disabled={formData.roles.includes("admin")}>
            Admin
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
