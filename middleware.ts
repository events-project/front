import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ FIXED

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in",
  "/auth/sign-up",
  "/onboarding",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    console.log("⚠️ No user logged in");
    if (!isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
    return NextResponse.next();
  }

  const metadata = sessionClaims?.publicMetadata as {
    onboardingComplete?: boolean;
  };
  const onboardingComplete = metadata?.onboardingComplete;
  console.log("🧠 sessionClaims:", sessionClaims);
  console.log("🧠 User:", userId);
  console.log("✅ Onboarding Complete (from metadata):", onboardingComplete);

  // ✅ Check if the user is a member of any organization
  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId,
  });

  const hasOrg = memberships.length > 0;
  console.log("🏢 Has organization:", hasOrg);

  if (!hasOrg && req.nextUrl.pathname !== "/onboarding") {
    console.log("🔁 Redirecting to onboarding...");
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
