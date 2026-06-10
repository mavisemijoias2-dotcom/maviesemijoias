import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/product-form'

export default async function NovoProdutoPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Novo Produto
      </h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}
