"use server"

import Stripe from "stripe"
import { getAccountId } from "@/actions/get-account-id"

// Initialize Stripe using your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")


export async function deleteCustomerPaymentMethod(
    customerId: string,
    paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/payment-methods', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, paymentMethodId }),
  })
  return res.json()
}



/**
 * Retrieves all payment methods for a specific customer ID
 * This is a more generic function that can be used with any customer ID
 */
export async function getCustomerPaymentMethods(orgId: string) {
  try {
    const result = await getAccountId({ id: orgId || "" })

    if (!result) {
      return {
        success: false,
        error: "Customer ID is required",
      }
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: result.stripeId,
      type: "card",
    })

    return { success: true, data: paymentMethods.data }
  } catch (error) {
    console.error("Error retrieving payment methods:", error)

    // Provide more specific error messages based on Stripe error types
    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === "StripeInvalidRequestError") {
        return {
          success: false,
          error: `Invalid request: ${error.message}`,
        }
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Retrieves a specific payment method for a customer
 */
export async function getCustomerCard(customerId: string, cardId: string) {
  try {
    const card = await stripe.customers.retrieveSource(customerId, cardId)
    return { success: true, data: card }
  } catch (error) {
    console.error("Error retrieving card:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Retrieves all cards attached to a customer
 * (Alternative method using customers.listSources)
 */
export async function getCustomerCards(customerId: string) {
  try {
    const cards = await stripe.customers.listSources(customerId, { object: "card" })
    return { success: true, data: cards.data }
  } catch (error) {
    console.error("Error retrieving cards:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }



}
