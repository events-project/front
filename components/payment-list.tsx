"use client"

import { useState, useEffect, useCallback } from "react"
import { getCustomerPaymentMethods } from "@/actions/payment-list"
import { Button } from "@/components/shared/button"
import { Card, CardContent } from "@/components/shared/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"


type PaymentMethod = {
  id: string
  card?: {
    brand?: string
    last4?: string
    exp_month?: number
    exp_year?: number
  }
}

const PaymentMethodsManager = () => {
  const { orgId } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentMethods = useCallback(async () => {
    if (!orgId) {
      setError("Customer ID is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await getCustomerPaymentMethods(orgId)
      if (result.success) {
        setPaymentMethods(result.data || [])
      } else {
        setError(result.error || "Failed to load payment methods")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    // TODO: Add your delete logic here
    await fetchPaymentMethods()
  }

  const getCardBrandIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳 Visa"
      case "mastercard":
        return "💳 Mastercard"
      case "amex":
        return "💳 Amex"
      case "discover":
        return "💳 Discover"
      default:
        return "💳 Card"
    }
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )
  }

  if (error) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-medium">Error loading payment methods</p>
          <p className="text-sm mt-1">{error}</p>
          <Button onClick={fetchPaymentMethods} variant="outline" size="sm" className="mt-2">
            Try Again
          </Button>
        </div>
    )
  }

  return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Methods</h2>

        {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <p className="font-medium">Error loading payment methods</p>
              <p className="text-sm mt-1">{error}</p>
              <Button onClick={fetchPaymentMethods} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
        ) : paymentMethods.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-500">No payment methods found.</p>
            </div>
        ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                  <Card key={method.id} className="border border-gray-200 rounded-xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{getCardBrandIcon(method.card?.brand)}</div>
                          <div>
                            <p className="font-medium text-lg">•••• {method.card?.last4}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.card?.exp_month}/{method.card?.exp_year}
                            </p>
                          </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>

)
}

export default PaymentMethodsManager
