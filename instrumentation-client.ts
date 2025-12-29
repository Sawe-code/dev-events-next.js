// instrumentation-client.ts
import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  // Change this to PostHog's actual API host
  api_host: "https://us.i.posthog.com", // or "https://eu.i.posthog.com" for EU
  ui_host: "https://app.posthog.com", // Optional but recommended
  
  // OR use the environment variable if you want flexibility
  // api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  
  // Include the defaults option as required by PostHog
  defaults: '2025-05-24',
  // Enables capturing unhandled exceptions via Error Tracking
  capture_exceptions: true,
  // Turn on debug in development mode
  debug: process.env.NODE_ENV === "development",
});