import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

// Add the API route to both matchers
const isOnboardingRoute = createRouteMatcher([
  "/onboarding",
  "/api/set-onboarding-complete",
]);

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/api/set-onboarding-complete", // Make sure API route is public
  "/organization(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Access onboardingComplete from publicMetadata
  const onboardingComplete = (
    sessionClaims?.publicMetadata as Record<string, any>
  )?.onboardingComplete;

  console.log("🔍 Middleware route:", req.nextUrl.pathname);
  console.log("🧠 User:", userId);
  console.log("✅ Onboarding Complete:", onboardingComplete);

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
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
