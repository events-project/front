// components/PaymentSection.tsx
"use client"

import PaymentMethodsManager from "@/components/payment-list"
import PaymentForm from "@/components/payment-form"

export default function PaymentSection() {
    return (
        <div className="flex flex-col md:flex-row gap-5">
            <section className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Your Payment Methods</h2>
                <PaymentMethodsManager
                    onAddPaymentMethod={() => {}}
                    onDeletePaymentMethod={async (id) => {
                        console.log("Deleted:", id)
                    }}
                />
            </section>

            <section className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Add a Payment Method</h2>
                <PaymentForm />
            </section>
        </div>
    )
}
