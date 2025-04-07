import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import OrganizationSwitcher from "@/app/components/OrganizationSwitcher";

export default async function HomePage() {
  const { userId, orgId } = await auth();

  if (!userId) return redirect("/sign-in");

  // ✅ Fetch user's organizations
  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId,
  });

  if (!memberships || memberships.length === 0) {
    return redirect("/onboarding");
  }

  if (memberships.length === 1) {
    return redirect(`/organization/${memberships[0].organization.id}`);
  }

  // if (orgId) {
  //   return redirect(`/organization/${orgId}`);
  // }

  // ✅ More than one organization — show switcher
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <OrganizationSwitcher />
    </main>
  );
}
