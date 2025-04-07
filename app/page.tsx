import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId, orgId } = await auth();

  if (!userId) return redirect("/sign-in");

  const user = await currentUser();
  const onboardingComplete = user?.publicMetadata?.onboardingComplete;

  if (!onboardingComplete) return redirect("/onboarding");

  // ✅ If no active org, send to onboarding to create one
  if (!orgId) return redirect("/onboarding");

  // ✅ All good, go to active org dashboard
  return redirect(`/organization/${orgId}`);
}
