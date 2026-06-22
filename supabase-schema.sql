create table if not exists public.studio_game_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  game_id text not null check (game_id in ('studio', 'word-architect', 'top-tier', 'your-story')),
  event_name text not null,
  session_id text not null,
  source text,
  route text,
  referrer text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists studio_game_events_game_time_idx
  on public.studio_game_events (game_id, occurred_at desc);

create index if not exists studio_game_events_name_time_idx
  on public.studio_game_events (event_name, occurred_at desc);

alter table public.studio_game_events enable row level security;

drop policy if exists "Allow public analytics inserts" on public.studio_game_events;
create policy "Allow public analytics inserts"
  on public.studio_game_events
  for insert
  to anon, authenticated
  with check (
    game_id in ('studio', 'word-architect', 'top-tier', 'your-story')
    and length(event_name) between 2 and 80
    and length(session_id) between 8 and 80
  );

create or replace view public.studio_game_daily_stats as
select
  occurred_at::date as event_date,
  game_id,
  event_name,
  count(*)::int as total_count,
  sum(
    case
      when payload ? 'correct' and (payload->>'correct')::boolean then 1
      else 0
    end
  )::int as correct_count,
  round(avg(nullif(payload->>'seconds_used', '')::numeric), 1) as avg_seconds,
  max(occurred_at) as latest_at
from public.studio_game_events
group by occurred_at::date, game_id, event_name;

grant insert on public.studio_game_events to anon, authenticated;
grant select on public.studio_game_daily_stats to anon, authenticated;

create table if not exists public.top_tier_drafts (
  draft_id text primary key,
  source_game_id text not null,
  week integer not null,
  day integer not null,
  label text not null,
  status text not null default 'draft',
  editor_name text,
  news_organization text,
  draft jsonb not null,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz
);

alter table public.top_tier_drafts enable row level security;

-- Early workflow policies for a private editor portal.
-- Before broad public sharing, replace these with authenticated editor roles.
drop policy if exists "top_tier_drafts_select" on public.top_tier_drafts;
drop policy if exists "top_tier_drafts_insert" on public.top_tier_drafts;
drop policy if exists "top_tier_drafts_update" on public.top_tier_drafts;

create policy "top_tier_drafts_select"
  on public.top_tier_drafts
  for select
  using (true);

create policy "top_tier_drafts_insert"
  on public.top_tier_drafts
  for insert
  with check (true);

create policy "top_tier_drafts_update"
  on public.top_tier_drafts
  for update
  using (true)
  with check (true);

grant select, insert, update on public.top_tier_drafts to anon, authenticated;

create table if not exists public.word_architect_drafts (
  draft_id text primary key,
  source_game_id text not null,
  week integer,
  day integer,
  title text,
  status text not null default 'draft',
  editor_name text,
  publication text,
  draft jsonb not null,
  updated_at timestamptz not null default now(),
  submitted_at timestamptz
);

alter table public.word_architect_drafts enable row level security;

-- Early workflow policies for a private editor portal.
-- Before broad public sharing, replace these with authenticated editor roles.
drop policy if exists "word_architect_drafts_select" on public.word_architect_drafts;
drop policy if exists "word_architect_drafts_insert" on public.word_architect_drafts;
drop policy if exists "word_architect_drafts_update" on public.word_architect_drafts;

create policy "word_architect_drafts_select"
  on public.word_architect_drafts
  for select
  using (true);

create policy "word_architect_drafts_insert"
  on public.word_architect_drafts
  for insert
  with check (true);

create policy "word_architect_drafts_update"
  on public.word_architect_drafts
  for update
  using (true)
  with check (true);

grant select, insert, update on public.word_architect_drafts to anon, authenticated;
