'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const mainImage = product.images?.[0]

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#e8ddd0]">
      <Link href={`/produto/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50 relative">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag className="h-16 w-16" />
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-sm tracking-widest">ESGOTADO</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-medium text-[#1a1a1a] hover:text-[#C4966A] transition-colors line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-xs text-gray-400 tracking-wide mt-0.5">{product.category.name}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-[#C4966A]">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  )
}
