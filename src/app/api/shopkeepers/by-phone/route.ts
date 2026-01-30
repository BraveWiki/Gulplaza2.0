import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const shopkeeper = await db.shopkeeper.findUnique({
      where: { phone },
    })

    if (!shopkeeper) {
      return NextResponse.json({ error: 'Shopkeeper not found' }, { status: 404 })
    }

    return NextResponse.json(shopkeeper)
  } catch (error) {
    console.error('Error fetching shopkeeper:', error)
    return NextResponse.json({ error: 'Failed to fetch shopkeeper' }, { status: 500 })
  }
}
