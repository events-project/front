"use client"

import { useState, useEffect, useCallback } from "react"
import { getCustomerPaymentMethods} from "@/actions/payment-list"
import { Button } from "@/components/shared/button"
import { Card, CardContent } from "@/components/shared/card"
import { Loader2 } from 'lucide-react'
import {useAuth} from "@clerk/nextjs";

type PaymentMethod = {
  id: string
  card?: {
    brand?: string
    last4?: string
    exp_month?: number
    exp_year?: number
  }
}

interface PaymentMethodsManagerProps {
  onAddPaymentMethod?: () => void
  onDeletePaymentMethod?: (paymentMethodId: string) => void
}



const PaymentMethodsManager = ({
  onAddPaymentMethod,
  onDeletePaymentMethod,
}: PaymentMethodsManagerProps) => {
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
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const handleDeletePaymentMethod = useCallback(
    async (paymentMethodId: string) => {
      if (onDeletePaymentMethod) {
        onDeletePaymentMethod(paymentMethodId)
      }
      // Refresh the list after deletion
      await fetchPaymentMethods()
    },
    [onDeletePaymentMethod, fetchPaymentMethods]
  )

  const getCardBrandIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳 Visa"
      case "mastercard":
        return "💳 Mastercard"
      case "amex":
        return "💳 American Express"
      case "discover":
        return "💳 Discover"
      default:
        return `💳 ${brand || "Card"}`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p className="font-medium">Error loading payment methods</p>
        <p className="text-sm mt-1">{error}</p>
        <Button 
          onClick={fetchPaymentMethods} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <Button
          onClick={onAddPaymentMethod}
          variant="outline"
        >
          Add Payment Method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-500">No payment methods found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {getCardBrandIcon(method.card?.brand)}
                    </div>
                    <div>
                      <p className="font-medium">•••• {method.card?.last4}</p>
                      <p className="text-sm text-gray-500">
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
                    Remove
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
