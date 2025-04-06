import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/organization(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  let onboardingComplete = (
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
