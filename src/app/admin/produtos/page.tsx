import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ProductActions from '@/components/admin/product-actions'
import Image from 'next/image'
import type { Product, Category } from '@/types'

export default async function ProdutosPage() {
  let products: Product[] = []
  let categories: Category[] = []
  try {
    const supabase = await createClient()
    const { data: p } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false })
    const { data: c } = await supabase.from('categories').select('*').order('name')
    products = p ?? []
    categories = c ?? []
  } catch { }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
          Produtos
        </h1>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo produto
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <p className="mb-3">Nenhum produto cadastrado</p>
                    <Button asChild size="sm">
                      <Link href="/admin/produtos/novo">Cadastrar primeiro produto</Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <span className="font-medium text-[#1a1a1a]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category?.name ?? '—'}</td>
                    <td className="px-6 py-4 font-semibold text-[#C4966A]">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProductActions product={product} categories={categories ?? []} />
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
