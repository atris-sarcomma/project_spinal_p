# PyForge — Interactive Python Learning Hub

A Vercel-ready interactive Python learning website based on the supplied 14-level checklist.

## Features

- All 14 roadmap levels and checklist items
- Persistent progress in browser localStorage
- Search + completed/not-completed filters
- Animated progress UI
- Topic lesson drawer with Learn / Task / Quiz tabs
- Built-in seed lessons for a few core concepts
- AI-generated deep explanations for every topic
- AI tutor chat with current-topic context
- Vercel serverless API route so the AI key stays server-side

## Run locally

Serve the folder with any local static server. For the AI route, use Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

Then set `OPENAI_API_KEY` in your local Vercel environment. You can copy `.env.example` to `.env.local` if using a framework wrapper, or add the variable through Vercel's project settings.

## Deploy

1. Put this folder in a GitHub repository.
2. Import the repository into Vercel.
3. Add `OPENAI_API_KEY` as a Project Environment Variable.
4. Optionally set `OPENAI_MODEL` to another model available to your API account.
5. Deploy.

Never put the API key in `app.js` or any browser-side file.
