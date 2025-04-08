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
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button>Submit</button>
        </form>
    );
};