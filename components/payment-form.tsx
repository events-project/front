"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { memo, useCallback } from "react";
import {Card, CardContent} from "@/components/shared/card";
import {Button} from "@/components/shared/button";

const PaymentForm = () => {
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
        <Card className="shadow-md border border-gray-200">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Details
                        </label>
                        <div className="rounded-md border border-gray-300 p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <PaymentElement />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Card
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
};

export default memo(PaymentForm);
