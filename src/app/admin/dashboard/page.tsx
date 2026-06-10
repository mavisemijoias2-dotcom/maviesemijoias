import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'

export default async function DashboardPage() {
  let allOrders: Record<string, unknown>[] = []
  let clientCount = 0
  let productCount = 0

  try {
    const supabase = await createClient()
    const [{ data: orders }, { count: cc }, { count: pc }] = await Promise.all([
      supabase.from('orders').select('*, items:order_items(*, product:products(name))').order('created_at', { ascending: false }),
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
    ])
    allOrders = (orders ?? []) as Record<string, unknown>[]
    clientCount = cc ?? 0
    productCount = pc ?? 0
  } catch {
    // Supabase not configured yet
  }

  const allOrdersTyped = allOrders as Array<{ payment_status: string; total: number; status: string; id: string; client_name: string; client_email: string; created_at: string }>
  const paidOrders = allOrdersTyped.filter((o) => o.payment_status === 'paid')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const recentOrders = allOrdersTyped.slice(0, 8)

  const stats = [
    { label: 'Receita Total', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-600' },
    { label: 'Pedidos', value: String(allOrdersTyped.length), icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Clientes', value: String(clientCount), icon: Users, color: 'text-purple-600' },
    { label: 'Produtos Ativos', value: String(productCount), icon: Package, color: 'text-[#C4966A]' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{label}</span>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1a1a]">Pedidos Recentes</h2>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400">Nenhum pedido ainda</p>
          ) : recentOrders.map((order) => (
            <div key={order.id} className="px-4 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-[#1a1a1a] text-sm">{order.client_name || '—'}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(order.created_at)}</p>
                </div>
                <p className="font-bold text-[#C4966A]">{formatPrice(order.total)}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                  {PAYMENT_STATUS_LABELS[order.payment_status]}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Nenhum pedido ainda</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1a1a1a]">{order.client_name || '—'}</p>
                    <p className="text-xs text-gray-400">{order.client_email}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#C4966A]">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                      {PAYMENT_STATUS_LABELS[order.payment_status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
