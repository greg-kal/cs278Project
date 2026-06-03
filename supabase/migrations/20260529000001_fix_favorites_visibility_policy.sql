-- Fix: events with visibility='favorites' were only visible to the host.
-- Add a clause so the host's favorites can also see the event.
drop policy if exists "events_select" on events;

create policy "events_select" on events for select using (
  visibility = 'open'
  or host_id = auth.uid()
  or (
    visibility = 'favorites'
    and exists (
      select 1 from favorites
      where user_id = events.host_id and favorite_id = auth.uid()
    )
  )
  or exists (
    select 1 from event_invites
    where event_id = events.id and invitee_id = auth.uid()
  )
);
