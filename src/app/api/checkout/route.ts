import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { items, client } = await req.json() as {
      items: CartItem[]
      client: { name: string; email: string; phone: string; address: string }
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Upsert cliente
    const { data: clientRecord } = await supabase
      .from('clients')
      .upsert({ name: client.name, email: client.email, phone: client.phone, address: client.address }, { onConflict: 'email' })
      .select('id')
      .single()

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // Criar pedido pendente
    const { data: order } = await supabase
      .from('orders')
      .insert({
        client_id: clientRecord?.id ?? null,
        client_name: client.name,
        client_email: client.email,
        client_phone: client.phone,
        status: 'pending',
        payment_status: 'pending',
        total,
      })
      .select('id')
      .single()

    // Criar itens do pedido
    await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order!.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))
    )

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const stripe = getStripe()

    // Criar sessão Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.product.name,
            images: item.product.images?.slice(0, 1) ?? [],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      customer_email: client.email,
      metadata: { order_id: order!.id },
      success_url: `${appUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/carrinho`,
    })

    // Salvar stripe session id no pedido
    await supabase.from('orders').update({ stripe_payment_intent_id: session.id }).eq('id', order!.id)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err: unknown) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
