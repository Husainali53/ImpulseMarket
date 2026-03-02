'use client'

import { useEffect, useState } from 'react'

interface Stock { symbol: string; name: string; price: number; change: number; changePercent: number }

export default function LiveStocks() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await fetch('/api/fetch-stocks')
                const data = await res.json()
                setStocks(data.stocks || [])
            } catch (error) { console.error(error) }
            finally { setLoading(false) }
        }
        fetchStocks()
        const interval = setInterval(fetchStocks, 60000)
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="animate-pulse bg-slate-800 h-32 rounded-xl"></div>

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Trending Stocks</h3>
                <span className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Live</span>
            </div>
            <div className="space-y-3">
                {stocks.slice(0, 8).map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                        <div><div className="font-bold">{stock.symbol}</div><div className="text-xs text-slate-500">{stock.name}</div></div>
                        <div className="text-right"><div className="font-mono">${stock.price?.toFixed(2)}</div><div className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%</div></div>
                    </div>
                ))}
            </div>
        </div>
    )
}