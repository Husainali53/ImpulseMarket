'use client'

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts"

// Generate sample chart data
function genData(start: number, points: number) {
  const data = []
  for (let i = 0; i < points; i++) {
    data.push({ v: Math.round(start + (Math.random() - 0.5) * 200), t: `Day ${i + 1}` })
  }
  return data
}

const SPX_DATA = genData(4500, 30)
const VOL_DATA = Array.from({ length: 14 }, (_, i) => ({
  d: `Mar ${i + 1}`,
  v: Math.round(2 + Math.random() * 5),
  c: Math.random() > 0.4,
}))

const MARKETS = [
  { name: "S&P 500", sym: "SPX", val: 4783.45, chg: 1.20 },
  { name: "NASDAQ", sym: "NDX", val: 15123.67, chg: 0.80 },
  { name: "NIFTY 50", sym: "NIFTY", val: 21456.30, chg: -0.30 },
  { name: "BTC/USD", sym: "BTC", val: 67320, chg: 3.20 },
]

const PICKS = [
  { sym: "NVDA", name: "NVIDIA Corp", act: "BUY", score: 94, reason: "AI chip supercycle", entry: "$610", target: "$720", stop: "$570", risk: "Low" },
  { sym: "META", name: "Meta Platforms", act: "BUY", score: 87, reason: "Ad revenue rebound", entry: "$480", target: "$560", stop: "$455", risk: "Medium" },
  { sym: "TSLA", name: "Tesla Inc", act: "HOLD", score: 61, reason: "Price war pressure", entry: "$241", target: "$260", stop: "$218", risk: "High" },
]

const NEWS = [
  { tag: "Bullish", type: "bull", title: "Fed holds rates steady as inflation cools", src: "Reuters", time: "2h", score: 88 },
  { tag: "AI Pick", type: "ai", title: "NVDA earnings: record data center revenue expected", src: "WSJ", time: "4h", score: 94 },
  { tag: "Risk", type: "bear", title: "China PMI contracts second straight month", src: "FT", time: "5h", score: 76 },
]

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

  const theme = dark ? {
    bg: 'bg-slate-950',
    text: 'text-white',
    card: 'bg-white/5',
    border: 'border-white/10',
    muted: 'text-slate-400'
  } : {
    bg: 'bg-gray-100',
    text: 'text-slate-900',
    card: 'bg-white',
    border: 'border-gray-200',
    muted: 'text-gray-500'
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse ${dark ? 'bg-blue-600/20' : 'bg-blue-400/20'}`}></div>
        <div className={`absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${dark ? 'bg-cyan-600/20' : 'bg-cyan-400/20'}`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className={`fixed top-0 w-full backdrop-blur-xl border-b p-4 flex justify-between items-center z-50 ${dark ? 'bg-black/20 border-white/10' : 'bg-white/80 border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white">P</div>
            <span className="text-xl font-bold">Pulse <span className="text-blue-500">Markets</span></span>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setDark(!dark)} 
              className={`px-4 py-2 rounded-lg border transition ${dark ? 'border-white/20 hover:bg-white/10' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-6 py-2 rounded-lg font-semibold text-white transition">
              Get Pro
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${dark ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-blue-100 border border-blue-200'}`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className={`text-sm ${dark ? 'text-blue-400' : 'text-blue-600'}`}>AI-Powered Market Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Markets move.<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Move first.</span>
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${theme.muted}`}>
            Real-time AI signals, curated stock picks, and institutional-grade intelligence.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
              Start Free Trial →
            </button>
            <button className={`px-8 py-4 rounded-full font-semibold text-lg border transition ${dark ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-100'}`}>
              See How It Works
            </button>
          </div>
        </section>

        {/* Market Cards with Charts */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((m, i) => (
              <div key={i} className={`${theme.card} backdrop-blur-lg border ${theme.border} rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className={`text-sm mb-1 ${theme.muted}`}>{m.name}</div>
                    <div className="text-2xl font-bold">{m.val.toLocaleString()}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${m.chg >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {m.chg >= 0 ? '▲' : '▼'} {Math.abs(m.chg).toFixed(2)}%
                  </span>
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SPX_DATA}>
                      <defs>
                        <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={m.chg >= 0 ? "#22d67a" : "#f05454"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={m.chg >= 0 ? "#22d67a" : "#f05454"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="v" 
                        stroke={m.chg >= 0 ? "#22d67a" : "#f05454"} 
                        fill={`url(#grad${i})`} 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Volume Chart */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className={`${theme.card} border ${theme.border} rounded-2xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className={`text-sm ${theme.muted}`}>Market Volume</div>
                <div className="text-sm mt-1">Daily traded volume (Billions)</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Above Avg</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VOL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                  <XAxis dataKey="d" tick={{fill: dark ? "#6b7280" : "#9ca3af", fontSize: 10}} />
                  <YAxis tick={{fill: dark ? "#6b7280" : "#9ca3af", fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ 
                      background: dark ? '#1f2937' : '#ffffff', 
                      border: dark ? '1px solid #374151' : '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                    {VOL_DATA.map((d, i) => (
                      <Cell key={i} fill={d.c ? "#22d67a" : "#f05454"} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className={`inline-flex gap-1 p-1 rounded-xl mb-8 ${dark ? 'bg-white/5' : 'bg-gray-200'}`}>
            {["overview", "picks", "news"].map(t => (
              <button 
                key={t} 
                onClick={() => setTab(t)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition ${
                  tab === t 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : dark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* AI Picks */}
          {tab === "picks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PICKS.map((p, i) => (
                <div key={i} className={`${theme.card} border ${theme.border} rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold">{p.sym}</div>
                      <div className={`text-sm ${theme.muted}`}>{p.name}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      p.act === 'BUY' ? 'bg-green-500/20 text-green-400' : 
                      p.act === 'SELL' ? 'bg-red-500/20 text-red-400' : 
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {p.act}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={theme.muted}>AI Confidence</span>
                      <span className="text-blue-400 font-bold">{p.score}/100</span>
                    </div>
                    <div className={`h-2 rounded-full ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{width: `${p.score}%`}}></div>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 ${theme.muted}`}>{p.reason}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <div className={`text-xs mb-1 ${theme.muted}`}>Entry</div>
                      <div className="font-bold text-green-400">{p.entry}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <div className={`text-xs mb-1 ${theme.muted}`}>Target</div>
                      <div className="font-bold text-blue-400">{p.target}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                      <div className={`text-xs mb-1 ${theme.muted}`}>Stop</div>
                      <div className="font-bold text-red-400">{p.stop}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* News */}
          {tab === "news" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {NEWS.map((n, i) => (
                <div key={i} className={`${theme.card} border ${theme.border} rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1 cursor-pointer`}>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    n.type === 'bull' ? 'bg-green-500/20 text-green-400' :
                    n.type === 'bear' ? 'bg-red-500/20 text-red-400' :
                    n.type === 'ai' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {n.tag}
                  </span>
                  <h3 className="font-bold text-lg mb-3 leading-tight">{n.title}</h3>
                  <div className={`flex justify-between text-sm ${theme.muted}`}>
                    <span>{n.src}</span>
                    <span>{n.time} ago</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${theme.muted}`}>AI Score</span>
                      <span className="text-blue-400 font-bold">{n.score}</span>
                    </div>
                    <div className={`h-1.5 rounded-full mt-2 ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{width: `${n.score}%`}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          {tab === "overview" && (
            <div className={`${theme.card} border ${theme.border} rounded-2xl p-8 text-center`}>
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">Market Overview</h3>
              <p className={theme.muted}>Select a tab above to view AI picks or news</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className={`${theme.card} border ${dark ? 'border-blue-500/30' : 'border-blue-300'} rounded-3xl p-12 text-center relative overflow-hidden`}>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl ${dark ? 'bg-blue-600/20' : 'bg-blue-400/20'}`}></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI Intelligence</span><br />delivered daily
              </h2>
              <p className={`mb-8 max-w-lg mx-auto ${theme.muted}`}>
                Join 48,000+ investors receiving AI-curated stock picks and market analysis.
              </p>
              {done ? (
                <div className="text-green-400 font-bold text-lg">✅ You're in! Check your inbox.</div>
              ) : (
                <div className="flex gap-3 max-w-md mx-auto flex-col sm:flex-row">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-lg border outline-none focus:border-blue-500 ${
                      dark ? 'bg-white/5 border-white/20' : 'bg-white border-gray-300'
                    }`}
                  />
                  <button 
                    onClick={() => email && setDone(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-6 py-3 rounded-lg font-bold transition"
                  >
                    Get Free Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t py-8 px-6 text-center ${dark ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-sm ${theme.muted}`}>© 2026 Pulse Markets AI — Not financial advice.</p>
        </footer>
      </div>
    </div>
  )
}
