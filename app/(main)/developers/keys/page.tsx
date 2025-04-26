import Breadcrumbs from "@/components/breadcrumbs";
import { RevealKeyPanel } from "@/components/reveal-key";
import { cn } from "@/lib/utils";

export default async function Page() {
    return (
        <div className="p-8 space-y-6">
            <Breadcrumbs
                items={[
                    { title: "Developers", url: "/developers" },
                    { title: "Keys", url: "/developers/keys" },
                ]}
            />

            <h1 className={cn("text-3xl font-bold text-white")}>Developers Keys</h1>

            <RevealKeyPanel />
        </div>
    );
}
