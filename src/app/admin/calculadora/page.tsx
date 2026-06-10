'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Calculator } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function CalculadoraPage() {
  const [cost, setCost] = useState('')
  const [margin, setMargin] = useState('200')
  const [targetProfit, setTargetProfit] = useState('')
  const [result, setResult] = useState<{
    salePrice: number
    profit: number
    requiredSales: number | null
  } | null>(null)

  function calculate() {
    const costNum = parseFloat(cost)
    const marginNum = parseFloat(margin)
    if (!costNum || !marginNum) return

    const salePrice = costNum * (1 + marginNum / 100)
    const profit = salePrice - costNum
    const targetNum = parseFloat(targetProfit)
    const requiredSales = targetNum ? Math.ceil(targetNum / profit) : null

    setResult({ salePrice, profit, requiredSales })
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-6 w-6 text-[#C4966A]" />
        <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
          Calculadora de Preço
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cost">Preço de custo (R$)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Ex: 10,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin">Margem de lucro (%)</Label>
            <Input
              id="margin"
              type="number"
              step="1"
              min="0"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="Ex: 200"
            />
            <p className="text-xs text-gray-400">200% = vende por 3x o custo</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetProfit">Meta de lucro (R$) <span className="text-gray-400 font-normal">opcional</span></Label>
          <Input
            id="targetProfit"
            type="number"
            step="0.01"
            min="0"
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder="Ex: 1000,00 — quantas peças preciso vender?"
          />
        </div>

        <Button onClick={calculate} className="w-full" disabled={!cost || !margin}>
          Calcular
        </Button>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl border border-[#C4966A]/30 p-6 space-y-4">
          <h2 className="font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Georgia, serif' }}>
            Resultado
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF7F2] rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Preço de venda</p>
              <p className="text-2xl font-bold text-[#C4966A]">{formatPrice(result.salePrice)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Lucro por peça</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(result.profit)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Custo</span>
              <span>{formatPrice(parseFloat(cost))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Margem aplicada</span>
              <span>{margin}%</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-500">Multiplicador</span>
              <span>{(1 + parseFloat(margin) / 100).toFixed(2)}x o custo</span>
            </div>
          </div>

          {result.requiredSales && (
            <>
              <Separator />
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Para atingir {formatPrice(parseFloat(targetProfit))} de lucro, você precisa vender</p>
                <p className="text-3xl font-bold text-blue-600">{result.requiredSales} peças</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h3 className="font-medium text-gray-700 mb-3 text-sm">Exemplos rápidos de margem</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '100%', desc: '2x o custo' },
            { label: '150%', desc: '2.5x o custo' },
            { label: '200%', desc: '3x o custo' },
            { label: '300%', desc: '4x o custo' },
            { label: '400%', desc: '5x o custo' },
            { label: '500%', desc: '6x o custo' },
          ].map(({ label, desc }) => (
            <button
              key={label}
              onClick={() => setMargin(label.replace('%', ''))}
              className="text-center p-2 rounded-lg border border-gray-200 hover:border-[#C4966A] hover:bg-[#FAF7F2] transition-colors"
            >
              <p className="font-semibold text-sm text-[#C4966A]">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
