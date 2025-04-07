import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  console.log("🧠 sessionClaims layout:", sessionClaims);
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
