
import Breadcrumbs from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { title: "Developers", url: "" },
          { title: "Docs", url: "/developers/docs" },
        ]}
      />
      <h1 className={cn("text-white")}>Developers Docs</h1>
    </>
  );
}
