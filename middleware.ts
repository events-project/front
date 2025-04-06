import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/onboarding",
  "/api/refresh-session",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const onboardingComplete = (sessionClaims?.publicMetadata as any)
    ?.onboardingComplete;
  const tempCookie = req.cookies.get("onboarding_complete");

  console.log("🔍 Middleware route:", req.nextUrl.pathname);
  console.log("🧠 User:", userId);
  console.log(
    `✅ Onboarding Complete: ${onboardingComplete} | Cookie: ${tempCookie?.value}`
  );

  // // Skip onboarding check for organization routes temporarily
  // if (req.nextUrl.pathname.startsWith("/organization/")) {
  //   console.log("🔄 Skipping onboarding check for organization route");
  //   return NextResponse.next();
  // }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (
    userId &&
    !onboardingComplete &&
    !tempCookie?.value &&
    !isOnboardingRoute(req)
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Optional: clean up cookie if claims have synced
  if (onboardingComplete && tempCookie?.value) {
    const res = NextResponse.next();
    res.cookies.set("onboarding_complete", "", { maxAge: 0 });
    return res;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
