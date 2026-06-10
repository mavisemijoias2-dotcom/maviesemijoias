import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils'
import OrderStatusUpdater from '@/components/admin/order-status-updater'
import type { Order } from '@/types'

export default async function PedidosPage() {
  let orders: Order[] | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(quantity, price, product:products(name))')
      .order('created_at', { ascending: false })
    orders = data
  } catch { }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Pedidos
      </h1>

      <div className="space-y-4">
        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            Nenhum pedido ainda
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{order.client_name || 'Cliente'}</p>
                  <p className="text-sm text-gray-400">{order.client_email} {order.client_phone && `· ${order.client_phone}`}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#C4966A]">{formatPrice(order.total)}</p>
                  <div className="flex gap-2 mt-2 justify-end flex-wrap">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.payment_status]}`}>
                      {PAYMENT_STATUS_LABELS[order.payment_status]}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Itens do pedido:</p>
                  <div className="space-y-1">
                    {order.items!.map((item, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product?.name} x{item.quantity}</span>
                        <span className="text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} currentPayment={order.payment_status} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
