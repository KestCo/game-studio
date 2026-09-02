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

create table if not exists public.your_story_drafts (
  draft_id text primary key,
  source_template_id text not null unique,
  source_game_id text not null default 'your-story' check (source_game_id = 'your-story'),
  story_number integer not null check (story_number > 0),
  week integer not null check (week > 0),
  day integer not null check (day between 1 and 7),
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'needs_revision', 'submitted', 'publication_ready', 'published')),
  editor_name text,
  draft jsonb not null,
  published jsonb,
  revision integer not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  published_at timestamptz
);

create index if not exists your_story_drafts_week_day_idx
  on public.your_story_drafts (week, day);

create index if not exists your_story_drafts_status_updated_idx
  on public.your_story_drafts (status, updated_at desc);

create table if not exists public.your_story_publications (
  publication_id uuid primary key default gen_random_uuid(),
  source_template_id text not null,
  revision integer not null check (revision > 0),
  action text not null default 'publish' check (action in ('publish', 'rollback')),
  source_revision integer,
  template jsonb not null,
  published_by text,
  published_at timestamptz not null default now(),
  unique (source_template_id, revision)
);

create index if not exists your_story_publications_story_revision_idx
  on public.your_story_publications (source_template_id, revision desc);

alter table public.your_story_drafts enable row level security;
alter table public.your_story_publications enable row level security;

drop policy if exists "your_story_drafts_read_status" on public.your_story_drafts;
create policy "your_story_drafts_read_status"
  on public.your_story_drafts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "your_story_publications_read" on public.your_story_publications;
create policy "your_story_publications_read"
  on public.your_story_publications
  for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.your_story_drafts from anon, authenticated;
revoke insert, update, delete on public.your_story_publications from anon, authenticated;
grant select on public.your_story_drafts to anon, authenticated;
grant select on public.your_story_publications to anon, authenticated;

create or replace function public.publish_your_story_snapshot(
  p_draft_id text,
  p_template jsonb,
  p_published_by text,
  p_action text default 'publish',
  p_source_revision integer default null
)
returns setof public.your_story_drafts
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.your_story_drafts%rowtype;
  next_revision integer;
  published_time timestamptz := now();
begin
  select * into current_row from public.your_story_drafts
  where draft_id = p_draft_id for update;
  if not found then raise exception 'Draft not found'; end if;
  if p_action not in ('publish', 'rollback') then raise exception 'Unknown publication action'; end if;
  if p_action = 'publish' and current_row.status <> 'publication_ready' then
    raise exception 'Command Center approval is required before publishing';
  end if;
  next_revision := current_row.revision + 1;
  insert into public.your_story_publications (
    source_template_id, revision, action, source_revision, template, published_by, published_at
  ) values (
    current_row.source_template_id, next_revision, p_action, p_source_revision,
    p_template, nullif(trim(p_published_by), ''), published_time
  );
  update public.your_story_drafts
  set status = 'published', published = p_template, revision = next_revision,
      published_at = published_time, updated_at = published_time
  where draft_id = p_draft_id returning * into current_row;
  return next current_row;
end;
$$;

revoke all on function public.publish_your_story_snapshot(text, jsonb, text, text, integer) from public, anon, authenticated;
grant execute on function public.publish_your_story_snapshot(text, jsonb, text, text, integer) to service_role;
