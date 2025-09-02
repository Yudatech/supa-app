import type {User} from './types'

export async function updateUser(u: User) {
  const res = await fetch(`/api/admin/users/${u.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: u.firstName,
      last_name: u.lastName,
      user_name: u.email,   // if you store email in profiles too
      roles: u.roles,       // ignored if caller isn't admin
      email: u.email,       // auth.users
      phone: u.phone,       // auth.users
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { id: string; roles: string[] };
}
