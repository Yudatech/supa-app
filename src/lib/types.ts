// roles allowed by your UI
export type Role = "admin" | "user" | "teacher";

export interface User {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  roles: Role[];
  updatedAt: string;
}

export type UserOverviewProps = {
  initUsers: User[];
};
