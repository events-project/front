"use client";

import { useOrgAutoSelect } from "@/hooks";
import { memo } from "react";

const MainClientProvider = ({ children }: { children: React.ReactNode }) => {
  useOrgAutoSelect();
  return <>{children}</>;
};

export default memo(MainClientProvider);
