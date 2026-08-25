# Sarokar — Nepal ko kaam, aba sajilo.

AI-powered guide for Nepali government processes, documents, and everyday questions — plus **K Cha Ta?**, a live Nepali news engine with AI summaries written in Roman Nepali.

Built with Next.js (App Router), React 19, and Tailwind CSS 4.

## Features

- **Sarokar chat** — step-by-step guidance for PAN cards, passports, driving licences, citizenship and more, grounded in a curated verified-topic database (`lib/topics.ts`)
- **K Cha Ta? news** — RSS ingestion from 11 Nepali publishers, keyword scoring for trending stories, on-demand article summaries with caching
- **Resilient AI layer** (`lib/ai/`) — streaming responses with multi-provider failover:
  `Gemini → Groq → Cerebras → OpenRouter` (all free tiers), with per-provider retries, exponential backoff, and a circuit breaker that stops hammering providers that keep failing
- **Abuse protection** — per-session burst/daily limits, per-IP hourly guard, prompt sanitization, SSRF allowlist for article fetching
- **SEO & sharing** — dynamic OG images, sitemap, robots, JSON-LD

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in at least GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

## Environment variables

See [.env.example](.env.example) for the full annotated list. Required:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Primary AI provider ([aistudio.google.com](https://aistudio.google.com)) |
| `GROQ_API_KEY` | Failover provider ([console.groq.com](https://console.groq.com)) |
| `CEREBRAS_API_KEY` | Optional failover ([cloud.cerebras.ai](https://cloud.cerebras.ai) — free tier needs billing info added first) |
| `OPENROUTER_API_KEY` | Last-resort free-model provider ([openrouter.ai](https://openrouter.ai)) |

All AI keys are server-side only — they never reach the browser.

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run lint        # eslint
npm test            # unit tests (vitest)
npm run test:watch  # tests in watch mode
```

## Architecture

```
app/
  api/chat/                 # Sarokar chat endpoint (NDJSON stream)
  api/kcha/                 # trending / news / summary endpoints
components/
  chat/                     # shared streaming chat UI
  kchata/                   # K Cha Ta? feature components
lib/
  ai/                       # provider registry, failover, retries,
    │                       # circuit breaker, rate limits, sessions
    └── providers/          # gemini + OpenAI-compatible adapters
  kcha/                     # news index (RSS), article fetcher (SSRF-safe)
  topics.ts                 # verified government-process database
```

Request flow: client → route handler (`app/api/chat`) → validation & rate limits → topic lookup → `chatWithFallback()` tries providers in order until one streams → NDJSON stream to browser.

## Deployment

Deploys as a standard Next.js app (Vercel works out of the box). Set the environment variables above in your hosting dashboard. Never commit real keys.
