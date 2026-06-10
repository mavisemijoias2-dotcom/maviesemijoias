import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice } from '@/lib/utils'
import ClienteModal from '@/components/admin/cliente-modal'

export default async function ClientesPage() {
  type ClientRow = { id: string; name: string; email: string; phone: string | null; address: string | null; created_at: string }
  let clients: ClientRow[] | null = null
  const spentByClient: Record<string, number> = {}
  try {
    const supabase = await createClient()
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: orderTotals } = await supabase.from('orders').select('client_id, total').eq('payment_status', 'paid')
    clients = c
    for (const o of orderTotals ?? []) {
      if (o.client_id) spentByClient[o.client_id] = (spentByClient[o.client_id] ?? 0) + o.total
    }
  } catch { }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
          Clientes
        </h1>
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{clients?.length ?? 0} clientes cadastrados</span>
            <ClienteModal />
          </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total comprado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!clients || clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Nenhum cliente ainda
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1a1a1a]">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                      {client.address && <p className="text-xs text-gray-400">{client.address}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {client.phone ? (
                        <a href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                          {client.phone}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#C4966A]">
                      {formatPrice(spentByClient[client.id] ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(client.created_at)}</td>
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
