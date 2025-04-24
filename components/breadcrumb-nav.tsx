"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcumb } from "@/hooks/use-breadcumb";
import { Fragment, memo } from "react";

const BreadcrumbNav = () => {
  const { items } = useBreadcumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index !== items.length - 1 && (
              <BreadcrumbSeparator key={`separator-${item.title}`} />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export default memo(BreadcrumbNav);
