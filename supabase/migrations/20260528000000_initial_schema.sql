-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- One row per authenticated user; synced from auth.users via trigger.
create table profiles (
  id        uuid primary key references auth.users on delete cascade,
  name      text not null,
  handle    text not null unique,
  ch        text not null,   -- single initial for avatar
  tone      text not null default 'b1',  -- avatar color theme
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

create policy "profiles_select_all" on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, handle, ch, tone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'handle', '@' || split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'ch', upper(left(split_part(new.email, '@', 1), 1))),
    coalesce(new.raw_user_meta_data->>'tone', 'b1')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── FOLLOWS (social graph) ──────────────────────────────────────────────────
create table follows (
  follower_id uuid not null references profiles on delete cascade,
  following_id uuid not null references profiles on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, following_id)
);
alter table follows enable row level security;

create policy "follows_select_all" on follows for select using (true);
create policy "follows_insert_own" on follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete_own" on follows for delete using (auth.uid() = follower_id);

-- ─── FAVORITES (starred friends) ─────────────────────────────────────────────
create table favorites (
  user_id     uuid not null references profiles on delete cascade,
  favorite_id uuid not null references profiles on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, favorite_id)
);
alter table favorites enable row level security;

create policy "favorites_select_own" on favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on favorites for delete using (auth.uid() = user_id);

-- ─── EVENTS ──────────────────────────────────────────────────────────────────
create table events (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references profiles on delete cascade,
  title          text not null,
  starts_at      timestamptz not null,
  ends_at        timestamptz,
  duration_label text,          -- "1h 30m"
  duration_note  text,          -- "flexible"
  place          text,
  place_address  text,
  visibility     text not null default 'open' check (visibility in ('open','favorites','pick')),
  photo          text not null default 'green',   -- color theme key
  accent         text,          -- "happening soon"
  description    text,
  created_at     timestamptz not null default now()
);
alter table events enable row level security;

-- ─── EVENT INVITES (for pick-visibility events) ───────────────────────────────
-- Must be created before events_select policy which references it.
create table event_invites (
  event_id   uuid not null references events on delete cascade,
  invitee_id uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, invitee_id)
);
alter table event_invites enable row level security;

-- ─── EVENTS POLICIES (after event_invites exists) ────────────────────────────
-- Visibility rules:
--   open      → anyone who follows the host can see it
--   favorites → only users the host has favorited
--   pick      → only users in event_invites
create policy "events_select" on events for select using (
  visibility = 'open'
  or host_id = auth.uid()
  or exists (
    select 1 from event_invites
    where event_id = events.id and invitee_id = auth.uid()
  )
);
create policy "events_insert_own" on events for insert with check (auth.uid() = host_id);
create policy "events_update_own" on events for update using (auth.uid() = host_id);
create policy "events_delete_own" on events for delete using (auth.uid() = host_id);

-- ─── EVENT INVITES POLICIES ───────────────────────────────────────────────────
create policy "invites_select_own" on event_invites for select
  using (auth.uid() = invitee_id or exists (
    select 1 from events where id = event_id and host_id = auth.uid()
  ));
create policy "invites_insert_host" on event_invites for insert with check (
  exists (select 1 from events where id = event_id and host_id = auth.uid())
);
create policy "invites_delete_host" on event_invites for delete using (
  exists (select 1 from events where id = event_id and host_id = auth.uid())
);

-- ─── RSVPs ───────────────────────────────────────────────────────────────────
create table rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
alter table rsvps enable row level security;

create policy "rsvps_select_all" on rsvps for select using (true);
create policy "rsvps_insert_own" on rsvps for insert with check (auth.uid() = user_id);
create policy "rsvps_delete_own" on rsvps for delete using (auth.uid() = user_id);

-- ─── COMMENTS ────────────────────────────────────────────────────────────────
create table comments (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  text       text not null,
  created_at timestamptz not null default now()
);
alter table comments enable row level security;

create policy "comments_select_all" on comments for select using (true);
create policy "comments_insert_own" on comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on comments for delete using (auth.uid() = user_id);

-- ─── COMMENT LIKES ───────────────────────────────────────────────────────────
create table comment_likes (
  comment_id uuid not null references comments on delete cascade,
  user_id    uuid not null references profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);
alter table comment_likes enable row level security;

create policy "comment_likes_select_all" on comment_likes for select using (true);
create policy "comment_likes_insert_own" on comment_likes for insert with check (auth.uid() = user_id);
create policy "comment_likes_delete_own" on comment_likes for delete using (auth.uid() = user_id);

-- ─── ACTIVITY FEED ───────────────────────────────────────────────────────────
-- Denormalized activity log; rows inserted by DB triggers below.
create table activity (
  id             uuid primary key default gen_random_uuid(),
  actor_id       uuid not null references profiles on delete cascade,
  target_user_id uuid not null references profiles on delete cascade,  -- who sees this
  event_id       uuid references events on delete cascade,
  type           text not null check (type in ('joined','commented','invited','posted','favorited')),
  message        text not null,
  subtext        text,
  created_at     timestamptz not null default now()
);
alter table activity enable row level security;

create policy "activity_select_own" on activity for select using (auth.uid() = target_user_id);

-- Trigger: fan activity to followers when a new event is posted
create or replace function fan_event_to_followers()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into activity (actor_id, target_user_id, event_id, type, message)
  select
    new.host_id,
    f.follower_id,
    new.id,
    'posted',
    (select name from profiles where id = new.host_id) || ' posted ' || new.title
  from follows f
  where f.following_id = new.host_id
    and f.follower_id <> new.host_id;
  return new;
end;
$$;

create trigger after_event_insert
  after insert on events
  for each row execute procedure fan_event_to_followers();

-- Trigger: notify host + attendees when someone joins an event
create or replace function notify_on_rsvp()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  actor_name text;
  event_title text;
  event_host  uuid;
begin
  select name into actor_name from profiles where id = new.user_id;
  select title, host_id into event_title, event_host from events where id = new.event_id;

  -- Notify the host
  if event_host <> new.user_id then
    insert into activity (actor_id, target_user_id, event_id, type, message)
    values (new.user_id, event_host, new.event_id, 'joined', actor_name || ' joined ' || event_title);
  end if;

  -- Notify followers of the person who joined
  insert into activity (actor_id, target_user_id, event_id, type, message)
  select
    new.user_id,
    f.follower_id,
    new.event_id,
    'joined',
    actor_name || ' joined ' || event_title
  from follows f
  where f.following_id = new.user_id
    and f.follower_id <> new.user_id
    and f.follower_id <> event_host;

  return new;
end;
$$;

create trigger after_rsvp_insert
  after insert on rsvps
  for each row execute procedure notify_on_rsvp();

-- Trigger: notify event host + going-list when someone comments
create or replace function notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  actor_name  text;
  event_title text;
  event_host  uuid;
begin
  select name into actor_name from profiles where id = new.user_id;
  select title, host_id into event_title, event_host from events where id = new.event_id;

  -- Notify the host (unless it's the host commenting)
  if event_host <> new.user_id then
    insert into activity (actor_id, target_user_id, event_id, type, message, subtext)
    values (new.user_id, event_host, new.event_id, 'commented',
            actor_name || ' commented on ' || event_title,
            '"' || left(new.text, 60) || '"');
  end if;

  -- Notify other attendees who have RSVP'd
  insert into activity (actor_id, target_user_id, event_id, type, message, subtext)
  select
    new.user_id,
    r.user_id,
    new.event_id,
    'commented',
    actor_name || ' commented on ' || event_title,
    '"' || left(new.text, 60) || '"'
  from rsvps r
  where r.event_id = new.event_id
    and r.user_id <> new.user_id
    and r.user_id <> event_host;

  return new;
end;
$$;

create trigger after_comment_insert
  after insert on comments
  for each row execute procedure notify_on_comment();

-- ─── USUALS ──────────────────────────────────────────────────────────────────
create table usuals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles on delete cascade,
  icon       text not null,
  name       text not null,
  sub        text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table usuals enable row level security;

create policy "usuals_select_own" on usuals for select using (auth.uid() = user_id);
create policy "usuals_insert_own" on usuals for insert with check (auth.uid() = user_id);
create policy "usuals_update_own" on usuals for update using (auth.uid() = user_id);
create policy "usuals_delete_own" on usuals for delete using (auth.uid() = user_id);

-- ─── USEFUL INDEXES ──────────────────────────────────────────────────────────
create index events_host_id_idx        on events (host_id);
create index events_starts_at_idx      on events (starts_at);
create index rsvps_event_id_idx        on rsvps (event_id);
create index rsvps_user_id_idx         on rsvps (user_id);
create index comments_event_id_idx     on comments (event_id);
create index activity_target_idx       on activity (target_user_id, created_at desc);
create index follows_following_id_idx  on follows (following_id);
