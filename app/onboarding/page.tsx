"use client";

import { useState, useEffect } from "react";
import { useUser, useOrganizationList, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { completeOnboarding } from "./_actions";

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
        // ✅ 1. Set this org as active for the user
        await setActive?.({ organization: org });

        // ✅ 2. Set publicMetadata via server action
        const result = await completeOnboarding(org.id);

        if ("error" in result && result.error) {
          setError(result.error);
          return;
        }

        // ✅ 3. Refresh session so the new metadata appears in middleware
        await clerk.session?.touch();

        // ✅ 4. Redirect to the org dashboard
        router.push(`/organization/${org.id}`);
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
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Organization Slug (optional)</Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="your-org-url"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    "Creating..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Organization <ChevronRight className="w-4 h-4" />
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
