"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getClientSecret } from "./get-secret";
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
    // TODO: get client id
    getClientSecret("cus_S5WwmzcFgzKNv9").then((secret) =>
      setClientSecret(secret)
    );
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
