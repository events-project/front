import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🔥 API HIT: Setting onboardingComplete = true for", userId);

  // ✅ Update publicMetadata
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });

  // ✅ Create response and set refresh cookie
  const response = NextResponse.json({ status: "success" });
  response.cookies.set("__clerk_refresh", "true", {
    path: "/",
    httpOnly: false,
    sameSite: "lax", // <-- lowercase fixed here
  });

  return response;
}
