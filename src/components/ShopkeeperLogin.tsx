'use client'

import { useState } from 'react'
import { Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useViewStore } from '@/lib/view-store'

interface ShopkeeperLoginProps {
  onLoginSuccess: (shopkeeperId: string, shopkeeper: any) => void
}

export function ShopkeeperLogin({ onLoginSuccess }: ShopkeeperLoginProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setView } = useViewStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/shopkeepers/by-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (response.ok) {
        onLoginSuccess(data.id, data)
      } else {
        setError(data.error || 'Shopkeeper not found. Please register first.')
      }
    } catch (err) {
      setError('Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => setView('home')}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <CardTitle className="text-2xl">Shopkeeper Login</CardTitle>
          <CardDescription>
            Enter your phone number to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Don't have an account?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setView('add-product')}
              >
                Register as Shopkeeper
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
