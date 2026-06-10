'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
        Pedido confirmado!
      </h1>
      <p className="text-gray-500 mb-2">
        Obrigada pela sua compra. Você receberá um e-mail com os detalhes do pedido.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Em breve entraremos em contato para confirmar o envio.
      </p>
      <Button asChild>
        <Link href="/">Continuar comprando</Link>
      </Button>
    </div>
  )
}
