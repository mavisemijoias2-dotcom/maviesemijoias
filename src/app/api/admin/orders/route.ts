import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createAdminClient()

    const { client_name, client_email, client_phone, items, notes, payment_status, status } = body

    const total = (items as { description: string; quantity: number; price: number }[])
      .reduce((sum, i) => sum + i.quantity * i.price, 0)

    const itemsSummary = (items as { description: string; quantity: number; price: number }[])
      .map((i) => `${i.description} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2)}`)
      .join('\n')
    const fullNotes = [itemsSummary, notes].filter(Boolean).join('\n\n')

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        client_name,
        client_email: client_email || null,
        client_phone: client_phone || null,
        total,
        notes: fullNotes || null,
        payment_status: payment_status ?? 'pending',
        status: status ?? 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (items?.length) {
      const orderItems = (items as { description: string; quantity: number; price: number }[]).map((i) => ({
        order_id: order.id,
        product_id: null,
        quantity: i.quantity,
        price: i.price,
      }))
      await supabase.from('order_items').insert(orderItems)
    }

    return NextResponse.json({ success: true, id: order.id })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, payment_status } = await req.json()
    const supabase = await createAdminClient()

    const updates: Record<string, string> = {}
    if (status) updates.status = status
    if (payment_status) updates.payment_status = payment_status

    const { error } = await supabase.from('orders').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
