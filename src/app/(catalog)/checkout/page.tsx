'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const cartTotal = total()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, client: form }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao processar pagamento')

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de pagamento não recebida')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/carrinho')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Finalizar Pedido
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-semibold text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            Seus dados
          </h2>

          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço de entrega</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Rua, número, bairro, cidade" />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Processando...' : `Pagar ${formatPrice(cartTotal)}`}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Pagamento seguro via Stripe. Seus dados estão protegidos.
          </p>
        </form>

        <div className="bg-white rounded-xl border border-[#e8ddd0] p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Seu pedido
          </h2>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-gray-300 m-auto mt-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">x{quantity}</p>
                </div>
                <p className="text-sm font-semibold text-[#C4966A]">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#C4966A]">{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
