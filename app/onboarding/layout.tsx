import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  // ✅ safe check
  if (sessionClaims?.metadata?.onboardingComplete) {
    return redirect("/");
  }

  return <>{children}</>;
}
