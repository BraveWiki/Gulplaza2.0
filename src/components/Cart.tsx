'use client'

import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore, CartItem } from '@/lib/store'
import { useViewStore } from '@/lib/view-store'
import Image from 'next/image'

export function Cart() {
  const { items, removeItem, updateQuantity, getTotalAmount, clearCart } = useCartStore()
  const { setView } = useViewStore()

  const handleCheckout = () => {
    setView('checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <Button onClick={() => setView('home')} className="bg-gradient-to-r from-orange-500 to-red-500">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Shopping Cart ({items.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <CartCard key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
          <div className="text-left">
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-3xl font-bold text-orange-600">PKR {getTotalAmount().toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

interface CartCardProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

function CartCard({ item, onUpdateQuantity, onRemove }: CartCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
        <p className="text-orange-600 font-bold">PKR {item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          -
        </Button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </Button>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
