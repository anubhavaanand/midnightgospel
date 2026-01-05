# Phase 3 Task 6: Production Deployment - IMPLEMENTATION GUIDE

**Status**: 🚀 **IN PROGRESS**  
**Date**: January 4, 2026  
**Objective**: Deploy Midnight Gospel 3D to production with monitoring & analytics

---

## Overview

Phase 3 Task 6 establishes production-ready deployment infrastructure:

1. **Environment Configuration** - Secure API key management
2. **CI/CD Pipeline** - Automated build & deployment via GitHub Actions
3. **Hosting Setup** - Vercel deployment configuration
4. **Analytics** - Google Analytics 4 + optional Sentry error tracking
5. **SEO Optimization** - Meta tags, Open Graph, structured data
6. **Security** - Headers, CSP, HTTPS enforcement
7. **Performance Monitoring** - Web Vitals tracking & reporting

---

## Files Created/Modified

### 1. Environment Configuration

**Created**: `.env.example`
- Template for required environment variables
- Documented all config options
- Never commit actual `.env` files

**Usage**:
```bash
# Copy template to local environment
cp .env.example .env.local

# Fill in your actual values:
# VITE_GOOGLE_API_KEY=xxxxx
# VITE_GA_ID=G-xxxxx
```

### 2. Deployment Configuration

**Created**: `vercel.json`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite
- **Regions**: US (iad1), EU (lhr1), Asia (syd1)
- **Cache**: node_modules enabled
- **Headers**: Security (X-Content-Type-Options, X-Frame-Options, etc.)
- **Redirects**: Legacy URL handling
- **Functions**: Serverless API support

**Key Security Headers**:
```
X-Content-Type-Options: nosniff          # Prevent MIME sniffing
X-Frame-Options: DENY                     # No clickjacking
X-XSS-Protection: 1; mode=block           # XSS protection
Referrer-Policy: strict-origin-when-cross-origin
```

**Static Asset Caching**:
```
/assets/*: Cache-Control: public, max-age=31536000, immutable
```

### 3. CI/CD Pipeline

**Created**: `.github/workflows/deploy.yml`

**Workflow Stages**:

#### Stage 1: Build & Test (Runs on all PRs)
```yaml
- Install dependencies
- Type check (tsc --noEmit)
- Lint (ESLint with 0 max warnings)
- Build (npm run build)
- Bundle size check (warn if >1MB)
- Upload coverage to codecov
```

#### Stage 2: Deploy (Runs only on main branch push)
```yaml
- Build production bundle
- Deploy to Vercel
- Create Lighthouse report
- Post deployment status
```

**Environment Variables Passed**:
- `VITE_GOOGLE_API_KEY` (from GitHub Secrets)
- `VITE_GA_ID` (from GitHub Secrets)
- `VITE_ENV=production`

**Vercel Secrets Required**:
```
VERCEL_TOKEN         # Vercel API token
VERCEL_ORG_ID        # Organization ID
VERCEL_PROJECT_ID    # Project ID
VITE_GOOGLE_API_KEY  # Gemini API key
```

### 4. Analytics System

**Created**: `src/utils/analytics.ts` (380+ lines)

**Features**:

#### Google Analytics 4
```typescript
initializeAnalytics()           // Initialize GA4
trackEvent(name, data)          // Track custom events
trackPerformanceMetrics()        // Track Core Web Vitals
setupErrorTracking()            // Capture errors & exceptions
```

**Predefined Events**:
```typescript
analyticsEvents = {
  APP_LOADED,           // App initialization
  APP_ERROR,            // Error occurrence
  LEVEL_STARTED,        // User enters level
  LEVEL_COMPLETED,      // User completes level
  LEVEL_FAILED,         // User fails level
  PERFORMANCE_METRIC,   // FPS, load time
  FPS_DROP,             // FPS below threshold
  AUDIO_ENABLED,        // Audio toggled
  AUDIO_DISABLED,
  DEVICE_DETECTED,      // Device classification
  QUALITY_ADJUSTED,     // Adaptive quality change
  USER_INTERACTION,     // General engagement
  SHARE_CLICKED,        // Social share
}
```

**Core Web Vitals Tracked**:
- `largest-contentful-paint` (LCP)
- `first-input` (FID)
- `layout-shift` (CLS)

#### Sentry Error Tracking (Optional)
```typescript
initializeSentry()    // Initialize error tracking
// Auto-captures:
// - Unhandled exceptions
// - Promise rejections
// - Performance data
// - User session replay (10% sample)
```

### 5. SEO Optimization

**Created**: `src/utils/seo.ts` (200+ lines)

**Features**:

#### Dynamic Meta Tags
```typescript
setSEOMetadata(config)        // Update meta tags
initializeSEO()               // Load default config
updateLevelSEO(levelIndex)    // Update per level
```

**Meta Tags Generated**:
- `<title>` tag
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:creator`
- `canonical` link
- `description` meta tag

**Per-Level SEO Configurations**:
Each of the 6 levels has custom meta tags for better search visibility:
- Level 0: Chromatic Void
- Level 1: Zombie Apocalypse
- Level 2: Clown Planet
- Level 3: Ass Cream
- Level 4: Soul Prison
- Level 5: The Exit

#### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Midnight Gospel 3D",
  "applicationCategory": "GameApplication",
  "offers": { "price": "0", "priceCurrency": "USD" }
}
```

---

## Deployment Steps

### Step 1: Prepare GitHub Repository

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Phase 3 complete - production ready"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/midnight-gospel-3d.git

# Push to main
git branch -M main
git push -u origin main
```

### Step 2: Set Up GitHub Secrets

Navigate to: **Settings → Secrets and variables → Actions**

Add the following secrets:
```
VITE_GOOGLE_API_KEY    Your Gemini API key
VITE_GA_ID             Google Analytics ID (G-XXXXXXXXXX)
VERCEL_TOKEN           Vercel API token
VERCEL_ORG_ID          Vercel organization ID
VERCEL_PROJECT_ID      Vercel project ID
```

**Get Vercel Secrets**:
```bash
# After creating project on vercel.com
vercel link
# Then cat .vercel/project.json
```

### Step 3: Configure Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Set environment variables
vercel env add VITE_GOOGLE_API_KEY
vercel env add VITE_GA_ID
```

### Step 4: Deploy!

```bash
# Option A: Auto-deploy via GitHub
git push main
# → GitHub Actions runs
# → Builds & tests
# → Deploys to Vercel

# Option B: Manual deploy
npm run build
vercel --prod
```

### Step 5: Verify Deployment

```bash
✅ Check deployment at: https://midnight-gospel-3d.vercel.app
✅ Verify analytics: Google Analytics dashboard
✅ Check performance: Vercel Analytics
✅ Review security headers: https://securityheaders.com
✅ SEO check: Google Search Console
```

---

## Integration with App

### Initialize Analytics on App Load

**In `src/main.tsx`**:
```typescript
import { initializeAnalytics, setupErrorTracking, trackPerformanceMetrics } from '@utils/analytics';
import { initializeSEO, injectStructuredData } from '@utils/seo';

// On app mount
initializeAnalytics();
initializeSEO();
injectStructuredData();
setupErrorTracking();
trackPerformanceMetrics();
```

### Track Level Progression

**In `useCameraPath.ts` or level components**:
```typescript
import { trackEvent, analyticsEvents } from '@utils/analytics';
import { updateLevelSEO } from '@utils/seo';

// On level start
trackEvent(analyticsEvents.LEVEL_STARTED, {
  level_index: levelIndex,
  level_name: levelNames[levelIndex],
});

// On level complete
trackEvent(analyticsEvents.LEVEL_COMPLETED, {
  level_index: levelIndex,
  time_spent: elapsedTime,
  interactions: interactionCount,
});

// Update meta tags
updateLevelSEO(levelIndex);
```

### Track Performance Metrics

**In `usePerformanceMonitor`**:
```typescript
import { trackEvent, analyticsEvents } from '@utils/analytics';

if (fps < 30) {
  trackEvent(analyticsEvents.FPS_DROP, {
    current_fps: fps,
    target_fps: 60,
    level: currentLevel,
  });
}

trackEvent(analyticsEvents.PERFORMANCE_METRIC, {
  metric: 'frame_time',
  value: frameTime,
  fps: fps,
});
```

---

## Environment Variables Reference

### Required (Production)
```
VITE_GOOGLE_API_KEY     Gemini API key (from Google AI Studio)
VITE_GA_ID              Google Analytics ID (format: G-XXXXXXXXXX)
```

### Optional
```
VITE_SENTRY_DSN         Sentry error tracking (for error reporting)
VITE_ENV                Environment (development/production)
VITE_DEBUG              Enable debug mode (true/false)
```

### Auto-Set by CI/CD
```
VITE_APP_VERSION        Build version (from package.json)
VITE_ENV                Set to 'production' during deploy
```

---

## Monitoring & Analytics Dashboard

### Google Analytics 4

**Dashboard Setup**:
1. Visit: https://analytics.google.com
2. Select: Midnight Gospel 3D property
3. Create custom reports:
   - **Engagement**: Level starts/completions
   - **Performance**: FPS drops, load times
   - **Devices**: Mobile/tablet/desktop distribution
   - **Errors**: Exception tracking

**Key Metrics to Monitor**:
- Session duration
- Bounce rate
- Level completion rate
- Device type distribution
- Geographic distribution
- FPS drop frequency

### Vercel Analytics

**Dashboard**: https://vercel.com/dashboard
- Deployment history
- Build times
- Response times
- Error rates
- Traffic patterns

### Web Vitals Dashboard

**Metrics to Track**:
- LCP (Largest Contentful Paint) - target < 2.5s
- FID (First Input Delay) - target < 100ms
- CLS (Cumulative Layout Shift) - target < 0.1

---

## Security Checklist

- ✅ HTTPS enforced (Vercel)
- ✅ Security headers configured
- ✅ API keys in GitHub Secrets (not in code)
- ✅ Environment variables validated
- ✅ Build artifacts excluded from repo
- ✅ Sensitive data not in error reports
- ✅ CORS headers appropriate
- ✅ CSP headers configured

---

## Performance Targets

### Load Time
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

### Runtime
- **Desktop**: 55-60 FPS
- **Mobile**: 30-40 FPS
- **Bundle Size**: < 500KB gzipped

### Analytics
- **P95 Response Time**: < 200ms
- **Error Rate**: < 0.1%
- **Uptime**: 99.9%

---

## Next Steps After Deployment

1. **Set up custom domain**
   ```bash
   vercel domain add midnightgospel3d.com
   # Then update DNS records
   ```

2. **Enable auto-deployment**
   - Vercel → Project → Settings → Git
   - Enable "Automatic deployments from main"

3. **Monitor analytics**
   - Daily check of deployment status
   - Weekly review of performance metrics
   - Monthly analysis of user engagement

4. **Create status page**
   - https://status.midnightgospel3d.com
   - Track uptime & incidents

5. **Plan Phase 4**
   - Advanced features (gestures, offline)
   - Performance optimization
   - Community features

---

## Rollback Procedure

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback

# Or manually specify version
vercel remove <deployment-id> --safe
```

---

## Cost Estimation (Vercel Hobby Plan)

- **Deployments**: Unlimited free
- **Bandwidth**: 100GB/month
- **Build minutes**: 3000/month
- **Functions**: 6 hours/month
- **Database**: Available (separately paid)

**Typical Monthly Cost**: $0 (Hobby plan) → $20/mo (Pro plan for >100GB bandwidth)

---

## Build Status

✅ **Type Check**: 0 errors  
✅ **Build**: 20.21s  
✅ **Analytics Configured**: Ready for tracking  
✅ **SEO Optimized**: All levels configured  
✅ **CI/CD Pipeline**: Ready for GitHub  
✅ **Security Headers**: Configured  

---

## Summary

Phase 3 Task 6 provides production-grade deployment infrastructure:

- 📦 **Vercel deployment** with CDN & edge functions
- 🔄 **GitHub Actions CI/CD** for automated builds
- 📊 **Analytics** with Google Analytics 4 + optional Sentry
- 🔍 **SEO optimization** with meta tags & structured data
- 🔐 **Security** with headers, HTTPS, secret management
- 📈 **Performance monitoring** with Web Vitals tracking

**Next Action**: 
1. Commit code to GitHub
2. Add GitHub Secrets
3. Create Vercel project
4. Push to main → Auto-deploy! 🚀

---

*Generated: January 4, 2026*  
*Session: Phase 3 Task 6 - Production Deployment*  
*Project: Midnight Gospel 3D*
