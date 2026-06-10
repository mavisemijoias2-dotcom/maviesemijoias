'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductForm from '@/components/admin/product-form'
import type { Category } from '@/types'

export default function ProdutoModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Novo produto
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-[#FAF7F2] rounded-2xl shadow-xl w-full max-w-xl mb-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-[#FAF7F2] z-10 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
                Novo produto
              </h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <ProductForm categories={categories} onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
