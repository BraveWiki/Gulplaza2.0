'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  Users,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useViewStore } from '@/lib/view-store'

interface Shopkeeper {
  id: string
  name: string
  phone: string
  shopName: string
  shopNumber?: string
}

interface Product {
  id: string
  title: string
  price: number
  category: string
  stock: number
  shopkeeperId: string
}

interface Order {
  id: string
  buyerName: string
  buyerPhone: string
  totalAmount: number
  status: string
  shopkeeperId: string
  orderItems: OrderItem[]
  createdAt: string
}

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

interface DashboardProps {
  shopkeeperId: string
  shopkeeper: Shopkeeper
}

export function SellerDashboard({ shopkeeperId, shopkeeper }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'chats'>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { setView } = useViewStore()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders for this shopkeeper
      const ordersResponse = await fetch(`/api/shopkeeper/${shopkeeperId}/orders`)
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData)
      }

      // Fetch products for this shopkeeper
      const productsResponse = await fetch(`/api/shopkeeper/${shopkeeperId}/products`)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, shopkeeperId }),
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const editProduct = (productId: string) => {
    // Store product ID for editing (you can implement full edit modal)
    localStorage.setItem('editingProductId', productId)
    setView('edit-product')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'delivered': return 'bg-blue-500'
      case 'rejected': return 'bg-red-500'
      case 'cancelled': return 'bg-gray-500'
      default: return 'bg-yellow-500'
    }
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    totalProducts: products.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.status === 'delivered' ? o.totalAmount : 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">{shopkeeper.shopName}</p>
              </div>
            </div>
          </div>

          <nav className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'overview' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Orders
                {stats.pendingOrders > 0 && (
                  <Badge className="ml-auto bg-orange-500 text-white">{stats.pendingOrders}</Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'products' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                Products
              </button>
              <button
                onClick={() => setActiveTab('chats')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'chats' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Chats
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Confirmed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{stats.deliveredOrders}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Products</span>
                        <span className="font-semibold">{stats.totalProducts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="font-semibold text-green-600">PKR {stats.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {orders.slice(0, 5).map(order => (
                  <Card key={order.id} className="mt-4">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{order.buyerName}</p>
                          <p className="text-sm text-gray-500">{order.buyerPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">PKR {order.totalAmount.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
                
                {loading ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <OrderCard 
                        key={order.id} 
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                  <Button 
                    onClick={() => setView('add-product')}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                
                {loading ? (
                  <p className="text-gray-500">Loading products...</p>
                ) : products.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No products yet</p>
                      <Button 
                        onClick={() => setView('add-product')}
                        variant="outline"
                        className="mt-4"
                      >
                        Add Your First Product
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={() => editProduct(product.id)}
                        onDelete={() => deleteProduct(product.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Chats</h1>
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Chat functionality coming soon!</p>
                    <p className="text-sm text-gray-400 mt-2">
                      You'll be able to see all customer conversations here.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onUpdateStatus: (id: string, status: string) => void
  getStatusColor: (status: string) => string
}

function OrderCard({ order, onUpdateStatus, getStatusColor }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{order.buyerName}</h3>
              <p className="text-sm text-gray-500">{order.buyerPhone}</p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-gray-600">Order Items:</p>
            <ul className="mt-2 space-y-1">
              {order.orderItems.map(item => (
                <li key={item.id} className="text-sm">
                  {item.quantity}x {item.product?.title || 'Unknown Product'} - 
                  PKR {item.price.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xl font-bold text-orange-600">
              PKR {order.totalAmount.toLocaleString()}
            </p>

            {order.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onUpdateStatus(order.id, 'rejected')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Delivered
              </Button>
            )}

            {order.status === 'rejected' || order.status === 'cancelled' || order.status === 'delivered' && (
              <span className="text-sm text-gray-500">
                {order.status === 'delivered' && 'Completed'}
                {order.status === 'rejected' && 'Rejected'}
                {order.status === 'cancelled' && 'Cancelled'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductCardProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="space-y-3">
          <div>
            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
            <h3 className="font-semibold text-gray-900 mt-2">{product.title}</h3>
            <p className="text-2xl font-bold text-orange-600">
              PKR {product.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
