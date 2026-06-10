import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mavié Joias',
  description: 'Joias exclusivas com qualidade e elegância',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
