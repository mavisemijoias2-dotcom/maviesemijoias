-- =============================================
-- MAVIÉ JOIAS — Schema do Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- =============================================

-- Categorias
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Produtos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10,2) not null default 0,
  cost_price decimal(10,2),
  stock integer not null default 0,
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Clientes
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  address text,
  created_at timestamptz default now()
);

-- Pedidos
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  client_name text,
  client_email text,
  client_phone text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  stripe_payment_intent_id text,
  total decimal(10,2) not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- Itens dos pedidos
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null default 1,
  price decimal(10,2) not null default 0,
  created_at timestamptz default now()
);

-- Função para decrementar estoque (usada pelo webhook Stripe)
create or replace function decrement_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql as $$
begin
  update products
  set stock = greatest(0, stock - p_quantity)
  where id = p_product_id;
end;
$$;

-- =============================================
-- RLS (Row Level Security) — catálogo público
-- =============================================

alter table categories enable row level security;
alter table products enable row level security;
alter table clients enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Produtos e categorias: leitura pública
create policy "Produtos visíveis para todos" on products
  for select using (active = true);

create policy "Categorias visíveis para todos" on categories
  for select using (true);

-- Admin (service_role) acessa tudo — já bypassa RLS por padrão
-- Clientes e pedidos: apenas inserção anônima (via API route com service_role)
create policy "Inserção de clientes via API" on clients
  for insert with check (true);

create policy "Inserção de pedidos via API" on orders
  for insert with check (true);

create policy "Inserção de itens via API" on order_items
  for insert with check (true);

-- =============================================
-- Storage bucket para imagens
-- =============================================
-- Execute manualmente no Storage do Supabase:
-- 1. Crie um bucket chamado "mavie-images"
-- 2. Marque como PUBLIC
-- 3. Adicione a policy: allow all authenticated uploads
