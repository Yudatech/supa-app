

export async function updateUser(userId: string, roles: string[]) {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roles }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { id: string; roles: string[] };
}
