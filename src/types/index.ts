export type Category = {
  id: string
  name: string
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  cost_price: number | null
  stock: number
  category_id: string | null
  category?: Category
  images: string[]
  active: boolean
  created_at: string
}

export type Client = {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
}

export type Order = {
  id: string
  client_id: string | null
  client?: Client
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  stripe_payment_intent_id: string | null
  total: number
  notes: string | null
  items?: OrderItem[]
  created_at: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type DashboardStats = {
  total_revenue: number
  total_orders: number
  total_clients: number
  total_products: number
  recent_orders: Order[]
  top_products: { product: Product; total_sold: number }[]
}
