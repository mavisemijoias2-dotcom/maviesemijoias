import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/catalog/product-card'
import Image from 'next/image'
import { Product } from '@/types'

export const revalidate = 60

export default async function CatalogPage() {
  let items: Product[] = []
  let categories: { id: string; name: string }[] = []

  try {
    const supabase = await createClient()
    const { data: products } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('active', true)
      .order('created_at', { ascending: false })
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    items = (products ?? []) as Product[]
    categories = cats ?? []
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-16 px-4" style={{ background: '#0a0a0a' }}>
        <div className="relative w-64 h-40 mb-6">
          <Image
            src="/logo.png"
            alt="Mavié Semijoias"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm tracking-[0.3em] uppercase text-[#C4966A]">Semijoias</p>
        <div className="w-16 h-px bg-[#C4966A] mt-4" />
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            Nossa Coleção
          </h2>
          <p className="text-gray-500 mt-2 text-sm tracking-wide">
            Peças únicas feitas com amor e dedicação
          </p>
        </div>

        {categories.length > 0 && (
          <CategoryFilter categories={categories} />
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Em breve novas peças</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function CategoryFilter({ categories }: { categories: { id: string; name: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <span className="px-4 py-1.5 rounded-full text-xs tracking-wide border border-[#C4966A] bg-[#C4966A] text-white">
        Todos
      </span>
      {categories.map((cat) => (
        <span
          key={cat.id}
          className="px-4 py-1.5 rounded-full text-xs tracking-wide border border-[#C4966A] text-[#C4966A] hover:bg-[#C4966A] hover:text-white transition-colors cursor-pointer"
        >
          {cat.name}
        </span>
      ))}
    </div>
  )
}
