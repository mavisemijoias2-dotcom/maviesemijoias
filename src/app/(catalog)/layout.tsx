import CatalogHeader from '@/components/catalog/header'

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F2' }}>
      <CatalogHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#e8ddd0] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>
            &copy; {new Date().getFullYear()} Mavié Joias — Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}
