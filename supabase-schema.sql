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
