"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return { error: "Not authenticated" };

  const applicationName = formData.get("applicationName") as string;
  const applicationType = formData.get("applicationType") as string;

  if (!applicationName || !applicationType) {
    return { error: "Missing fields" };
  }

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      onboardingComplete: true,
      applicationName,
      applicationType,
    },
  });

  return { message: "success" };
}
