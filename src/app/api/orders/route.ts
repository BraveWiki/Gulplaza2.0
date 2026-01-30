import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { buyerName, buyerPhone, buyerAddress, totalAmount, paymentMethod, status, orderItems } = body

    // Validation
    if (!buyerName || !buyerPhone || !buyerAddress || !orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await db.order.create({
      data: {
        buyerName,
        buyerPhone,
        buyerAddress,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'cod',
        status: status || 'pending',
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
