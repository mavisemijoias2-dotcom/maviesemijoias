import CatalogHeader from '@/components/catalog/header'
import Image from 'next/image'

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F2' }}>
      <CatalogHeader />
      <main className="flex-1">{children}</main>
      <footer className="py-10 mt-12" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="relative w-28 h-16">
            <Image src="/logo.png" alt="Mavié Semijoias" fill className="object-contain" />
          </div>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Mavié Semijoias — Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}
