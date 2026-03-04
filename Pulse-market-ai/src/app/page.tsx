'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EmailSignup from '@/components/EmailSignup'
import LiveStocks from '@/components/LiveStocks'
import NewsSection from '@/components/NewsSection'
import StockPicks from '@/components/StockPicks'

async function getNews() {
  const { data: news } = await supabase.from('news_articles').select('*').order('published_at', { ascending: false }).limit(6)
  return news || []
}

async function getStockPicks() {
  const { data: picks } = await supabase.from('stock_picks').select('*').eq('status', 'ACTIVE').order('created_at', { ascending: false }).limit(5)
  return picks || []
}

export default async function Home() {
  const [news, picks] = await Promise.all([getNews(), getStockPicks()])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center z-50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pulse Markets AI
          </h1>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition">
            Get Pro
          </button>
        </header>

        {/* Hero */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AI-Powered Markets
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Real-time stock analysis, AI-curated news, and expert picks for smarter investing.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105">
            Start Free Trial
          </button>
        </section>

        {/* Market Cards */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <MarketCard title="S&P 500" value="4,783.45" change="+1.2%" positive={true} />
            <MarketCard title="NASDAQ" value="15,123.67" change="+0.8%" positive={true} />
            <MarketCard title="NIFTY 50" value="21,456.30" change="-0.3%" positive={false} />
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <LiveStocks />
              <StockPicks picks={picks} />
            </div>
            <div className="lg:col-span-2">
              <NewsSection articles={news} />
            </div>
          </div>
        </section>

        {/* Email Signup */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <EmailSignup />
        </section>
      </div>
    </main>
  )
}

function MarketCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
      <h3 className="text-slate-400 text-sm mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? '↑' : '↓'} {change}
      </div>
    </div>
  )
}
