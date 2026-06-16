-- Supabase Database Schema for AdGravity AI
-- Features: User profiles synced with auth.users, business details, and 7-day trial subscriptions for ₹1 (INR).

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile."
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile."
    on public.profiles for update
    using (auth.uid() = id);

-- 2. BUSINESS DETAILS TABLE
create table public.businesses (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade unique not null,
    company_name text not null,
    details jsonb default '{}'::jsonb not null, -- Stores industry, budget, targeted platforms, etc.
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for businesses
alter table public.businesses enable row level security;

-- RLS Policies for businesses
create policy "Users can view their own business details."
    on public.businesses for select
    using (auth.uid() = profile_id);

create policy "Users can insert their own business details."
    on public.businesses for insert
    with check (auth.uid() = profile_id);

create policy "Users can update their own business details."
    on public.businesses for update
    using (auth.uid() = profile_id);

-- 3. SUBSCRIPTIONS TABLE (7-Day Trial Logic for ₹1)
create table public.subscriptions (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete cascade unique not null,
    plan_type text not null default 'trial' check (plan_type in ('trial', 'premium', 'pro')),
    status text not null default 'active' check (status in ('active', 'expired', 'canceled')),
    price_paid numeric(10, 2) not null default 1.00, -- ₹1
    currency text not null default 'INR',
    trial_start timestamp with time zone default timezone('utc'::text, now()),
    trial_end timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days'), -- 7 days calculation
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for subscriptions
alter table public.subscriptions enable row level security;

-- RLS Policies for subscriptions
create policy "Users can view their own subscription status."
    on public.subscriptions for select
    using (auth.uid() = profile_id);

-- Normally subscriptions are updated by system/webhooks (bypassing RLS with service role key),
-- but we define read-only policy for standard users for maximum security.


-- 4. PROFILE SYNCRONIZATION TRIGGER (Auth Signup Callback)
-- Automatically inserts a new profile row when a new auth.users account is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
