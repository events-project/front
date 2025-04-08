"use client";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";

export const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!stripe || !elements) return null;
            const { error } = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: "http://localhost:3000/payment-form",
                },
            });
            console.log(error);
        },
        [stripe, elements]
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <PaymentElement />
            <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Submit
            </button>
        </form>
    );
};