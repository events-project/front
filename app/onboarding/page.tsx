"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUser, useOrganizationList, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Building2, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useSession } from "@clerk/nextjs";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const generateUniqueSlug = (name: string) => {
  const baseSlug = slugify(name);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { createOrganization, setActive, userMemberships, userInvitations } =
    useOrganizationList();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { session } = useSession();
  const clerk = useClerk();

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const org = await createOrganization?.({
        name,
        slug: slug || generateUniqueSlug(name),
      });

      if (org) {
        await setActive?.({ organization: org });

        if (user) {
          // Update user metadata (will eventually sync into sessionClaims)
          await user.update({
            unsafeMetadata: {
              onboardingComplete: true,
            },
          });

          // ✅ TEMP COOKIE: allow immediate redirect while claims sync
          document.cookie = "onboarding_complete=true; path=/; max-age=60";

          // Optional: trigger Clerk refresh if you have an API route for that
          await fetch("/api/refresh-session", { method: "POST" });
        }

        // ✅ Important: full reload, not router.push!
        await new Promise((res) => setTimeout(res, 1000)); // allow claims to sync
        window.location.href = `/organization/${org.id}`;
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err?.message || err?.errors?.[0]?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isUserLoaded || !user) return;

    // Check if user already has onboardingComplete set to true
    const onboardingComplete =
      user.publicMetadata?.onboardingComplete ||
      (user.unsafeMetadata as any)?.onboardingComplete;
    console.log("Current onboarding status:", onboardingComplete);

    const handleInvitation = async () => {
      if (userMemberships?.data?.length) {
        const membership = userMemberships.data[0];
        if (membership.organization) {
          await setActive?.({ organization: membership.organization });
          router.push(`/organization/${membership.organization.id}`);
          return;
        }
      }

      const invite = userInvitations?.data?.[0];
      if (invite) {
        try {
          await invite.accept();
          const updatedMembership = userMemberships?.data?.[0];
          if (updatedMembership?.organization) {
            await setActive?.({ organization: updatedMembership.organization });
            router.push(`/organization/${updatedMembership.organization.id}`);
          }
        } catch (err) {
          console.error("Failed to accept invitation", err);
        }
      }
    };

    handleInvitation();
  }, [user, isUserLoaded, userMemberships, userInvitations, setActive, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] opacity-50 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
              >
                <Building2 className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  Create Organization
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground"
                >
                  Let's build something amazing together
                </motion.p>
              </div>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleCreateOrganization}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Organization Name
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter a name for your organization"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Organization URL
                  </Label>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                    Optional
                  </span>
                </div>
                <Input
                  id="slug"
                  type="text"
                  placeholder="your-organization-url"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="h-12 px-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-200"
                >
                  {submitting ? (
                    "Creating..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Organization
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
