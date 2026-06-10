import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

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
