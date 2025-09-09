import type {User} from './types'

// export async function updateUser(u: User) {
//   const res = await fetch(`/api/admin/users/${u.id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       first_name: u.firstName,
//       last_name: u.lastName,
//       user_name: u.email,   // if you store email in profiles too
//       email: u.email,       // auth.users
//       phone_number: u.phone,       // auth.users
//     }),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return (await res.json()) as { id: string; roles: string[] };
// }

export type UpdateUserPayload = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;   // if you keep it
  email?: string | null;
  phone?: string | null;
  roles?: string[] | null;    // admin can set; omit otherwise
};

export async function updateUser(u: UpdateUserPayload) {
  console.log("trigger!!!!!!", u)
  const res = await fetch(`/api/admin/users/${u.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: u.firstName ?? null,
      last_name:  u.lastName  ?? null,
      user_name:  u.userName  ?? null,
      email:      u.email     ?? null,
      phone_number:      u.phone     ?? null,
      roles:      u.roles     ?? null,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    user_name: string | null;
    email: string | null;
    phone: string | null;
    roles: string[] | null;
    updated_at: string | null;
  }>;
}