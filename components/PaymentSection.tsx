"use client"

import PaymentMethodsManager from "@/components/payment-list"
import PaymentForm from "@/components/payment-form"

export default function PaymentSection() {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Payment List */}
            <div className="md:w-1/2 w-full">
                <PaymentMethodsManager />
            </div>

            {/* Right Column: Add New Card */}
            <div className="md:w-1/2 w-full">
                <h2 className="text-xl font-semibold mb-4">Add a New Payment Method</h2>
                <PaymentForm />
            </div>
        </div>
    )
}
