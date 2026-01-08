---
description: Deployment workflow for Midnight Gospel 3D to Vercel
---

# Deployment Workflow

## Prerequisites

1. Vercel CLI installed: `npm install -g vercel`
2. Logged in to Vercel: `vercel login`
3. Project linked: `vercel link`

## Deploy to Production

// turbo-all

1. First, verify build succeeds:
```bash
npm run build
```

2. Preview production build locally:
```bash
npm run preview
```

3. Deploy to Vercel:
```bash
vercel --prod
```

## Environment Variables (Vercel Dashboard)

Set these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_GOOGLE_API_KEY=<your-gemini-api-key>
VITE_GA_TRACKING_ID=<your-analytics-id>
```

## Quick Deploy (One Command)

```bash
npm run build && vercel --prod
```

## Rollback

```bash
vercel rollback
```

## View Deployment Logs

```bash
vercel logs <deployment-url>
```

## Deployment Checklist

- [ ] Build succeeds locally: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] Preview works: `npm run preview`
- [ ] Environment variables set in Vercel
- [ ] Deploy: `vercel --prod`
- [ ] Test production URL
- [ ] Verify all 6 levels work
- [ ] Check mobile responsiveness
- [ ] Confirm audio plays
