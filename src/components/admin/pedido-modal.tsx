'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, X, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'

type Item = { description: string; quantity: number; price: number }

const emptyItem = (): Item => ({ description: '', quantity: 1, price: 0 })

export default function PedidoModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    payment_status: 'pending',
    status: 'pending',
    notes: '',
  })
  const [items, setItems] = useState<Item[]>([emptyItem()])

  function setField(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  function setItem(index: number, field: keyof Item, value: string) {
    setItems((prev) => prev.map((item, i) =>
      i === index
        ? { ...item, [field]: field === 'description' ? value : Number(value) }
        : item
    ))
  }

  function addItem() {
    setItems((p) => [...p, emptyItem()])
  }

  function removeItem(index: number) {
    setItems((p) => p.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  function handleClose() {
    setOpen(false)
    setForm({ client_name: '', client_email: '', client_phone: '', payment_status: 'pending', status: 'pending', notes: '' })
    setItems([emptyItem()])
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erro ao salvar')
      setLoading(false)
      return
    }

    handleClose()
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <ShoppingBag className="h-4 w-4 mr-2" />
        Novo pedido
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Novo pedido manual</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cliente</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Nome *</Label>
                    <Input value={form.client_name} onChange={(e) => setField('client_name', e.target.value)} required placeholder="Nome do cliente" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>E-mail</Label>
                      <Input type="email" value={form.client_email} onChange={(e) => setField('client_email', e.target.value)} placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>WhatsApp</Label>
                      <Input value={form.client_phone} onChange={(e) => setField('client_phone', e.target.value)} placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Itens do pedido</p>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Input
                        value={item.description}
                        onChange={(e) => setItem(i, 'description', e.target.value)}
                        placeholder="Descrição do item"
                        className="flex-1"
                        required
                      />
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => setItem(i, 'quantity', e.target.value)}
                        className="w-16"
                        placeholder="Qtd"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price || ''}
                        onChange={(e) => setItem(i, 'price', e.target.value)}
                        className="w-24"
                        placeholder="Preço"
                        required
                      />
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 mt-2">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addItem} className="mt-2 text-sm text-[#C4966A] hover:underline flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Adicionar item
                </button>
                <p className="text-right text-sm font-bold text-[#C4966A] mt-3">Total: {formatPrice(total)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Status do pagamento</Label>
                  <Select value={form.payment_status} onValueChange={(v) => setField('payment_status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="failed">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status do pedido</Label>
                  <Select value={form.status} onValueChange={(v) => setField('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Observações</Label>
                <Input value={form.notes} onChange={(e) => setField('notes', e.target.value)} placeholder="Observações opcionais..." />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Salvando...' : 'Cadastrar pedido'}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
