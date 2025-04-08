"use client";

import { Elements } from "@stripe/react-stripe-js";
import React, { memo, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
    children: React.ReactNode;
};

const StripeProvider = ({ children }: Props) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const response = await fetch("/api/stripe/setup-intent", {
                    method: "POST",
                });
                const { clientSecret: secret } = await response.json();
                setClientSecret(secret);
            } catch (error) {
                console.error("Failed to initialize Stripe:", error);
            }
        };

        initializeStripe();
    }, []);

    if (!clientSecret) return null;

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
            }}
        >
            {children}
        </Elements>
    );
};

export default memo(StripeProvider);