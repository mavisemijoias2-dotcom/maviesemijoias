'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function StockManager({ productId, currentStock }: { productId: string; currentStock: number }) {
  const router = useRouter()
  const [value, setValue] = useState(currentStock.toString())
  const [saving, setSaving] = useState(false)

  const numValue = parseInt(value) || 0
  const changed = numValue !== currentStock

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId, stock: numValue }),
    })
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setValue(String(Math.max(0, numValue - 1)))}
        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50"
      >
        <Minus className="h-3 w-3" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-16 h-7 text-center text-sm px-1"
        min="0"
      />
      <button
        onClick={() => setValue(String(numValue + 1))}
        className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50"
      >
        <Plus className="h-3 w-3" />
      </button>
      {changed && (
        <Button size="icon" className="h-7 w-7" onClick={handleSave} disabled={saving}>
          <Check className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
