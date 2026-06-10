import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, address } = await req.json()
    const supabase = await createAdminClient()

    const { error } = await supabase.from('clients').insert({
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
