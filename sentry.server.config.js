// This file configures the initialization of Sentry on the server.
import * as Sentry from "@sentry/nextjs";

// Determine environment based on git branch
const getEnvironment = () => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'development';
  if (branch === 'master' || branch === 'main') {
    return 'production';
  }
  return 'staging';
};

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable performance monitoring with different sampling rates per environment
  tracesSampleRate: getEnvironment() === 'production' ? 1.0 : 0.75,

  // Set environment based on git branch
  environment: getEnvironment(),
  
  // Enable release tracking with environment prefix


  beforeSend(event) {
    const environment = getEnvironment();
    
    // Add environment context to all events
    event.environment = environment;
    
    // Don't send events from non-production environments if in development mode
    if (environment !== 'production' && process.env.NODE_ENV === 'development') {
      return null;
    }
    
    return event;
  },
});
