# Mavié Joias — Guia de Setup

## 1. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

### Supabase
1. Acesse [supabase.com](https://supabase.com) e abra seu projeto
2. Vá em **Settings > API**
3. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Stripe
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Developers > API keys**
3. Copie:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

---

## 2. Banco de dados (Supabase)

1. No Supabase, vá em **SQL Editor**
2. Cole e execute o conteúdo de `supabase-schema.sql`

---

## 3. Storage de imagens (Supabase)

1. No Supabase, vá em **Storage**
2. Clique em **New bucket**
3. Nome: `mavie-images`
4. Marque **Public bucket** ✓
5. Clique em Create
6. Vá em **Policies** do bucket e adicione:
   - Policy name: `Allow uploads`
   - Allowed operation: INSERT
   - Target roles: `authenticated`, `anon`

---

## 4. Criar usuário admin (Supabase)

1. No Supabase, vá em **Authentication > Users**
2. Clique em **Add user**
3. Preencha e-mail e senha
4. Esse e-mail/senha será usado para login em `/admin`

---

## 5. Webhook Stripe (produção)

1. No Stripe Dashboard, vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://SEU-DOMINIO.vercel.app/api/webhook`
4. Eventos para escutar:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
5. Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 6. Deploy no Vercel

```bash
# Instale a Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure as variáveis de ambiente no dashboard da Vercel
# ou use: vercel env add
```

Ou conecte o repositório GitHub na Vercel e configure as env vars no dashboard.

---

## 7. Desenvolvimento local

```bash
npm run dev
# Acesse http://localhost:3000 (catálogo)
# Acesse http://localhost:3000/admin (admin)
```

Para testar webhooks localmente:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Estrutura de rotas

| Rota | Descrição |
|------|-----------|
| `/` | Catálogo público |
| `/produto/[id]` | Detalhe do produto |
| `/carrinho` | Carrinho |
| `/checkout` | Checkout com Stripe |
| `/checkout/sucesso` | Confirmação do pedido |
| `/admin` | Login admin |
| `/admin/dashboard` | Visão geral / vendas |
| `/admin/produtos` | Gerenciar produtos |
| `/admin/produtos/novo` | Cadastrar produto |
| `/admin/pedidos` | Gerenciar pedidos |
| `/admin/clientes` | Lista de clientes |
| `/admin/estoque` | Controle de estoque |
| `/admin/calculadora` | Calculadora de margem |
