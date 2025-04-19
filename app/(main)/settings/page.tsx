import PaymentForm from "@/components/payment-form";
import PaymentMethodsManager from "@/components/payment-list";
import {cn} from "@/lib/utils";

export default async function Page() {
  return    (
    <div className={cn("flex flex-col md:flex-row gap-5")}>
      
      {/* Left pane: list & manage methods */}
      <section className={cn("flex-1")}>
        <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>
        <PaymentMethodsManager  customerId={""}
               onAddPaymentMethod={() => {}}
               onDeletePaymentMethod={async (id) => {
               console.log(id);
              }} />
      </section>
      
      {/* Right pane: add a new method */}
      <section className={cn("flex-1")}>
        <h2 className="text-xl font-semibold mb-4">Add a Payment Method</h2>
        <PaymentForm />
      </section>
      
    </div>
  );
}
