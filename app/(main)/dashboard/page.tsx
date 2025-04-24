import Breadcrumbs from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Main", url: "" },
          { title: "Home", url: "/dashboard" },
        ]}
      />
      <h1 className={cn("text-white")}>Dashboard Page</h1>
    </>
  );
}
