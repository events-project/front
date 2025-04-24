"use client";

import { BreadcumbItem, useBreadcumb } from "@/hooks";
import { memo, useEffect } from "react";

type Props = {
  items: BreadcumbItem[];
};
const Breadcrumbs = ({ items }: Props) => {
  const { setBreadcumb } = useBreadcumb();
  useEffect(() => {
    setBreadcumb(items);

    return () => {
      setBreadcumb([]);
    };
  }, [items, setBreadcumb]);
  return <></>;
};

export default memo(Breadcrumbs);
