'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingCart, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCartStore } from '@/lib/store'
import { useViewStore } from '@/lib/view-store'
import { Chat } from '@/components/Chat'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category: string
  imageUrl: string | null
  stock: number
  shopkeeper: {
    id: string
    shopName: string
    name: string
    phone: string
  }
}

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem, getTotalItems } = useCartStore()
  const { setView } = useViewStore()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        shopkeeperId: product.shopkeeper.id,
        imageUrl: product.imageUrl || undefined,
      })
    }

    setQuantity(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found</p>
        <Button onClick={() => setView('home')} className="mt-4">
          Go Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => setView('home')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-xl">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-sm text-gray-500">Sold by: {product.shopkeeper.shopName}</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-orange-600">
              PKR {product.price.toLocaleString()}
            </p>
            {product.stock > 0 ? (
              <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-2 text-red-600 border-red-600">
                Out of Stock
              </Badge>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <ChatButton productId={productId} shopkeeperId={product.shopkeeper.id} />
            </div>

            {getTotalItems() > 0 && (
              <Button
                size="lg"
                variant="outline"
                className="w-full mt-3"
                onClick={() => setView('cart')}
              >
                View Cart ({getTotalItems()} items)
              </Button>
            )}
          </div>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
              <p className="text-sm text-gray-600">
                <strong>Shop:</strong> {product.shopkeeper.shopName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Contact:</strong> {product.shopkeeper.phone}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ChatButton({ productId, shopkeeperId }: { productId: string; shopkeeperId: string }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button size="lg" variant="outline" className="flex-1">
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with Seller
          </Button>
        </DialogTrigger>
      </Dialog>

      <Chat
        productId={productId}
        shopkeeperId={shopkeeperId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}
