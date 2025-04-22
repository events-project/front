import AddPaymentMethod from "@/components/add-payment-method";
import SavedPaymentMethods from "@/components/saved-payment-methods";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <div className={cn("flex flex-col gap-4", "p-5", "w-full", "md:flex-row")}>
      <SavedPaymentMethods className={cn("md:w-1/2", "w-full")} />
      <AddPaymentMethod className={cn("md:w-1/2", "h-min", "w-full")} />
    </div>
  );
}
