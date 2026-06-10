'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderStatus, PaymentStatus } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/utils'

type Props = {
  orderId: string
  currentStatus: OrderStatus
  currentPayment: PaymentStatus
}

const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const paymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed']

export default function OrderStatusUpdater({ orderId, currentStatus, currentPayment }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [payment, setPayment] = useState(currentPayment)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status, payment_status: payment }),
    })
    router.refresh()
    setSaving(false)
  }

  const changed = status !== currentStatus || payment !== currentPayment

  return (
    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">Status:</span>
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {orderStatuses.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{ORDER_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 whitespace-nowrap">Pagamento:</span>
        <Select value={payment} onValueChange={(v) => setPayment(v as PaymentStatus)}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paymentStatuses.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{PAYMENT_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {changed && (
        <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs">
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      )}
    </div>
  )
}
