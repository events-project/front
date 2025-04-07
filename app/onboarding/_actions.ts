"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function completeOnboarding(orgId: string) {
  const { userId } = await auth();

  if (!userId) return { error: "Not authenticated" };

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
      organizationId: orgId,
    },
  });

  return { message: "success" };
}
