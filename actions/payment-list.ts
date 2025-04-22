"use server";

import { getAccountId } from "@/actions/get-account-id";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function deleteCustomerPaymentMethods(paymentMethodId: string) {
  if (!paymentMethodId) throw new Error("Missing parameters");
  await stripe.paymentMethods.detach(paymentMethodId);
}

export async function getCustomerPaymentMethods(
  orgId: string
): Promise<Stripe.PaymentMethod[]> {
  const result = await getAccountId({ id: orgId });
  const paymentMethods = await stripe.paymentMethods.list({
    customer: result.stripeId,
    type: "card",
  });

  return paymentMethods.data;
}

export async function getCustomerCard(customerId: string, cardId: string) {
  try {
    const card = await stripe.customers.retrieveSource(customerId, cardId);
    return { success: true, data: card };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Unknown error",
    };
  }
}

export async function getCustomerCards(customerId: string) {
  try {
    const cards = await stripe.customers.listSources(customerId, {
      object: "card",
    });
    return { success: true, data: cards.data };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
