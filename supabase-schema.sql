drop table if exists public.reward_transactions cascade;
drop table if exists public.profiles cascade;
drop table if exists public.price_list cascade;
drop table if exists public.pickups cascade;
drop table if exists public.settings cascade;

create extension if not exists pgcrypto;

create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  pickup_address text not null,
  location_lat numeric,
  location_lng numeric,
  items jsonb default '[]'::jsonb,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  preferred_date date,
  preferred_time text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pickups_status_idx on public.pickups (status);
create index if not exists pickups_created_at_idx on public.pickups (created_at desc);
create index if not exists pickups_phone_idx on public.pickups (customer_phone);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.pickups enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Anyone can insert pickups" on public.pickups;
drop policy if exists "Admin can manage pickups" on public.pickups;
drop policy if exists "Anyone can read settings" on public.settings;
drop policy if exists "Admin can manage settings" on public.settings;

create policy "Anyone can insert pickups" on public.pickups
  for insert
  with check (true);

create policy "Admin can manage pickups" on public.pickups
  for all
  using (true)
  with check (true);

create policy "Anyone can read settings" on public.settings
  for select
  using (true);

create policy "Admin can manage settings" on public.settings
  for all
  using (true)
  with check (true);

insert into public.settings (key, value) values
('hero_bg_images', '["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=85&auto=format&fit=crop","https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1588803103006-2822e4b2619d?q=80&w=1170&auto=format&fit=crop","https://plus.unsplash.com/premium_photo-1661753249955-398718029b07?w=600&auto=format&fit=crop&q=60"]'::jsonb),
('hero_content', '{"title":"YourScrap","subtitle":"Your Scrap, Our Green Future.","tagline_ta":"குப்பையை காசாக்குங்கள்","description_en":"Schedule your pickup for Saturday or Sunday.","description_ta":"சனி அல்லது ஞாயிறு அன்று pickupக்கு முன்பதிவு செய்யுங்கள்."}'::jsonb),
('price_rates', '[{"category":"Iron / Steel","price":"₹18-25/kg","color":"from-orange-500 to-red-500"},{"category":"Aluminum","price":"₹80-120/kg","color":"from-blue-500 to-cyan-500"},{"category":"Copper","price":"₹350-450/kg","color":"from-amber-600 to-yellow-500"},{"category":"Brass","price":"₹250-320/kg","color":"from-yellow-600 to-orange-500"},{"category":"Plastic (PET)","price":"₹8-15/kg","color":"from-green-500 to-emerald-500"},{"category":"Paper","price":"₹6-12/kg","color":"from-stone-500 to-neutral-500"}]'::jsonb),
('scrap_categories', '[{"icon":"🔩","title":"Iron & Steel","description":"Old pipes, utensils, construction waste","color":"from-orange-500 to-red-500"},{"icon":"🔌","title":"Copper","description":"Wires, pipes, electrical components","color":"from-amber-600 to-yellow-500"},{"icon":"⚙️","title":"Aluminum","description":"Cans, foil, kitchenware","color":"from-blue-400 to-cyan-400"},{"icon":"🎺","title":"Brass","description":"Fittings, decorative items, old jewelry","color":"from-yellow-500 to-orange-500"},{"icon":"🧴","title":"Plastic","description":"PET bottles, containers, wrappers","color":"from-green-400 to-emerald-500"},{"icon":"📰","title":"Paper","description":"Newspapers, cardboard, books","color":"from-stone-400 to-neutral-400"}]'::jsonb),
('stats', '[{"value":"10K+","label":"Pickups Completed"},{"value":"500+","label":"Tons Recycled"},{"value":"98%","label":"Customer Satisfaction"}]'::jsonb),
('features', '[{"title":"Instant Booking","description":"Book your pickup in under 60 seconds. No calls, no waiting.","ta":"உடனடி முன்பதிவு"},{"title":"Fair Prices","description":"Get real-time market rates for your scrap. No hidden fees.","ta":"சரியான விலை"},{"title":"Eco Impact","description":"Every pickup saves 2.5kg CO₂. Track your contribution.","ta":"சூழல் பாதுகாப்பு"},{"title":"Free Pickup","description":"We come to your doorstep. Free for orders above 10kg.","ta":"இலவச pickup"}]'::jsonb),
('contact', '{"phone":"9080405581","area":"Coimbatore, Tamilnadu","whatsapp":"9080405581"}'::jsonb)
on conflict (key) do nothing;
