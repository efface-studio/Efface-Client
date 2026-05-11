# Demo Generation Worker

Receives a `jobId` from the main Next.js app, generates a single-file HTML demo with Claude, uploads it to Supabase Storage, and emails the client a link.

## Setup

### 1. Supabase
1. Create a project at https://supabase.com
2. SQL Editor → paste and run [`../supabase/schema.sql`](../supabase/schema.sql)
3. Copy the project URL and the **service_role** key (Settings → API)

### 2. Railway
1. New Project → Deploy from GitHub repo, root directory `worker/`
2. Add the env vars from [.env.example](.env.example) — generate `WORKER_SECRET` with `openssl rand -hex 32`
3. Once deployed, copy the public URL

### 3. Next.js (Vercel)
Set in Vercel → Project Settings → Environment Variables (or `.env.local` for local dev):

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
WORKER_URL=https://your-worker.up.railway.app
WORKER_SECRET=...     # same value as on Railway
```

## Flow

1. User submits `/apply` form
2. `app/api/apply/route.ts` → inserts row in `demo_jobs` (status=pending) → POSTs `{jobId}` to worker
3. Worker → status=building → Claude API → upload HTML to `demos/<slug>.html` → status=ready → email user with `/demo/<slug>` link
4. User opens `/demo/<slug>` → Next.js fetches job, iframes the public Storage URL

## Local testing

```sh
cd worker
cp .env.example .env
# fill values
npm install
node --env-file=.env index.js
```

Then in main app, set `WORKER_URL=http://localhost:8080` in `.env.local` and submit a form.

## Cleanup cron (run once after deploy)

Demos auto-expire after 7 days. Register this in Supabase Dashboard → **Database → Cron Jobs → New Job**:

- Schedule: `0 18 * * *` (UTC 18:00 = KST 03:00)
- Command: `select cleanup_old_demos();`

The function `cleanup_old_demos()` is created by [supabase/schema.sql](../supabase/schema.sql) and removes both the `demo_jobs` row and its Storage object.
