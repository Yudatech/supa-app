"use server";

import type {User} from './types'
import { createClient } from "@/utils/supabase/server";

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

  const supabase = await createClient();
  const { data, error } = await supabase
  .from('profiles')
  .update({
      first_name: u.firstName ?? null,
      last_name:  u.lastName  ?? null,
      user_name:  u.userName  ?? null,
      email:      u.email     ?? null,
      phone_number:      u.phone     ?? null,
      roles:      u.roles     ?? null,
    })
  .eq('id', u.id)
  .select()

  if(error){
    throw new Error("Update user Failure:" + error.message);
  }

  return data as User[];
}