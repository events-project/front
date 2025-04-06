"use client";

import { useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgIdFromUrl = params?.id; // get the dynamic organization id from the URL, if any
  const { user } = useUser();
  const { userMemberships, isLoaded, createOrganization, setActive } =
    useOrganizationList();

  useEffect(() => {
    if (!user || !isLoaded) return;

    // Check if onboarding is complete
    if (user.publicMetadata?.onboardingComplete) {
      // If there is no orgId in the URL, we check if the user is a member of any org
      if (!orgIdFromUrl) {
        const currentOrg = userMemberships.data.find((m) => m.role !== null);
        if (currentOrg) {
          // Redirect to the organization page if a membership exists
          router.push(`/organization/${currentOrg.organization.id}`);
        }
      }
    } else {
      // Redirect to the onboarding page if onboarding is not complete
      // router.push("/onboarding");
    }
  }, [user, isLoaded, userMemberships, router, orgIdFromUrl]);

  const handleJoin = async (orgId: string) => {
    if (!setActive) return;
    await setActive({ organization: orgId });
    // Redirect to the organization's page after joining
    router.push(`/organization/${orgId}`);
  };

  const handleCreate = async () => {
    if (!createOrganization || !setActive) return;
    const org = await createOrganization({ name: "My New Org" });
    await setActive({ organization: org.id });
    // Redirect to the newly created organization's page
    router.push(`/organization/${org.id}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-zinc-800">
      <div className="bg-white border border-zinc-200 shadow-md rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Choose or Create Your Organization
        </h1>

        {isLoaded && userMemberships?.data.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-zinc-600">You have been invited to:</p>
            {userMemberships.data.map((org) => (
              <button
                key={org.organization.id}
                className="block w-full border px-4 py-2 rounded hover:bg-zinc-100 text-left"
                onClick={() => handleJoin(org.organization.id)}
              >
                <span className="font-semibold">{org.organization.name}</span> —
                Role: {org.role}
              </button>
            ))}
          </div>
        )}

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold mb-3"
          onClick={handleCreate}
        >
          ➕ Create a new organization
        </button>

        <button
          className="w-full border border-zinc-300 py-3 rounded-md text-zinc-700 hover:bg-zinc-100"
          onClick={() => router.push("/")}
        >
          I'll decide later
        </button>
      </div>
    </main>
  );
}
