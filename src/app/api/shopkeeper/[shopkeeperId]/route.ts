import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/shopkeeper/[shopkeeperId]/orders - Get all orders for a shopkeeper
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopkeeperId: string }> }
) {
  try {
    const { shopkeeperId } = await params

    const orders = await db.order.findMany({
      where: { shopkeeperId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching shopkeeper orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// GET /api/shopkeeper/[shopkeeperId]/products - Get all products for a shopkeeper
export async function GET_PRODUCTS(
  request: NextRequest,
  { params }: { params: Promise<{ shopkeeperId: string }> }
) {
  try {
    const { shopkeeperId } = await params

    const products = await db.product.findMany({
      where: { shopkeeperId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching shopkeeper products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
