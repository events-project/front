import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);
  const onboardingComplete = user.unsafeMetadata?.onboardingComplete;

  if (onboardingComplete) {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { onboardingComplete },
    });
  }

  const res = NextResponse.json({ status: "synced" });

  // 🔄 Hint Clerk to refresh session claims
  res.cookies.set("__clerk_refresh", "true", {
    path: "/",
    maxAge: 60,
  });

  return res;
}
