'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CatalogHeader() {
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <header className="sticky top-0 z-50" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="relative w-32 h-10 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Mavié Semijoias"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-gray-300 hover:text-[#C4966A] transition-colors tracking-wide">
            Catálogo
          </Link>
        </nav>

        <Link href="/carrinho" className="relative flex items-center gap-2 text-gray-300 hover:text-[#C4966A] transition-colors">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#C4966A] text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
