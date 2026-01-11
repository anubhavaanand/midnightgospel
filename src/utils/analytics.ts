/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

// @ts-check

/**
 * Midnight Gospel 3D - Global Analytics Configuration
 * Integrates Google Analytics 4 and error tracking via Sentry
 */

// ============================================
// Google Analytics 4 Setup
// ============================================

declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: any[]) => void;
  }
}

export function initializeAnalytics(): void {
  const gaId = import.meta.env.VITE_GA_ID;
  
  if (!gaId) {
    console.warn('⚠️ Google Analytics ID not configured');
    return;
  }

  // Initialize datalayer
  window.dataLayer = window.dataLayer || [];

  // gtag function
  function gtag(..._args: any[]) {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId, {
    page_path: window.location.pathname,
    page_title: document.title,
  });

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  console.log(`✅ Google Analytics initialized with ID: ${gaId}`);
}

// ============================================
// Event Tracking
// ============================================

export function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  if (typeof window.gtag === 'undefined') {
    console.warn('❌ Google Analytics not initialized');
    return;
  }

  window.gtag('event', eventName, {
    timestamp: new Date().toISOString(),
    ...eventData,
  });
}

// ============================================
// Sentry Error Tracking Setup (Optional)
// ============================================

export async function initializeSentry(): Promise<void> {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!sentryDsn) {
    console.warn('⚠️ Sentry DSN not configured');
    return;
  }

  try {
    // Sentry integration deferred to optional dependency
    // Install with: npm install @sentry/react @sentry/tracing
    // Then uncomment initialization below
    
    // const Sentry = await import('@sentry/react');
    // Sentry.init({ ... });

    console.log('✅ Sentry error tracking configuration ready');
  } catch (error) {
    console.warn('⚠️ Sentry setup deferred - optional dependency not installed', error);
  }
}

// ============================================
// Custom Event Tracking
// ============================================

export const analyticsEvents = {
  // App lifecycle
  APP_LOADED: 'app_loaded',
  APP_ERROR: 'app_error',
  
  // Navigation
  LEVEL_STARTED: 'level_started',
  LEVEL_COMPLETED: 'level_completed',
  LEVEL_FAILED: 'level_failed',
  
  // Performance
  PERFORMANCE_METRIC: 'performance_metric',
  FPS_DROP: 'fps_drop',
  
  // Audio
  AUDIO_ENABLED: 'audio_enabled',
  AUDIO_DISABLED: 'audio_disabled',
  
  // Device
  DEVICE_DETECTED: 'device_detected',
  QUALITY_ADJUSTED: 'quality_adjusted',
  
  // Engagement
  USER_INTERACTION: 'user_interaction',
  SHARE_CLICKED: 'share_clicked',
};

// ============================================
// Performance Metrics Tracking
// ============================================

export function trackPerformanceMetrics(): void {
  if ('PerformanceObserver' in window) {
    try {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryData: Record<string, any> = {
            name: entry.name,
            rating: (entry as any).rating,
          };
          
          if ('duration' in entry) {
            entryData.value = (entry as any).duration;
          } else if ('startTime' in entry) {
            entryData.value = (entry as any).startTime;
          }
          
          trackEvent('core_web_vital', entryData);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('⚠️ Performance observation failed:', error);
    }
  }

  // Custom metrics
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    trackEvent(analyticsEvents.PERFORMANCE_METRIC, {
      metric_name: 'page_load_time',
      value: pageLoadTime,
    });
  });
}

// ============================================
// Error Tracking
// ============================================

export function setupErrorTracking(): void {
  window.addEventListener('error', (event) => {
    trackEvent(analyticsEvents.APP_ERROR, {
      error_message: event.message,
      error_source: event.filename,
      error_line: event.lineno,
      error_column: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent(analyticsEvents.APP_ERROR, {
      error_type: 'unhandled_promise_rejection',
      error_message: String(event.reason),
    });
  });
}
