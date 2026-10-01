# ReachInbox – Full-Stack Email Job Scheduler

A production-grade email scheduler with BullMQ, Redis, PostgreSQL, Elasticsearch, Slack notifications, and a Next.js dashboard.

---

## Quick Start

### 1. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts PostgreSQL (5432), Redis (6379), and Elasticsearch (9200).

---

### 2. Backend Setup

```bash
cd backend
cp .env .env          # already exists – fill in your values
npm install
npm run db:generate   # generate Prisma client
npm run db:migrate    # apply DB schema (requires DB to be running)
```

**Run the API server:**
```bash
npm run dev
```

**Run the BullMQ worker (separate terminal):**
```bash
npm run worker
```

**BullMQ Dashboard:** http://localhost:4000/admin/queues

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `SESSION_SECRET` | Express session secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | `http://localhost:4000/auth/google/callback` |
| `FRONTEND_URL` | `http://localhost:3000` |
| `SLACK_CLIENT_ID` | Slack app client ID |
| `SLACK_CLIENT_SECRET` | Slack app client secret |
| `SLACK_REDIRECT_URI` | `http://localhost:4000/slack/callback` |
| `ELASTICSEARCH_URL` | `http://localhost:9200` |
| `WORKER_CONCURRENCY` | Number of parallel email jobs (default: 5) |
| `EMAIL_SEND_DELAY_MS` | Min delay between sends in ms (default: 2000) |
| `MAX_EMAILS_PER_HOUR_PER_SENDER` | Hourly rate limit per sender (default: 200) |
| `PORT` | API server port (default: 4000) |

### Ethereal Email Setup

Ethereal accounts are created automatically on worker startup — no config needed. The worker logs the preview URL for every sent email to the console.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:4000/auth/google/callback` as an authorized redirect URI
4. Copy Client ID and Secret into `.env`

### Slack App Setup

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. Add OAuth scope: `chat:write`
3. Set redirect URL: `http://localhost:4000/slack/callback`
4. Copy Client ID and Secret into `.env`

---

## Architecture Overview

### Scheduling Flow

```
Frontend → POST /emails/schedule
  → Creates Email records in PostgreSQL (status=SCHEDULED)
  → Adds BullMQ delayed jobs (jobId = emailId for idempotency)
  → Indexes emails in Elasticsearch

BullMQ Worker (separate process):
  → Picks up jobs when delay expires
  → Checks rate limit via Redis counter (key: rate:{sender}:{hour})
  → If limit exceeded: re-queues job with delay to next hour window + notifies Slack
  → Sends email via Ethereal SMTP
  → Updates DB status to SENT/FAILED
  → Updates Elasticsearch index
```

### Persistence on Restart

- BullMQ jobs are stored in **Redis** with `appendonly yes` (AOF persistence).
- After a server restart, Redis retains all delayed jobs — they fire at the correct scheduled time automatically.
- The DB is the source of truth for status; the worker checks `status === SENT` before processing to prevent duplicates.

### Rate Limiting

- **Mechanism:** Redis `INCR` on key `rate:{senderEmail}:{hourEpoch}` with 2h TTL.
- **Safe across multiple workers:** Redis atomic `INCR` ensures no race conditions.
- **When limit is hit:** Job is re-queued with `delay = msUntilNextHour()` — jobs are never dropped.
- **Slack notification:** Sent once when the limit is first exceeded for a sender in a given hour.
- **Configurable:** `MAX_EMAILS_PER_HOUR_PER_SENDER` env var.

### Concurrency

- BullMQ worker runs with configurable `concurrency` (default: 5 parallel jobs).
- Each job has a `EMAIL_SEND_DELAY_MS` sleep (default: 2s) to throttle sends.
- Idempotency: `jobId = emailId` prevents duplicate BullMQ jobs; DB status check prevents re-sending.

### Behavior Under Load (1000+ emails)

- All 1000 jobs are added to BullMQ with staggered delays based on `delayBetweenMs`.
- Worker processes up to `CONCURRENCY` jobs in parallel.
- When `MAX_EMAILS_PER_HOUR_PER_SENDER` is reached, excess jobs are automatically pushed to the next hour window.
- Order is preserved as much as possible (FIFO within each hour window).

---

## Features Implemented

### Backend
- ✅ Email scheduling via BullMQ delayed jobs (no cron)
- ✅ PostgreSQL persistence via Prisma ORM
- ✅ Idempotent job scheduling (jobId = emailId)
- ✅ Persistence across restarts (Redis AOF + DB state check)
- ✅ Ethereal Email SMTP (auto-provisioned)
- ✅ Configurable worker concurrency
- ✅ Min delay between sends (configurable)
- ✅ Per-sender hourly rate limiting via Redis counters
- ✅ Jobs rescheduled to next hour on rate limit (never dropped)
- ✅ Slack OAuth + real-time rate limit notifications
- ✅ Elasticsearch indexing + full-text search (`GET /emails/search?q=`)
- ✅ Bull Board live queue dashboard at `/admin/queues`
- ✅ Google OAuth authentication

### Frontend
- ✅ Google OAuth login
- ✅ Dashboard with Scheduled / Sent tabs
- ✅ Compose modal with CSV upload, scheduling options
- ✅ Auto-refresh every 10 seconds
- ✅ Loading states, empty states, error toasts
- ✅ Slack connect/disconnect in header
- ✅ TypeScript throughout

---

## Assumptions & Trade-offs

- **Ethereal accounts** are ephemeral (new account per worker start). In production, use a real SMTP provider.
- **Elasticsearch** is optional — if unavailable, the API still works (search endpoint will fail gracefully).
- **Slack notifications** are per-user/tenant; if no Slack token is stored, rate-limit hits are silently skipped.
- **`delayBetweenMs`** in the schedule API staggers job delays at scheduling time (not worker-side), which is simpler and avoids worker-level serialization.
- The hourly limit is enforced **per sender email**, not per user, to match real-world email provider throttling.
