# Milestone Timeline

## Current Functionality

Our milestone target is Zone 1: either the front-end or back-end is functional. We chose the front-end path, and the current system meets that checkpoint. This is not a launch-ready product yet, but it is a working React app populated with fake data where a user can click around and experience the core social flow without a server or database.

Our git history reflects the real order of work. We spent most of the early project time designing the interface before importing it into the codebase. The first substantial commit added wireframes, an iOS frame, the style guide, and high-fidelity Timeline screens under `design/`. Those files defined the tone of the product: a mobile-first feed for lightweight social plans, with strong emphasis on fast scanning, low-friction RSVPs, and recurring "usual" events. After that design pass, we scaffolded the Next.js app and translated the references into React components.

The current app is a mobile-width social event timeline built with Next.js/React. It uses mock users, mock events, and local UI state, but the front-end experience is functional. A user can browse events by day, see event cards ordered by time, open an event detail page, join or leave an event, inspect attendees, draft comments, favorite friends, filter activity, view their own profile, and start a new event post. The add-event flow includes both "usuals" and a fresh event form with fields for title, timing, duration, place, visibility, and notes. The main limitation is persistence: actions update local frontend state but are not yet stored in a backend. That limitation is intentional for this milestone and matches the Zone 1 example of a working frontend with fake data.

The screenshots below cover the main usable surfaces of the system: the feed, friend graph controls, notifications/activity, user profile, event detail view, comments, and event creation. Together, they show that the milestone is not just a static mockup, but a navigable frontend with the core interaction patterns already in place.

## Screenshots

![Feed screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.22.45.png>)

![Friends screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.22.52.png>)

![Activity screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.23.00.png>)

![Profile screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.23.14.png>)

![Event detail screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.29.40.png>)

![Comments screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.29.49.png>)

![Add event usuals screen](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.30.00.png>)

![New event form](</Users/maximivanov/Desktop/Screenshot 2026-05-08 at 20.31.43.png>)

## Completion Timeline

- May 7 to May 9: Complete the design-to-code milestone. Finish the hi-fi frontend import, verify the build, capture screenshots, and document the functional mock-data app.
- May 10 to May 17: Convert the prototype into a launchable system while balancing exam studying. Main TODOs: backend models, event APIs, RSVP persistence, comments, account state, and final frontend polish.
- May 18 to May 24: Run integration QA and prepare launch. Test the full event lifecycle, fix reload/state issues, seed realistic demo data, and recruit the first pilot users.
- May 25 to May 31: Launch to our target group and gather moderate Zone 1 usage. Track active users, posts, RSVPs, comments, and friction in the "usuals" posting flow.
- June 1 to June 5: Analyze usage, finish the final paper, prepare the demo/video, continue exam review, and package the repository, screenshots, and final submission.
