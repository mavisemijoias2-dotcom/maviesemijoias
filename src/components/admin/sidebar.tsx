'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Calculator,
  Boxes,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/estoque', label: 'Estoque', icon: Boxes },
  { href: '/admin/calculadora', label: 'Calculadora', icon: Calculator },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="relative w-24 h-8">
          <Image src="/logo.png" alt="Mavié" fill className="object-contain object-left" />
        </div>
        <span className="text-xs tracking-[0.2em] text-[#C4966A]">ADMIN</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-[#C4966A] text-white'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#1a1a1a] border-b border-white/10">
        <div className="relative w-24 h-8">
          <Image src="/logo.png" alt="Mavié" fill className="object-contain object-left" />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white p-1"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col bg-[#1a1a1a] transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen bg-[#1a1a1a] flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
