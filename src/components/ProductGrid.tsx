'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store'

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
  }
}

interface ProductGridProps {
  searchQuery: string
  category: string
  onProductClick: (productId: string) => void
}

export function ProductGrid({ searchQuery, category, onProductClick }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shopkeeper.shopName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = category === 'all' || product.category === category

    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      shopkeeperId: product.shopkeeper.id,
      imageUrl: product.imageUrl || undefined,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card
          key={product.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-gray-200"
          onClick={() => onProductClick(product.id)}
        >
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm">No image</p>
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.shopkeeper.shopName}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-orange-600">PKR {product.price.toLocaleString()}</p>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Out of Stock
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart(product)
              }}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
