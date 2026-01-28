'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useViewStore } from '@/lib/view-store'
import { toast } from 'sonner'

const categories = [
  'clothing',
  'electronics',
  'jewelry',
  'accessories',
  'food',
  'home',
  'beauty',
  'toys',
  'books',
  'sports',
]

export function AddProductForm() {
  const { setView } = useViewStore()
  const [loading, setLoading] = useState(false)

  // Shopkeeper Info
  const [shopkeeperName, setShopkeeperName] = useState('')
  const [shopkeeperPhone, setShopkeeperPhone] = useState('')
  const [shopName, setShopName] = useState('')
  const [shopNumber, setShopNumber] = useState('')

  // Product Info
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('1')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shopkeeperName || !shopkeeperPhone || !shopName || !title || !price || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // First, find or create shopkeeper
      let shopkeeperResponse = await fetch(`/api/shopkeepers/by-phone?phone=${encodeURIComponent(shopkeeperPhone)}`)
      let shopkeeperData

      if (!shopkeeperResponse.ok) {
        // Create new shopkeeper
        const createResponse = await fetch('/api/shopkeepers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: shopkeeperName,
            phone: shopkeeperPhone,
            shopName,
            shopNumber: shopNumber || null,
          }),
        })

        if (!createResponse.ok) throw new Error('Failed to create shopkeeper')
        shopkeeperData = await createResponse.json()
      } else {
        shopkeeperData = await shopkeeperResponse.json()
      }

      // Create product
      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          price: parseFloat(price),
          category,
          imageUrl: imageUrl || null,
          stock: parseInt(stock) || 1,
          shopkeeperId: shopkeeperData.id,
        }),
      })

      if (!productResponse.ok) throw new Error('Failed to create product')

      toast.success('Product listed successfully!')

      // Reset form
      setShopkeeperName('')
      setShopkeeperPhone('')
      setShopName('')
      setShopNumber('')
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('')
      setStock('1')
      setImageUrl('')

      // Redirect to home
      setTimeout(() => setView('home'), 1500)
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to list product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => setView('home')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            List Your Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shopkeeper Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Shop Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g., Al-Faisal Fabrics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopNumber">Shop Number</Label>
                  <Input
                    id="shopNumber"
                    value={shopNumber}
                    onChange={(e) => setShopNumber(e.target.value)}
                    placeholder="e.g., Shop 123, First Floor"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopkeeperName">Your Name *</Label>
                  <Input
                    id="shopkeeperName"
                    value={shopkeeperName}
                    onChange={(e) => setShopkeeperName(e.target.value)}
                    placeholder="e.g., Ahmed Khan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopkeeperPhone">Phone Number *</Label>
                  <Input
                    id="shopkeeperPhone"
                    type="tel"
                    value={shopkeeperPhone}
                    onChange={(e) => setShopkeeperPhone(e.target.value)}
                    placeholder="e.g., 0300-1234567"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6" />

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Men's Cotton Kurta"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 1500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500">
                  Enter a URL to an image of your product (optional)
                </p>
              </div>

              {imageUrl && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={() => setImageUrl('')}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView('home')}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Listing Product...
                  </>
                ) : (
                  'List Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
