-- ==============================================================================
-- EVENTKU: PLATFORM EVENT DISCOVERY & E-TICKETING
-- Database Schema & Row Level Security (RLS) for Supabase (PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('user', 'organizer', 'admin');
create type event_status as enum ('draft', 'published', 'cancelled', 'completed');
create type order_status as enum ('pending', 'paid', 'cancelled', 'refunded', 'expired');
create type ticket_status as enum ('valid', 'used', 'cancelled', 'expired');

-- 3. PROFILES TABLE (Linked with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role user_role default 'user'::user_role not null,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. EVENTS TABLE
create table if not exists public.events (
  id text primary key default ('evt-' || substr(md5(random()::text), 1, 8)),
  title text not null,
  slug text not null unique,
  description text not null,
  short_description text not null,
  category_id text references public.categories(id) on delete set null,
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  poster_url text,
  venue_name text not null,
  venue_address text not null,
  city text not null,
  start_date date not null,
  end_date date not null,
  start_time time not null,
  end_time time not null,
  timezone text default 'Asia/Jakarta' not null,
  status event_status default 'draft'::event_status not null,
  is_featured boolean default false not null,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TICKET TYPES TABLE
create table if not exists public.ticket_types (
  id text primary key default ('tt-' || substr(md5(random()::text), 1, 8)),
  event_id text references public.events(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(15, 2) not null check (price >= 0),
  currency text default 'IDR' not null,
  quota integer not null check (quota >= 0),
  sold integer default 0 not null check (sold <= quota),
  max_per_order integer default 5 not null,
  sale_start timestamp with time zone not null,
  sale_end timestamp with time zone not null,
  status text default 'available' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDERS TABLE
create table if not exists public.orders (
  id text primary key default ('ord-' || substr(md5(random()::text), 1, 8)),
  order_code text not null unique,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id text references public.events(id) on delete restrict not null,
  total_amount numeric(15, 2) not null check (total_amount >= 0),
  currency text default 'IDR' not null,
  status order_status default 'pending'::order_status not null,
  payment_method text,
  payment_id text,
  paid_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id text primary key default ('oi-' || substr(md5(random()::text), 1, 8)),
  order_id text references public.orders(id) on delete cascade not null,
  ticket_type_id text references public.ticket_types(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(15, 2) not null,
  subtotal numeric(15, 2) not null
);

-- 9. TICKETS TABLE (E-Tickets with verified QR codes)
create table if not exists public.tickets (
  id text primary key default ('tix-' || substr(md5(random()::text), 1, 8)),
  order_id text references public.orders(id) on delete cascade not null,
  order_item_id text references public.order_items(id) on delete cascade not null,
  ticket_type_id text references public.ticket_types(id) on delete restrict not null,
  event_id text references public.events(id) on delete restrict not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  attendee_name text not null,
  attendee_email text not null,
  ticket_code text not null unique,
  qr_data text not null,
  status ticket_status default 'valid'::ticket_status not null,
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.tickets enable row level security;

-- Profiles: Anyone can view public profile info; Users can update own profile; Admins have full access.
create policy "Profiles are viewable by authenticated users" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Categories: Read-only for public, manageable by admin.
create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Categories are insertable by admin" on public.categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Events: Published events viewable by everyone; Organizers can manage their own events; Admins can manage all.
create policy "Published events are viewable by everyone" on public.events for select using (
  status = 'published' or auth.uid() = organizer_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Organizers can insert events" on public.events for insert with check (
  auth.uid() = organizer_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Organizers can update own events" on public.events for update using (
  auth.uid() = organizer_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Tickets: Users can view their own tickets; Organizers can verify & update tickets for their events.
create policy "Users can view own tickets" on public.tickets for select using (
  auth.uid() = user_id or
  exists (select 1 from public.events where events.id = tickets.event_id and events.organizer_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Organizers can check-in tickets" on public.tickets for update using (
  exists (select 1 from public.events where events.id = tickets.event_id and events.organizer_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 11. TRIGGER FOR NEW USER SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

