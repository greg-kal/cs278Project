create table reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references profiles on delete cascade,
  event_id     uuid references events on delete set null,
  event_title  text,          -- snapshot in case event is deleted
  reason       text not null,
  created_at   timestamptz not null default now()
);
alter table reports enable row level security;

-- Authenticated users can file a report
create policy "reports_insert_own" on reports
  for insert with check (auth.uid() = reporter_id);

-- Reporters can see their own reports
create policy "reports_select_own" on reports
  for select using (auth.uid() = reporter_id);

create index reports_created_at_idx on reports (created_at desc);
create index reports_event_id_idx   on reports (event_id);
