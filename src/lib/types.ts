// roles allowed by your UI
export type Role = "admin" | "user" | "teacher" | "master";

export interface User {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  roles: Role[];
  phone?: string;
  updatedAt?: string;
}

export type UserOverviewProps = {
  initUsers: User[];
  authUser: User;
};

export type ProfileProps = {
  auth: User | null
}
