"use client"

import { useState, useEffect, useCallback } from "react"
import {deleteCustomerPaymentMethods, getCustomerPaymentMethods} from "@/actions/payment-list"
import { Button } from "@/components/shared/button"
import { Card, CardContent } from "@/components/shared/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import {white} from "next/dist/lib/picocolors";





type PaymentMethod = {
  id: string
  card?: {
    name?: string
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
    if (!orgId) return
    setLoading(true)
    try {
      // ✅ Call the server action directly
      await deleteCustomerPaymentMethods(orgId, paymentMethodId)

      await fetchPaymentMethods()
    } catch (err) {
      console.error("Failed to delete payment method:", err)
    } finally {
      setLoading(false)
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
              {paymentMethods.map((m) => {
                const number   = `•••• •••• •••• ${m.card?.last4}`
                const name     = m.card?.name|| 'Cardholder Name'
                const expiry   = [
                  String(m.card?.exp_month ?? '').padStart(2, '0'),
                  String(m.card?.exp_year).slice(-2)
                ].join('/')
                const issuer   = m.card?.brand?.toLowerCase()
                return (
                    <Card key={m.id} className="border-gray-200 rounded-xl shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex flex-col items-center gap-4">
                          {/* Card and Details */}
                          <div className="flex items-center gap-6 flex-1">
                             <div className="w-[290px] shrink-0">

                            <Cards
                                number={number}
                                name={name}           // if you don’t have a cardholder name
                                expiry={expiry}
                                cvc={''}
                                focused={''}
                                preview={true}             // show masked preview
                                issuer={issuer}     // helps pick the right logo/bg
                            />
                          </div>
                          </div>

                          {/* Delete Button */}
                          <div className="md:ml-auto text-right md:text-left">
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePaymentMethod(m.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                          >
                            Delete
                          </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>


                )
              })}
            </div>
        )}
      </div>

  )
}

export default PaymentMethodsManager
