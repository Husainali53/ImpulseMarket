import { NextResponse } from 'next/server'

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']

export async function GET() {
    try {
        const stockData = await Promise.all(STOCK_SYMBOLS.map(async (symbol) => {
            const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
            const data = await res.json()
            const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
            const profile = await profileRes.json()
            return { symbol, name: profile.name || symbol, price: data.c, change: data.c - data.pc, changePercent: ((data.c - data.pc) / data.pc) * 100 }
        }))
        return NextResponse.json({ stocks: stockData })
    } catch (error) { return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 }) }
}