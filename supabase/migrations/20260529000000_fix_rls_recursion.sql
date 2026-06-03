-- Fix infinite recursion in event_invites RLS policy.
-- The original invites_select_own policy queried back into `events` to check
-- host ownership, which created a cycle:
--   events_select → event_invites → invites_select_own → events → ...
-- Invitees only need to see their own invite rows; hosts access invites
-- through their event ownership, not through this policy.
drop policy if exists "invites_select_own" on event_invites;

create policy "invites_select_own" on event_invites for select
  using (auth.uid() = invitee_id);
