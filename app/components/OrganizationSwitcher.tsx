"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Plus, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function MovingGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.1), transparent 40%)`,
      }}
    />
  );
}

function OrgCard({ mem, onSelect }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-100, 100], [30, -30]);
  const rotateY = useTransform(mouseX, [-100, 100], [-30, 30]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        perspective: 2000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        className="preserve-3d"
      >
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border/50 backdrop-blur-sm bg-background/80">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
          <div className="p-6 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold truncate bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                  {mem.organization.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {mem.role.toLowerCase()}
                  <Sparkles className="w-3 h-3 text-purple-500" />
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25 transform group-hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={onSelect}
            >
              <span className="flex items-center gap-2">
                Select Organization
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function OrganizationSwitcher() {
  const router = useRouter();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Loader2 className="w-8 h-8 text-primary/30" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-8">
      <MovingGradient />
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Your Organizations
          </h1>
          <p className="text-xl text-muted-foreground">
            Select an organization to manage or create a new one
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {userMemberships.data?.map((mem) => (
            <motion.div key={mem.id} variants={item}>
              <OrgCard
                mem={mem}
                onSelect={async () => {
                  await setActive({ organization: mem.organization.id });
                  router.push(`/organization/${mem.organization.id}`);
                }}
              />
            </motion.div>
          ))}

          <motion.div variants={item}>
            <Card className="h-full border border-dashed border-border/50 hover:border-primary/50 transition-colors backdrop-blur-sm bg-background/80">
              <Button
                variant="ghost"
                className="h-full w-full p-8 cursor-pointer"
                onClick={() => router.push("/onboarding")}
              >
                <div className="flex flex-col items-center gap-4 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                  </div>
                  <span className="text-lg">Create New Organization</span>
                </div>
              </Button>
            </Card>
          </motion.div>
        </motion.div>

        {userMemberships.hasNextPage && (
          <motion.div
            variants={item}
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="outline"
              onClick={() => userMemberships.fetchNext()}
              disabled={!userMemberships.hasNextPage}
              className="min-w-[200px] backdrop-blur-sm bg-background/80"
            >
              {userMemberships.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Load More Organizations"
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
