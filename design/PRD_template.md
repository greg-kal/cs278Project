# [App Name] — Product Requirements

## 1. Overview
We are building a social event timeline, where users can post events (think a 
concert or presentation, or a proposition to play sports) to their followers.
The user interface is a daily calendar-type feed with all the events posted by 
accounts the user follows, in order of time from soonest to furthest away. All 
the design references are stored in the GitHub under design folder. 


## 2. Tech Stack
- Framework: Next.js 14 (App Router) / React / etc.
- Styling: Tailwind CSS
- Deployment: Vercel
- Auth: Clerk / NextAuth / none
- DB: Supabase / Postgres / none
- Key libs: date-fns / @fullcalendar/react / twilio / resend

## 3. Design References
- `/designs/` is the design folder with all references, titled by function
Examples: 
- `/designs/wireframes.html` → wireframes
- `/designs/timeline-hifi.html` → Timeline UI design guide
- `/designs/style-guide.html` → Design Reference / Style guide (IMPORTANT)

> Treat these (especially style guide) as pixel-level references. Match spacing, typography,
> color tokens, and component hierarchy exactly. When building features, find
> that feature in the design folder before implementing it. 

## 4. Pages & Routes


## 5. Core Features (prioritized)
### P0 — Must ship
- [ ] Create Post: Title, Description, date, time. 
- [ ] Feed Post: Must have Title, Description, time, ATTEND button, 
user ID who made post, attendees (list of users), comment section (open to attendees), 
- [ ] Feed: Posts in order of time, from all accounts you follow. Each post preview 
should display event title, time, preview of description attendees. Each day 
should have its own feed, all organized in order of earliest to latest. 
- [ ] Account: Must track following / followers. Track all events posted and all
events planned to attend. 

### P1 — Nice to have
- [ ] Account page: See your account, previously attended events, followers /
following, suggested accounts (Only build if easy)
- [ ] Suggested post: Let's say you usually make event Movie Night at 7pm on 
Friday/Saturday. App offers you suggestion to post this event to your followers. 

## 6. Data Models
```typescript
// Define your types explicitly so the LLM uses them
interface User { id: string; email: string; createdAt: Date }
interface Item { id: string; userId: string; name: string; status: 'active' | 'archived' }
```

## 7. API Contracts
### GET /api/items
NOT BUILDING BACKEND YET
- Auth: Bearer token
- Response: `{ items: Item[], total: number }`
- Errors: 401 (unauthed), 500

## 8. Environment Variables
 NOT BUILDING BACKEND YET. 
```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_KEY=
CLERK_SECRET_KEY=
```

## 9. Out of Scope
- No mobile app yet
- No i18n
- No Favorites feed or "close friends" features in v1
