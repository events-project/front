"use client";

import { useRouter } from "next/navigation";
import {
  UserButton,
  OrganizationSwitcher,
  useOrganization,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { organization } = useOrganization(); // ✅ get active org

  const handleDashboardClick = () => {
    if (organization) {
      router.push(`/dashboard`);
    } else {
      alert("No organization selected.");
    }
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-800 dark:text-white"
        >
          MyApp
        </Link>

        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "border border-gray-200 rounded-md px-2 py-1",
            },
          }}
          afterSelectOrganizationUrl="/organization/:id"
          createOrganizationUrl="/createOrganization"
          organizationProfileUrl="/organization-settings"
          hideSlug
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDashboardClick}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-md transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/reveal-key")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition"
        >
          Reveal Key
        </button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  );
}
