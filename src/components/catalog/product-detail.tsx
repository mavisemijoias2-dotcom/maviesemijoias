'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft, Minus, Plus } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#C4966A] mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar ao catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square bg-white rounded-xl overflow-hidden border border-[#e8ddd0] relative">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <ShoppingBag className="h-24 w-24" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-[#C4966A]' : 'border-gray-200'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs tracking-[0.2em] text-[#C4966A] uppercase mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h1>
          <p className="text-3xl font-semibold text-[#C4966A] mb-6">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-600">Quantidade:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                disabled={product.stock === 0}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-gray-400">
              {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/carrinho">Ver carrinho</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
