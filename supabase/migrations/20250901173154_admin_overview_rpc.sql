-- Helper: check if current user is admin
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and ('admin' = any(role))
  );
$$;

-- One-call dashboard payload
create or replace function public.admin_overview_payload(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  result jsonb;
begin
  if _uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  -- Only admins may call this
  if not public.is_admin(_uid) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  result := jsonb_build_object(
    'counts', jsonb_build_object(
      -- Adjust these tables to your schema
      'profiles', (select count(*) from public.profiles),
      'students', (select count(*) from public.students),
      'teachers', (select count(*) from public.teachers),
      'users', (select count(*) from public.profiles),
    ),
    -- Recent auth users with profile info (email from auth.users)
    'recentProfiles', (
      select coalesce(
        jsonb_agg(jsonb_build_object(
          'id',        u.id,
          'email',     u.email,
          'family_name', u.family_name,
          'first_name', u.first_name,
          'countries', u.countries,
          'createdAt', p.created_at,
          'phone_number', u.phone_number,
          'roles', p.roles
        ) order by u.created_at desc),
        '[]'::jsonb
      )
      from (
        select u.id, u.email, u.created_at
        from auth.users u
        order by u.created_at desc
        limit p_limit
      ) u
      left join public.profiles p on p.id = u.id
    )
  );

  return result;
end;
$$;

-- Make it callable by logged-in users (the function enforces admin)
grant execute on function public.admin_overview_payload(int) to authenticated;

-- (Optional) ensure function owner is postgres (superuser bypasses RLS inside SECURITY DEFINER)
alter function public.admin_overview_payload(int) owner to postgres;
alter function public.is_admin(uuid) owner to postgres;
