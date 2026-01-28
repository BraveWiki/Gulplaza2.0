import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, phone, shopName, shopNumber } = body

    // Validation
    if (!name || !phone || !shopName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const shopkeeper = await db.shopkeeper.create({
      data: {
        name,
        phone,
        shopName,
        shopNumber: shopNumber || null,
      },
    })

    return NextResponse.json(shopkeeper, { status: 201 })
  } catch (error) {
    console.error('Error creating shopkeeper:', error)
    return NextResponse.json({ error: 'Failed to create shopkeeper' }, { status: 500 })
  }
}
