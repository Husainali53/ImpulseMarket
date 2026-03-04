'use client'

import { useState, useEffect, useRef } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from "recharts"

// Data
const MARKETS = [
  { name: "S&P 500", sym: "SPX", val: 4783.45, chg: 1.20 },
  { name: "NASDAQ", sym: "NDX", val: 15123.67, chg: 0.80 },
  { name: "NIFTY 50", sym: "NIFTY", val: 21456.30, chg: -0.30 },
]

const NEWS = [
  { tag: "Bullish", type: "bull", title: "Fed holds rates steady as inflation cools", src: "Reuters", time: "2h", score: 88 },
  { tag: "AI Pick", type: "ai", title: "NVDA earnings: record data center revenue expected", src: "WSJ", time: "4h", score: 94 },
]

const PICKS = [
  { sym: "NVDA", name: "NVIDIA Corp", act: "BUY", score: 94, reason: "AI chip supercycle", entry: "$610", target: "$720", stop: "$570", risk: "Low" },
  { sym: "META", name: "Meta Platforms", act: "BUY", score: 87, reason: "Ad revenue rebound", entry: "$480", target: "$560", stop: "$455", risk: "Medium" },
]

// Generate chart data
function genData(start: number, points: number) {
  const data = []
  for (let i = 0; i < points; i++) {
    data.push({ v: Math.round(start + (Math.random() - 0.5) * 200), t: `Day ${i + 1}` })
  }
  return data
}

const SPX_DATA = genData(4500, 30)

export default function Home() {
  const [dark, setDark] = useState(true)
  const [markets, setMarkets] = useState(MARKETS)
  const [tab, setTab] = useState("overview")
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setMarkets(p => p.map(m => ({
        ...m,
        val: +(m.val * (1 + (Math.random() - 0.499) * 0.0009)).toFixed(2),
        chg: +(m.chg + (Math.random() - 0.499) * 0.05).toFixed(2),
      })))
    }, 2400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-950 text-white' : 'bg-gray-100 text-slate-900'}`}>
      {/* Header */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">P</div>
          <span className="text-xl font-bold">Pulse Markets AI</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setDark(!dark)} className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold">Get Pro</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-blue-400">AI-Powered Market Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Markets move.<br />Move first.
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Real-time AI signals and curated stock picks for smarter investing.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 rounded-lg font-bold hover:scale-105 transition">
            Start Free Trial →
          </button>
          <button className="border border-white/20 px-8 py-4 rounded-lg hover:bg-white/5 transition">
            See How It Works
          </button>
        </div>
      </section>

      {/* Market Cards */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {markets.map((m, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition">
              <div className="text-sm text-slate-400 mb-2">{m.name}</div>
              <div className="text-3xl font-bold mb-1">{m.val.toLocaleString()}</div>
              <div className={`text-sm font-medium ${m.chg >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {m.chg >= 0 ? '▲' : '▼'} {Math.abs(m.chg).toFixed(2)}%
              </div>
              <div className="mt-4 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPX_DATA}>
                    <Area type="monotone" dataKey="v" stroke={m.chg >= 0 ? "#22d67a" : "#f05454"} fill={m.chg >= 0 ? "#22d67a20" : "#f0545420"} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-8">
          {["overview", "picks", "news"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 rounded-lg capitalize ${tab === t ? 'bg-blue-600' : 'bg-white/5 hover:bg-white/10'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* AI Picks */}
        {tab === "picks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PICKS.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-2xl font-bold">{p.sym}</div>
                    <div className="text-sm text-slate-400">{p.name}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${p.act === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.act}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mb-4">{p.reason}</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div
