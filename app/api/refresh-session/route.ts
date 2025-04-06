import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("✅ Setting onboardingComplete = true for user:", userId);

  // 🔥 Update publicMetadata
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
    },
  });

  return NextResponse.json({ status: "success" });
}
