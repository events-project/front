"use client";

import { completeOnboarding } from "@/actions/complete-onboard";
import { createAccount } from "@/actions/create-account";
import { Button } from "@/components/shared/button";
import { Card, CardContent } from "@/components/shared/card";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { useClerk, useOrganizationList } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState, useTransition } from "react";

const OnBoarding = () => {
  const router = useRouter();
  const clerk = useClerk();
  const { createOrganization } = useOrganizationList();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
          const org = await createOrganization?.(
              slug ? { name, slug } : { name }
          );
          if (!org) return;
          await createAccount({ id: org.id });
          await completeOnboarding();
          await clerk.session?.touch();
          router.push("/dashboard");
        });
      },
      [name, slug, createOrganization, router, clerk]
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative"
    >
      <Card
        className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl"
        style={{
          boxShadow: "0 0 60px 10px rgba(79, 70, 229, 0.2)",
          borderRadius: "1rem",
        }}
      >
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
                Let&apos;s build something amazing together
              </motion.p>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
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
  );
};
export default memo(OnBoarding);
