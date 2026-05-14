-- Migration 002: Add multi-category support, coins/rewards system
-- Run this AFTER supabase-schema.sql

-- Add categories JSON array to pickups (for multi-select)
alter table public.pickups add column if not exists categories text;

-- Add coins tracking to pickups
alter table public.pickups add column if not exists coins_earned integer default 0;
alter table public.pickups add column if not exists cashback_used integer default 0;

-- Add coins balance to profiles
alter table public.profiles add column if not exists coins integer default 0;

-- Reward transactions ledger
create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount integer not null,
  type text not null check (type in ('earned', 'redeemed')),
  description text,
  pickup_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  constraint fk_reward_user foreign key (user_id) references auth.users(id) on delete cascade
);

create index if not exists reward_transactions_user_id_idx on public.reward_transactions (user_id);

-- RLS for reward_transactions
alter table public.reward_transactions enable row level security;

drop policy if exists "Reward transactions select own" on public.reward_transactions;
create policy "Reward transactions select own" on public.reward_transactions
  for select
  using (auth.uid() = user_id or exists(select 1 from public.profiles as p where p.user_id = auth.uid() and p.role = 'admin'));

drop policy if exists "Reward transactions insert system" on public.reward_transactions;
create policy "Reward transactions insert system" on public.reward_transactions
  for insert
  with check (true);
