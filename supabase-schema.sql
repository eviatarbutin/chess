-- ============================================================================
-- ChessLens: User Profile, Analysis History & Saved Games
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- Custom enum types
create type time_control_pref as enum ('bullet', 'blitz', 'rapid', 'classical', 'correspondence');
create type color_pref as enum ('white', 'black', 'random');
create type analysis_type as enum ('dashboard', 'ratings', 'openings', 'games', 'activity', 'weaknesses', 'compare');

-- ============================================================================
-- profiles
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  lichess_username text,
  chess_com_username text,
  favorite_time_control time_control_pref default 'rapid',
  preferred_color color_pref default 'random',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- analysis_history
-- ============================================================================
create table public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analyzed_username text not null,
  analysis_type analysis_type not null,
  created_at timestamptz default now()
);

create index idx_analysis_history_user on public.analysis_history(user_id, created_at desc);

alter table public.analysis_history enable row level security;

create policy "Users can view their own analysis history"
  on public.analysis_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analysis history"
  on public.analysis_history for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- saved_games
-- ============================================================================
create table public.saved_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lichess_game_id text not null,
  lichess_username text not null,
  notes text,
  saved_at timestamptz default now(),
  unique(user_id, lichess_game_id)
);

create index idx_saved_games_user on public.saved_games(user_id, saved_at desc);

alter table public.saved_games enable row level security;

create policy "Users can view their own saved games"
  on public.saved_games for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved games"
  on public.saved_games for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved games"
  on public.saved_games for delete
  using (auth.uid() = user_id);

create policy "Users can update their own saved games"
  on public.saved_games for update
  using (auth.uid() = user_id);
