-- Supabase schema for Eco Scrap Platform
-- Tables: profiles, price_list, pickups
-- Includes relationships, indexes, row-level security, and admin/user policies

create extension if not exists pgcrypto;

-- Profiles table tracks user metadata and role
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  email text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- Price list for recycle categories and item pricing
create table if not exists public.price_list (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  item_type text not null,
  description text,
  unit text not null default 'kg',
  price_cents integer not null check (price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists price_list_category_idx on public.price_list (category);
create index if not exists price_list_item_type_idx on public.price_list (item_type);

-- Pickups table stores requests and status updates
create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  profile_id uuid not null,
  price_list_id uuid,
  category text not null,
  item_name text not null,
  weight_kg numeric(8,2) not null check (weight_kg >= 0),
  estimated_value_cents integer not null check (estimated_value_cents >= 0),
  final_value_cents integer default 0 check (final_value_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'collected', 'cancelled', 'completed')),
  schedule_at timestamptz not null,
  pickup_address text not null,
  image_url text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint fk_pickup_user foreign key (user_id) references auth.users(id) on delete cascade,
  constraint fk_pickup_profile foreign key (profile_id) references public.profiles(id) on delete cascade,
  constraint fk_pickup_price_list foreign key (price_list_id) references public.price_list(id) on delete set null
);

create index if not exists pickups_user_id_idx on public.pickups (user_id);
create index if not exists pickups_status_idx on public.pickups (status);
create index if not exists pickups_schedule_at_idx on public.pickups (schedule_at);

-- Enable row-level security for protected tables
alter table public.profiles enable row level security;
alter table public.price_list enable row level security;
alter table public.pickups enable row level security;

-- Profiles policies
drop policy if exists "Profiles can select own record" on public.profiles;
create policy "Profiles can select own record" on public.profiles
  for select
  using (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

drop policy if exists "Profiles can insert own record" on public.profiles;
create policy "Profiles can insert own record" on public.profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Profiles can update own record" on public.profiles;
create policy "Profiles can update own record" on public.profiles
  for update
  using (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'))
  with check (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

drop policy if exists "Profiles admin full access" on public.profiles;
create policy "Profiles admin full access" on public.profiles
  for delete
  using (exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

-- Price list policies
drop policy if exists "Price list authenticated select" on public.price_list;
create policy "Price list authenticated select" on public.price_list
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "Price list admin modify" on public.price_list;
create policy "Price list admin modify" on public.price_list
  for all
  using (exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'))
  with check (exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

-- Pickups policies
drop policy if exists "Pickups can select own records" on public.pickups;
create policy "Pickups can select own records" on public.pickups
  for select
  using (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

drop policy if exists "Pickups can insert own records" on public.pickups;
create policy "Pickups can insert own records" on public.pickups
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Pickups can update own records" on public.pickups;
create policy "Pickups can update own records" on public.pickups
  for update
  using (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'))
  with check (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

drop policy if exists "Pickups admin delete" on public.pickups;
create policy "Pickups admin delete" on public.pickups
  for delete
  using (exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));
