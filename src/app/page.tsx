'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Plus, Menu, X, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/lib/store'
import { useViewStore } from '@/lib/view-store'
import { ProductGrid } from '@/components/ProductGrid'
import { Cart } from '@/components/Cart'
import { AddProductForm } from '@/components/AddProductForm'
import { ProductDetail } from '@/components/ProductDetail'
import { Checkout } from '@/components/Checkout'

export default function Home() {
  const { currentView, setView, goToProductDetail, selectedProductId } = useViewStore()
  const { getTotalItems } = useCartStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isRecording, setIsRecording] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const categories = ['all', 'clothing', 'electronics', 'jewelry', 'accessories', 'food']

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsRecording(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsRecording(false)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognition.start()
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <ProductGrid
            searchQuery={searchQuery}
            category={selectedCategory}
            onProductClick={goToProductDetail}
          />
        )
      case 'cart':
        return <Cart />
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail productId={selectedProductId} />
        ) : null
      case 'add-product':
        return <AddProductForm />
      case 'checkout':
        return <Checkout />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setView('home')}
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Gul Plaza
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isRecording ? 'text-red-500' : 'text-gray-400'
                  }`}
                  onClick={handleVoiceSearch}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setView('home')}
                className={currentView === 'home' ? 'text-orange-600' : ''}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => setView('add-product')}
                className={currentView === 'add-product' ? 'text-orange-600' : ''}
              >
                <Plus className="w-4 h-4 mr-2" />
                Sell
              </Button>
              <Button
                variant="ghost"
                onClick={() => setView('cart')}
                className={`relative ${currentView === 'cart' ? 'text-orange-600' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </nav>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setView('home')
                      setIsMobileMenuOpen(false)
                    }}
                    className={currentView === 'home' ? 'bg-orange-50 text-orange-600' : 'justify-start'}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setView('add-product')
                      setIsMobileMenuOpen(false)
                    }}
                    className={currentView === 'add-product' ? 'bg-orange-50 text-orange-600' : 'justify-start'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Sell Products
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setView('cart')
                      setIsMobileMenuOpen(false)
                    }}
                    className={`relative justify-start ${currentView === 'cart' ? 'bg-orange-50 text-orange-600' : ''}`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {getTotalItems() > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-12 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                  isRecording ? 'text-red-500' : 'text-gray-400'
                }`}
                onClick={handleVoiceSearch}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Categories */}
          {currentView === 'home' && (
            <div className="py-3 border-t border-gray-100 overflow-x-auto">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : ''
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About Gul Plaza</h3>
              <p className="text-sm text-gray-600">
                Your trusted online marketplace for quality products. Shop with confidence and ease.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => setView('home')} className="hover:text-orange-600">
                    Browse Products
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('add-product')} className="hover:text-orange-600">
                    Sell with Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Options</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Cash on Delivery</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Pay when you receive your order. Safe and convenient!
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>© 2024 Gul Plaza Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
