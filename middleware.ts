import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

// Define routes that don't require onboarding
const isOnboardingRoute = createRouteMatcher([
  "/onboarding",
  "/api/set-onboarding-complete",
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/api/set-onboarding-complete",
  "/organization(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Skip middleware for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  // Access onboardingComplete from publicMetadata
  const publicMetadata =
    (sessionClaims?.publicMetadata as Record<string, any>) || {};
  const onboardingComplete = publicMetadata.onboardingComplete;

  console.log("🔍 Middleware route:", req.nextUrl.pathname);
  console.log("🧠 User:", userId);
  console.log("✅ Onboarding Complete:", onboardingComplete);

  // Skip onboarding check for organization routes temporarily
  if (req.nextUrl.pathname.startsWith("/organization/")) {
    console.log("🔄 Skipping onboarding check for organization route");
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    // Need to await auth() here
    const authObj = await auth();
    return authObj.redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !onboardingComplete && !isOnboardingRoute(req)) {
    console.log("🚫 Redirecting to /onboarding");
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
