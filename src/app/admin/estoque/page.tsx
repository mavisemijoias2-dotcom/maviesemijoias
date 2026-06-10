import { createClient } from '@/lib/supabase/server'
import StockManager from '@/components/admin/stock-manager'
import Image from 'next/image'
import type { Product } from '@/types'

export default async function EstoquePage() {
  let products: Product[] | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*, category:categories(name)').order('name')
    products = data as Product[]
  } catch { }

  const lowStock = (products ?? []).filter((p) => p.stock <= 3)
  const outOfStock = (products ?? []).filter((p) => p.stock === 0)

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Estoque
      </h1>

      {outOfStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-medium text-sm">
            {outOfStock.length} produto(s) esgotado(s): {outOfStock.map((p) => p.name).join(', ')}
          </p>
        </div>
      )}
      {lowStock.length > 0 && outOfStock.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-700 font-medium text-sm">
            {lowStock.length} produto(s) com estoque baixo (3 ou menos)
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque atual</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ajustar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Nenhum produto cadastrado</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={`${product.stock === 0 ? 'bg-red-50' : product.stock <= 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : <div className="w-full h-full bg-gray-100" />}
                        </div>
                        <span className="font-medium text-[#1a1a1a]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category?.name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${product.stock === 0 ? 'text-red-500' : product.stock <= 3 ? 'text-yellow-600' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StockManager productId={product.id} currentStock={product.stock} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
