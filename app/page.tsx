import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RevealKeyClient from "./RevealKeyClient";

export default async function HomePage() {
  const { userId, orgId } = await auth();

  if (!userId) return redirect("/sign-in");

  if (!orgId) return redirect("/organization");

  const user = await currentUser();
  const onboardingComplete = user?.publicMetadata?.onboardingComplete;

  if (!onboardingComplete) return redirect("/onboarding");

  return <RevealKeyClient />;
}
