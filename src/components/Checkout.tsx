'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCartStore } from '@/lib/store'
import { useViewStore } from '@/lib/view-store'
import { toast } from 'sonner'

export function Checkout() {
  const { items, getTotalAmount, clearCart } = useCartStore()
  const { setView } = useViewStore()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Buyer Information
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!buyerName || !buyerPhone || !buyerAddress) {
      toast.error('Please fill in all required fields')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName,
          buyerPhone,
          buyerAddress,
          totalAmount: getTotalAmount(),
          paymentMethod: 'cod',
          status: 'pending',
          orderItems: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to place order')

      toast.success('Order placed successfully!')
      setOrderPlaced(true)
      clearCart()

      // Redirect to home after 3 seconds
      setTimeout(() => {
        setView('home')
      }, 3000)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-6">
              Thank you for your purchase. You will pay cash on delivery.
            </p>
            <p className="text-sm text-gray-400">Redirecting to home page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => setView('cart')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Full Name *</Label>
                  <Input
                    id="buyerName"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Ali Hassan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerPhone">Phone Number *</Label>
                  <Input
                    id="buyerPhone"
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g., 0300-1234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buyerAddress">Delivery Address *</Label>
                  <Textarea
                    id="buyerAddress"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    placeholder="Enter your complete address..."
                    rows={4}
                    required
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Payment Method</h3>
                  <p className="text-sm text-orange-700">
                    Cash on Delivery (COD) - Pay when you receive your order
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">PKR {getTotalAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">PKR {getTotalAmount().toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Total payable on delivery
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
