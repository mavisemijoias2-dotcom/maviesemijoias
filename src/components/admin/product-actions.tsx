'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { Product, Category } from '@/types'
import { Button } from '@/components/ui/button'
import ProductForm from './product-form'

type Props = {
  product: Product
  categories: Category[]
}

export default function ProductActions({ product, categories }: Props) {
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Excluir "${product.name}"?`)) return
    await fetch(`/api/admin/products?id=${product.id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (editing) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Editar produto</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditing(false)}>✕</Button>
          </div>
          <ProductForm product={product} categories={categories} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
        <Pencil className="h-4 w-4 text-gray-500" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 text-red-400" />
      </Button>
    </div>
  )
}
