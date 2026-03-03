"use client";

import { useState, useEffect } from "react";

// 👇 YAHAN PASTE KARO

const INDIAN_INDICES = [
  { name: "NIFTY 50", value: 22456, change: 0.45 },
  { name: "BANK NIFTY", value: 48210, change: -0.32 },
  { name: "SENSEX", value: 74210, change: 0.61 },
];

const MARKET_BREADTH = {
  advances: 1324,
  declines: 892,
  unchanged: 143,
};

const FII_DII = {
  fii: 1245.32,
  dii: -832.12,
};
const INDIAN_STOCKS = [
  { name: "RELIANCE", price: 2845, change: 1.2 },
  { name: "TCS", price: 4012, change: -0.5 },
];
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";

// ── GENERATE CHART DATA ───────────────────────────────────────────
function genArea(base: number, pts: number, vol: number) {
  let v = base;
 return (
  <main className="p-10 bg-black text-white min-h-screen">

    {/* INDIAN INDICES */}
    <div>
      <h2>Indian Indices</h2>
      {INDIAN_INDICES.map((index) => (
        <div key={index.name}>
          {index.name} - {index.value} ({index.change}%)
        </div>
      ))}
    </div>

    {/* MARKET BREADTH */}
    <div>
      <h2>Advance / Decline</h2>
      <p>Adv: {MARKET_BREADTH.advances}</p>
      <p>Dec: {MARKET_BREADTH.declines}</p>
      <p>Unch: {MARKET_BREADTH.unchanged}</p>
    </div>

    {/* FII DII */}
    <div>
      <h2>FII / DII</h2>
      <p>FII: {FII_DII.fii}</p>
      <p>DII: {FII_DII.dii}</p>
    </div>

    {/* STOCK LIST */}
    <div>
      <h2>Top Stocks</h2>
      {stocks.map((stock) => (
        <div key={stock.name}>
          {stock.name} - ₹{stock.price} ({stock.change}%)
        </div>
      ))}
    </div>

  </main>
);
  return Array.from({ length: pts }, (_, i) => {
    v = v + (Math.random() - 0.48) * vol;
    const d = new Date(2024, 0, i + 1);
    return { t: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), v: +v.toFixed(2) };
  });
}
const SPX_DATA  = genArea(4500, 60, 18);
const NDX_DATA  = genArea(14800, 60, 55);
const BTC_DATA  = genArea(42000, 60, 900);
const PORT_DATA = genArea(100000, 60, 1200);
const VOL_DATA  = Array.from({ length: 14 }, (_, i) => ({
  d: `Mar ${i + 1}`,
  v: Math.round(2 + Math.random() * 5),
  c: Math.random() > 0.4,
}));
const SECTOR_DATA = [
  { name: "Technology", val: 82, chg: 3.2 },
  { name: "Healthcare", val: 55, chg: 0.8 },
  { name: "Finance",    val: 63, chg: 1.4 },
  { name: "Energy",     val: 31, chg: -2.1 },
  { name: "Consumer",   val: 47, chg: -0.5 },
  { name: "Real Estate",val: 38, chg: -1.2 },
  { name: "Utilities",  val: 44, chg: 0.3 },
  { name: "Materials",  val: 59, chg: 1.9 },
];
const PIE_DATA = [
  { name: "Technology", val: 38, color: "#c9a84c" },
  { name: "Finance",    val: 22, color: "#22d67a" },
  { name: "Healthcare", val: 16, color: "#60a5fa" },
  { name: "Energy",     val: 12, color: "#f05454" },
  { name: "Other",      val: 12, color: "#6b7280" },
];
const MARKETS = [
  { name: "S&P 500",    sym: "SPX",   val: 4783.45,  chg: 1.20,  vol: "3.2B",  mkt: "42.1T",  ai: 88 },
  { name: "NASDAQ",     sym: "NDX",   val: 15123.67, chg: 0.80,  vol: "2.8B",  mkt: "19.4T",  ai: 85 },
  { name: "NVDA",       sym: "NVDA",  val: 621.90,   chg: 4.33,  vol: "420M",  mkt: "1.54T",  ai: 94 },
  { name: "AAPL",       sym: "AAPL",  val: 186.42,   chg: 2.10,  vol: "280M",  mkt: "2.89T",  ai: 82 },
  { name: "META",       sym: "META",  val: 484.10,   chg: 3.21,  vol: "190M",  mkt: "1.24T",  ai: 87 },
  { name: "TSLA",       sym: "TSLA",  val: 241.08,   chg: -1.45, vol: "510M",  mkt: "0.76T",  ai: 61 },
  { name: "MSFT",       sym: "MSFT",  val: 415.32,   chg: 1.85,  vol: "160M",  mkt: "3.09T",  ai: 90 },
  { name: "AMZN",       sym: "AMZN",  val: 182.75,   chg: -0.44, vol: "230M",  mkt: "1.89T",  ai: 78 },
  { name: "GOOGL",      sym: "GOOGL", val: 172.63,   chg: 0.92,  vol: "145M",  mkt: "1.71T",  ai: 80 },
  { name: "JPM",        sym: "JPM",   val: 198.44,   chg: -0.88, vol: "98M",   mkt: "0.57T",  ai: 66 },
  { name: "NIFTY 50",   sym: "NIFTY", val: 21456.30, chg: -0.30, vol: "1.1B",  mkt: "3.2T",   ai: 71 },
  { name: "BTC/USD",    sym: "BTC",   val: 67320,    chg: 3.20,  vol: "28B",   mkt: "1.32T",  ai: 79 },
];
const NEWS = [
  { tag: "Bullish", type: "bull", title: "Fed holds rates steady as inflation cools — AI models flag historic buying window in tech", src: "Reuters", time: "2h", score: 88, excerpt: "CPI printing below expectations for the third consecutive month — quantitative models detect early hallmarks of a sustained rally across large-cap growth stocks." },
  { tag: "AI Pick", type: "ai", title: "NVDA earnings: record data center revenue expected amid unstoppable AI infrastructure boom", src: "WSJ", time: "4h", score: 94, excerpt: null },
  { tag: "Risk",    type: "bear", title: "China PMI contracts second straight month — global supply chain pressure building fast", src: "FT", time: "5h", score: 76, excerpt: null },
  { tag: "Signal",  type: "bull", title: "EV sector rotation: institutional flows pointing to contrarian entry point forming now", src: "Barron's", time: "6h", score: 81, excerpt: null },
  { tag: "Macro",   type: "neutral", title: "Dollar weakens ahead of FOMC minutes — EM currencies and commodities surge", src: "Bloomberg", time: "7h", score: 69, excerpt: null },
  { tag: "Bullish", type: "bull", title: "Apple Vision Pro enterprise adoption accelerating — analysts raise 12-month targets", src: "CNBC", time: "9h", score: 85, excerpt: null },
];
const PICKS = [
  { sym: "NVDA", name: "NVIDIA Corp",     act: "BUY",  score: 94, reason: "AI chip supercycle, earnings beat incoming",   entry: "$610", target: "$720", stop: "$570", risk: "Low",    sector: "Tech"   },
  { sym: "META", name: "Meta Platforms",  act: "BUY",  score: 87, reason: "Ad revenue rebound + AI monetization ramp",    entry: "$480", target: "$560", stop: "$455", risk: "Medium", sector: "Tech"   },
  { sym: "MSFT", name: "Microsoft Corp",  act: "BUY",  score: 90, reason: "Copilot enterprise ARR accelerating sharply",  entry: "$410", target: "$480", stop: "$390", risk: "Low",    sector: "Tech"   },
  { sym: "XOM",  name: "Exxon Mobil",     act: "SELL", score: 38, reason: "Demand pressure + China PMI weakness signal",  entry: "$102", target: "$88",  stop: "$108", risk: "Medium", sector: "Energy" },
  { sym: "TSLA", name: "Tesla Inc",       act: "HOLD", score: 61, reason: "Price war pressure, await Q2 margin clarity",  entry: "$241", target: "$260", stop: "$218", risk: "High",   sector: "Auto"   },
  { sym: "JPM",  name: "JPMorgan Chase",  act: "HOLD", score: 66, reason: "Rate sensitivity + commercial real estate risk",entry: "$198", target: "$210", stop: "$185", risk: "Medium", sector: "Finance"},
];
const HEATMAP = [
  { name: "NVDA", chg: 4.33 }, { name: "META", chg: 3.21 }, { name: "AAPL", chg: 2.10 },
  { name: "MSFT", chg: 1.85 }, { name: "GOOGL", chg: 0.92 }, { name: "V",    chg: 1.22 },
  { name: "BRK",  chg: 0.31 }, { name: "AMZN", chg: -0.44 }, { name: "JPM",  chg: -0.88 },
  { name: "TSLA", chg: -1.45 }, { name: "JNJ",  chg: -0.33 }, { name: "XOM",  chg: -2.10 },
];
const WATCHLIST = [
  { sym: "NVDA", val: 621.90, chg: 4.33, data: genArea(600, 20, 8) },
  { sym: "AAPL", val: 186.42, chg: 2.10, data: genArea(182, 20, 2) },
  { sym: "BTC",  val: 67320,  chg: 3.20, data: genArea(64000, 20, 600) },
  { sym: "TSLA", val: 241.08, chg: -1.45, data: genArea(248, 20, 4) },
];

// ── CUSTOM TOOLTIP ────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#141927", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
      <div style={{ color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#c9a84c", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
        {typeof payload[0].value === "number" && payload[0].value > 10000
          ? payload[0].value.toLocaleString()
          : payload[0].value?.toLocaleString()}
      </div>
    </div>
  );
};

// ── MINI SPARK ────────────────────────────────────────────────────
function MiniSpark({ data, up }: { data: { v: number }[]; up: boolean }) {
  const color = up ? "#22d67a" : "#f05454";
  const vals = data.map(d => d.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 80},${32 - ((v - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 80 32" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
      <defs>
        <linearGradient id={`ms${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${pts} 80,32`} fill={`url(#ms${up})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────────
export default function Home() {

  const [stocks, setStocks] = useState(INDIAN_STOCKS);
function Gauge({ score }: { score: number }) {
  const a = -135 + (score / 100) * 270;
  const label = score >= 75 ? "Strongly Bullish" : score >= 55 ? "Moderately Bullish" : score >= 45 ? "Neutral" : score >= 30 ? "Bearish" : "Strongly Bearish";
  const lc = score >= 55 ? "#22d67a" : score >= 45 ? "#c9a84c" : "#f05454";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 220 130" style={{ width: 220, height: 130 }}>
        <defs>
          <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f05454" />
            <stop offset="50%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#22d67a" />
          </linearGradient>
        </defs>
        <path d="M 25 120 A 85 85 0 0 1 195 120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 25 120 A 85 85 0 0 1 195 120" fill="none" stroke="url(#gg)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray="267" strokeDashoffset={267 - (score / 100) * 267}
          style={{ transition: "stroke-dashoffset 1.6s ease" }} />
        <g transform={`rotate(${a}, 110, 120)`}>
          <line x1="110" y1="120" x2="110" y2="46" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="110" cy="120" r="5" fill="#c9a84c" />
        </g>
        <text x="110" y="105" textAnchor="middle" fill="#e8eaf0" style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 700 }}>{score}</text>
      </svg>
      <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 18, color: lc, marginTop: -4 }}>{label}</div>
    </div>
  );
}

// ── ANIMATED COUNTER ──────────────────────────────────────────────
function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0; const step = end / 55;
        const t = setInterval(() => { s += step; if (s >= end) { setV(end); clearInterval(t); } else setV(Math.floor(s)); }, 18);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark] = useState(true);
  const [markets, setMarkets] = useState(MARKETS);
  const [tab, setTab] = useState<"overview"|"picks"|"news"|"portfolio">("overview");
  const [sortCol, setSortCol] = useState<string>("ai");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [activePie, setActivePie] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setMarkets(p => p.map(m => ({
        ...m,
        val: +(m.val * (1 + (Math.random() - 0.499) * 0.0009)).toFixed(2),
        chg: +(m.chg + (Math.random() - 0.499) * 0.05).toFixed(2),
      })));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const sorted = [...markets].sort((a, b) => {
    const av = (a as any)[sortCol], bv = (b as any)[sortCol];
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const portVal = 127420;
  const portChg = 3.24;

  return (
    <div className={`theme-wrap ${dark ? "theme-dark" : "theme-light"}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

        /* ── DARK THEME (default) ── */
        :root, .theme-dark {
          --bg:#07090e; --bg2:#0c0f18; --bg3:#111520; --sf:#141927; --sf2:#1b2135;
          --bd:rgba(255,255,255,0.07); --bd2:rgba(255,255,255,0.13);
          --gold:#c9a84c; --gold2:#f0cc6e; --g3:rgba(201,168,76,0.1);
          --grn:#22d67a; --red:#f05454; --blue:#60a5fa;
          --tx:#e8eaf0; --dm:#9ca3af; --mt:#6b7280;
          --nav-bg:rgba(7,9,14,0.82);
          --orb1:rgba(201,168,76,0.05); --orb2:rgba(34,214,122,0.03);
          --grid-line:rgba(201,168,76,0.028);
          --shadow:0 32px 80px rgba(0,0,0,0.55);
        }

        /* ── LIGHT THEME ── */
        .theme-light {
          --bg:#f5f5f0; --bg2:#ebebeb; --bg3:#e2e2d8; --sf:#ffffff; --sf2:#f0f0e8;
          --bd:rgba(0,0,0,0.08); --bd2:rgba(0,0,0,0.14);
          --gold:#b8952e; --gold2:#d4a93a; --g3:rgba(184,149,46,0.1);
          --grn:#16a35a; --red:#dc2626; --blue:#2563eb;
          --tx:#111318; --dm:#4b5563; --mt:#9ca3af;
          --nav-bg:rgba(245,245,240,0.88);
          --orb1:rgba(184,149,46,0.08); --orb2:rgba(22,163,90,0.06);
          --grid-line:rgba(184,149,46,0.06);
          --shadow:0 16px 48px rgba(0,0,0,0.12);
        }

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        .theme-wrap{background:var(--bg);color:var(--tx);font-family:'DM Mono',monospace;overflow-x:hidden;min-height:100vh;transition:background 0.35s ease,color 0.35s ease;}
        .theme-wrap *{transition:background-color 0.35s ease,border-color 0.35s ease,color 0.3s ease;}
        .theme-wrap .notransition{transition:none!important;}
        body{margin:0;padding:0;}
        .gbg{position:fixed;inset:0;background-image:linear-gradient(var(--grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);background-size:72px 72px;pointer-events:none;z-index:0;}
        .orb{position:fixed;border-radius:50%;filter:blur(140px);pointer-events:none;animation:drift 14s ease-in-out infinite alternate;z-index:0;}
        .o1{width:700px;height:700px;background:var(--orb1);top:-200px;right:-100px;}
        .o2{width:500px;height:500px;background:var(--orb2);bottom:-100px;left:-100px;animation-delay:-7s;}
        .o3{width:350px;height:350px;background:var(--orb1);top:50%;left:38%;animation-delay:-3s;}
        @keyframes drift{from{transform:translate(0,0) scale(1);}to{transform:translate(40px,50px) scale(1.12);}}

        /* THEME TOGGLE */
        .theme-toggle{
          display:flex;align-items:center;gap:8px;
          background:var(--sf);border:1px solid var(--bd2);
          border-radius:100px;padding:4px;cursor:pointer;
          transition:all 0.3s;
        }
        .theme-toggle:hover{border-color:var(--gold);}
        .toggle-track{
          width:44px;height:24px;border-radius:100px;
          background:var(--bg3);border:1px solid var(--bd2);
          position:relative;transition:background 0.3s;
          flex-shrink:0;
        }
        .theme-light .toggle-track{background:linear-gradient(135deg,#fbbf24,#f59e0b);}
        .theme-dark .toggle-track{background:linear-gradient(135deg,#1e3a5f,#2563eb);}
        .toggle-thumb{
          position:absolute;top:2px;left:2px;
          width:18px;height:18px;border-radius:50%;
          background:#ffffff;
          transition:transform 0.3s cubic-bezier(.34,1.56,.64,1);
          display:flex;align-items:center;justify-content:center;
          font-size:10px;box-shadow:0 1px 4px rgba(0,0,0,0.3);
        }
        .theme-light .toggle-thumb{transform:translateX(20px);}
        .toggle-label{font-family:'Syne',sans-serif;font-size:11px;font-weight:600;color:var(--dm);letter-spacing:0.04em;padding-right:8px;}

        /* NAV */
        nav{position:fixed;top:0;left:0;right:0;z-index:300;height:66px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:var(--nav-bg);backdrop-filter:blur(24px);border-bottom:1px solid var(--bd);}
        .nl{display:flex;align-items:center;gap:14px;}
        .lm{width:38px;height:38px;border-radius:9px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:17px;color:#07090e;}
        .ln{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;letter-spacing:-0.02em;}
        .ln span{color:var(--gold);}
        .nls{display:flex;gap:32px;list-style:none;}
        .nls a{color:var(--mt);text-decoration:none;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;}
        .nls a:hover{color:var(--tx);}
        .nr{display:flex;gap:10px;align-items:center;}
        .bg{background:none;border:1px solid var(--bd2);color:var(--dm);padding:8px 18px;border-radius:7px;font-family:'DM Mono',monospace;font-size:12px;cursor:pointer;transition:all 0.2s;}
        .bg:hover{border-color:var(--gold);color:var(--gold);}
        .bp{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#07090e;padding:9px 22px;border-radius:7px;font-family:'Syne',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.04em;cursor:pointer;transition:all 0.2s;}
        .bp:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(201,168,76,0.35);}

        /* TICKER */
        .tkb{position:fixed;top:66px;left:0;right:0;z-index:299;height:34px;background:var(--bg2);border-bottom:1px solid var(--bd);overflow:hidden;display:flex;align-items:center;}
        .tkt{display:flex;animation:tick 30s linear infinite;white-space:nowrap;}
        .ti{display:flex;align-items:center;gap:8px;padding:0 26px;font-size:11px;border-right:1px solid var(--bd);}
        .tn{color:var(--mt);} .tv{color:var(--tx);} .tc{font-weight:500;}
        .up{color:var(--grn);} .dn{color:var(--red);}
        @keyframes tick{from{transform:translateX(0);}to{transform:translateX(-50%);}}

        /* HERO */
        .hero{padding:186px 48px 72px;max-width:1340px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:68px;align-items:center;}
        .hbadge{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.18);border-radius:100px;padding:5px 16px;font-size:11px;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:22px;}
        .ldot{width:7px;height:7px;background:var(--grn);border-radius:50%;animation:pd 2s ease-in-out infinite;}
        @keyframes pd{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
        h1{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(42px,5.2vw,70px);line-height:1;letter-spacing:-0.035em;margin-bottom:20px;}
        h1 em{font-family:'Instrument Serif',serif;font-style:italic;color:var(--gold);}
        .hp{font-size:14.5px;line-height:1.75;color:var(--dm);margin-bottom:38px;max-width:460px;}
        .hbtns{display:flex;gap:14px;flex-wrap:wrap;}
        .bh{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#07090e;padding:15px 34px;border-radius:9px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 0 40px rgba(201,168,76,0.25);transition:all 0.25s;}
        .bh:hover{transform:translateY(-2px);box-shadow:0 10px 48px rgba(201,168,76,0.4);}
        .bo{background:none;border:1px solid rgba(255,255,255,0.1);color:var(--tx);padding:15px 34px;border-radius:9px;font-family:'Syne',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:8px;}
        .bo:hover{border-color:rgba(255,255,255,0.22);background:rgba(255,255,255,0.03);}
        .theme-light .bo{border-color:rgba(0,0,0,0.15);}
        .theme-light .bo:hover{border-color:rgba(0,0,0,0.3);background:rgba(0,0,0,0.04);}
        .theme-light .hw{box-shadow:0 16px 48px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.8);}
        .theme-light .ctac{box-shadow:0 8px 40px rgba(0,0,0,0.08);}
        .theme-light .hms{background:var(--bg2);}
        .theme-light nav{box-shadow:0 1px 0 var(--bd);}
        .theme-light .card{box-shadow:0 2px 12px rgba(0,0,0,0.06);}
        .theme-light .tbl tr:hover{background:rgba(0,0,0,0.025);}
        .theme-light .pst,.theme-light .pc,.theme-light .wlc{box-shadow:0 2px 8px rgba(0,0,0,0.06);}
        .trust{margin-top:34px;display:flex;align-items:center;gap:18px;}
        .avs{display:flex;}
        .av{width:28px;height:28px;border-radius:50%;border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--gold);}
        .txt{font-size:12px;color:var(--mt);line-height:1.55;}
        .txt strong{color:var(--tx);}

        /* HERO WIDGET */
        .hw{background:var(--sf);border:1px solid var(--bd);border-radius:18px;padding:24px;position:relative;overflow:hidden;animation:flt 7s ease-in-out infinite;box-shadow:0 32px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.055);}
        .hw::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
        @keyframes flt{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
        .wh{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .wt{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.06em;color:var(--dm);text-transform:uppercase;}
        .lp{background:rgba(34,214,122,0.1);border:1px solid rgba(34,214,122,0.2);color:var(--grn);font-size:10px;letter-spacing:0.07em;padding:3px 10px;border-radius:5px;display:flex;align-items:center;gap:5px;}
        .mcs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin-bottom:16px;}
        .mc{background:var(--bg3);border:1px solid var(--bd);border-radius:9px;padding:12px 10px;}
        .mcn{font-size:9px;color:var(--mt);letter-spacing:0.07em;text-transform:uppercase;margin-bottom:6px;}
        .mcv{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;letter-spacing:-0.02em;margin-bottom:2px;}
        .mcc{font-size:11px;font-weight:500;}
        .apb{background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.14);border-radius:10px;padding:13px;display:flex;gap:11px;margin-bottom:16px;}
        .ai{width:33px;height:33px;background:linear-gradient(135deg,var(--gold),var(--gold2));border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;color:#07090e;}
        .al{font-size:10px;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px;}
        .at{font-size:12px;color:var(--dm);line-height:1.5;}
        .at strong{color:var(--tx);}
        .wf{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--bd);}
        .ws .wsn{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--gold);}
        .ws .wsl{font-size:10px;color:var(--mt);letter-spacing:0.05em;margin-top:2px;}
        .div1{width:1px;height:34px;background:var(--bd);}

        /* STATS */
        .ss{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--bg2);}
        .si{max-width:1340px;margin:0 auto;padding:30px 48px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px;}
        .sb{text-align:center;}
        .sn{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:var(--gold);letter-spacing:-0.04em;line-height:1;margin-bottom:7px;}
        .sl{font-size:11px;color:var(--mt);letter-spacing:0.08em;text-transform:uppercase;}

        /* SECTION */
        .sec{max-width:1340px;margin:0 auto;padding:68px 48px;}
        .slb{display:inline-flex;align-items:center;gap:10px;font-size:11px;color:var(--gold);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;}
        .slb::before{content:'';display:block;width:26px;height:1px;background:var(--gold);}
        .st{font-family:'Syne',sans-serif;font-size:clamp(26px,3vw,44px);font-weight:800;letter-spacing:-0.035em;line-height:1.08;margin-bottom:12px;}
        .st em{font-family:'Instrument Serif',serif;font-style:italic;color:var(--gold);}
        .sp{font-size:13.5px;color:var(--dm);line-height:1.75;max-width:540px;}

        /* CHARTS GRID */
        .cg3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px;}
        .cg2{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:40px;}
        .card{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:22px;transition:border-color 0.2s,transform 0.2s;}
        .card:hover{border-color:rgba(201,168,76,0.2);transform:translateY(-2px);}
        .card::before{display:none;}
        .ch{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;}
        .ctn{font-family:'Syne',sans-serif;font-size:12px;font-weight:600;color:var(--dm);text-transform:uppercase;letter-spacing:0.06em;}
        .cv{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.03em;margin-bottom:2px;}
        .cc{font-size:12px;font-weight:500;margin-bottom:16px;}
        .tag{display:inline-block;font-size:10px;letter-spacing:0.07em;padding:3px 9px;border-radius:5px;text-transform:uppercase;}
        .tbu{background:rgba(34,214,122,0.1);border:1px solid rgba(34,214,122,0.2);color:var(--grn);}
        .tbd{background:rgba(240,84,84,0.1);border:1px solid rgba(240,84,84,0.2);color:var(--red);}
        .tai{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:var(--gold);}
        .tne{background:rgba(156,163,175,0.1);border:1px solid rgba(156,163,175,0.2);color:var(--dm);}

        /* TABS */
        .tw{max-width:1340px;margin:0 auto;padding:68px 48px;}
        .tabs{display:flex;gap:4px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:5px;width:fit-content;margin-bottom:32px;}
        .tab{padding:9px 26px;border-radius:7px;border:none;background:none;color:var(--mt);font-family:'Syne',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.04em;cursor:pointer;transition:all 0.2s;text-transform:uppercase;}
        .tab.on{background:var(--sf);color:var(--tx);box-shadow:0 2px 12px rgba(0,0,0,0.4);}

        /* TABLE */
        .tbl{width:100%;border-collapse:collapse;}
        .tbl th{font-size:10px;color:var(--mt);text-transform:uppercase;letter-spacing:0.08em;padding:0 14px 12px;text-align:left;border-bottom:1px solid var(--bd);cursor:pointer;user-select:none;transition:color 0.2s;white-space:nowrap;}
        .tbl th:hover{color:var(--gold);}
        .tbl th.act{color:var(--gold);}
        .tbl td{padding:13px 14px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .tbl tr{transition:background 0.18s;cursor:pointer;}
        .tbl tr:hover{background:rgba(255,255,255,0.025);}
        .sc{display:inline-flex;align-items:center;gap:9px;}
        .si2{width:30px;height:30px;background:var(--sf2);border:1px solid var(--bd);border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:9px;font-weight:700;color:var(--gold);letter-spacing:0.04em;}
        .sn2{font-family:'Syne',sans-serif;font-weight:600;font-size:13px;}
        .ss2{font-size:10px;color:var(--mt);margin-top:1px;}
        .cp{display:inline-flex;align-items:center;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:600;}
        .cpu{background:rgba(34,214,122,0.1);color:var(--grn);}
        .cpd{background:rgba(240,84,84,0.1);color:var(--red);}
        .sb2{display:flex;align-items:center;gap:7px;}
        .st2{flex:1;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;}
        .sf2f{height:100%;background:linear-gradient(90deg,var(--gold),var(--grn));border-radius:2px;}
        .wbtn{background:none;border:1px solid var(--bd2);color:var(--dm);padding:5px 13px;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;transition:all 0.2s;}
        .wbtn:hover{border-color:var(--gold);color:var(--gold);}

        /* PICKS */
        .pg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .pc{background:var(--sf);border:1px solid var(--bd);border-radius:13px;padding:22px;cursor:pointer;transition:all 0.25s;}
        .pc:hover{border-color:rgba(201,168,76,0.22);transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,0.5);}
        .pt{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
        .psym{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.02em;}
        .pnm{font-size:11px;color:var(--mt);margin-top:2px;}
        .ap{padding:5px 13px;border-radius:6px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;}
        .ab{background:rgba(34,214,122,0.12);border:1px solid rgba(34,214,122,0.25);color:var(--grn);}
        .as{background:rgba(240,84,84,0.12);border:1px solid rgba(240,84,84,0.25);color:var(--red);}
        .ah{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);color:var(--gold);}
        .psr{display:flex;align-items:center;gap:9px;margin-bottom:12px;}
        .prl{font-size:12px;color:var(--dm);line-height:1.6;margin-bottom:14px;}
        .pd2{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
        .pdb{background:var(--bg3);border:1px solid var(--bd);border-radius:7px;padding:9px 11px;}
        .pdl{font-size:9px;color:var(--mt);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;}
        .pdv{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;}

        /* NEWS */
        .ng{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:auto auto;gap:14px;}
        .nc{background:var(--sf);border:1px solid var(--bd);border-radius:13px;padding:20px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
        .nc:hover{border-color:rgba(201,168,76,0.22);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,0.55);}
        .nc.ft{grid-row:1/3;display:flex;flex-direction:column;justify-content:flex-end;min-height:360px;}
        .nc.ft::before{content:'';position:absolute;inset:0;background:linear-gradient(160deg,rgba(201,168,76,0.05) 0%,transparent 50%);}
        .ntg{display:inline-block;font-size:10px;letter-spacing:0.08em;padding:3px 10px;border-radius:5px;text-transform:uppercase;margin-bottom:12px;}
        .ntt{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;line-height:1.35;color:var(--tx);margin-bottom:9px;letter-spacing:-0.01em;}
        .nc.ft .ntt{font-size:20px;}
        .nex{font-size:12px;color:var(--dm);line-height:1.65;margin-bottom:12px;}
        .nm{font-size:11px;color:var(--mt);display:flex;gap:10px;}
        .nsc{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--bd);}
        .nsl{font-size:10px;color:var(--mt);text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;}
        .nst{flex:1;height:3px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;}
        .nsf{height:100%;background:linear-gradient(90deg,var(--gold),var(--grn));border-radius:2px;}
        .nsn{font-size:11px;color:var(--gold);}

        /* PORTFOLIO */
        .port-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
        .port-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .pst{background:var(--sf);border:1px solid var(--bd);border-radius:11px;padding:18px;}
        .pstn{font-size:11px;color:var(--mt);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:7px;}
        .pstv{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.03em;}
        .pstc{font-size:12px;margin-top:3px;}

        /* WATCHLIST */
        .wl{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px;}
        .wlc{background:var(--sf);border:1px solid var(--bd);border-radius:11px;padding:16px;cursor:pointer;transition:all 0.2s;}
        .wlc:hover{border-color:rgba(201,168,76,0.2);transform:translateY(-2px);}
        .wls{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;}
        .wlv{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin:4px 0;}
        .wlc2{font-size:11px;font-weight:500;}

        /* HEATMAP */
        .hms{background:var(--bg2);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);}
        .hmw{max-width:1340px;margin:0 auto;padding:68px 48px;}
        .hmg{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:36px;}
        .hmc{border-radius:10px;padding:15px 12px;cursor:pointer;transition:all 0.2s;border:1px solid transparent;min-height:88px;display:flex;flex-direction:column;justify-content:space-between;}
        .hmc:hover{transform:scale(1.05);border-color:rgba(255,255,255,0.18)!important;box-shadow:0 8px 28px rgba(0,0,0,0.5);}
        .hmsym{font-family:'Syne',sans-serif;font-size:14px;font-weight:800;}
        .hmch{font-size:12px;font-weight:600;}
        .hmmc{font-size:10px;opacity:0.6;margin-top:2px;}

        /* GAUGE */
        .gs{max-width:1340px;margin:0 auto;padding:68px 48px;display:grid;grid-template-columns:auto 1fr;gap:56px;align-items:center;}
        .gb{background:var(--sf);border:1px solid var(--bd);border-radius:18px;padding:36px 40px;text-align:center;position:relative;overflow:hidden;}
        .gb::before{content:'';position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:260px;height:260px;background:radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%);pointer-events:none;}
        .sbars{display:flex;flex-direction:column;gap:13px;}
        .sbi{display:flex;align-items:center;gap:14px;}
        .sbn{font-size:12px;color:var(--dm);width:90px;flex-shrink:0;}
        .sbt{flex:1;height:6px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden;}
        .sbf{height:100%;border-radius:3px;transition:width 1.2s ease;}
        .sbp{font-size:12px;color:var(--tx);width:36px;text-align:right;}

        /* SECTOR */
        .scg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:36px;}
        .scc{background:var(--sf);border:1px solid var(--bd);border-radius:11px;padding:18px;transition:all 0.2s;}
        .scc:hover{border-color:rgba(201,168,76,0.2);transform:translateY(-2px);}
        .scn{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;margin-bottom:10px;}
        .scb{height:5px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden;margin-bottom:8px;}
        .scbf{height:100%;border-radius:3px;}
        .scv{font-size:12px;}

        /* CTA */
        .ctaw{padding:72px 48px;}
        .ctac{max-width:760px;margin:0 auto;background:var(--sf);border:1px solid rgba(201,168,76,0.18);border-radius:24px;padding:60px 52px;text-align:center;position:relative;overflow:hidden;}
        .ctac::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:420px;height:420px;background:radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 65%);pointer-events:none;}
        .ctac h2{font-family:'Syne',sans-serif;font-size:clamp(26px,3.2vw,42px);font-weight:800;letter-spacing:-0.03em;line-height:1.08;margin-bottom:14px;}
        .ctac h2 em{font-family:'Instrument Serif',serif;font-style:italic;color:var(--gold);}
        .ctac p{font-size:14px;color:var(--dm);line-height:1.75;margin-bottom:34px;max-width:480px;margin-left:auto;margin-right:auto;}
        .er{display:flex;gap:10px;max-width:450px;margin:0 auto;}
        .ei{flex:1;background:var(--bg3);border:1px solid var(--bd2);color:var(--tx);padding:13px 18px;border-radius:9px;font-family:'DM Mono',monospace;font-size:13px;outline:none;transition:border-color 0.2s;}
        .ei:focus{border-color:rgba(201,168,76,0.4);}
        .ei::placeholder{color:var(--mt);}
        .bsu{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#07090e;padding:13px 24px;border-radius:9px;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.03em;cursor:pointer;transition:all 0.2s;white-space:nowrap;box-shadow:0 4px 24px rgba(201,168,76,0.25);}
        .bsu:hover{transform:translateY(-1px);box-shadow:0 8px 36px rgba(201,168,76,0.4);}
        .fn{font-size:11px;color:var(--mt);margin-top:13px;}
        .ok{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--grn);font-size:14px;font-family:'Syne',sans-serif;font-weight:600;}

        /* FOOTER */
        footer{border-top:1px solid var(--bd);padding:28px 48px;display:flex;align-items:center;justify-content:space-between;}
        .fls{display:flex;gap:28px;list-style:none;}
        .fls a{font-size:11px;color:var(--mt);text-decoration:none;letter-spacing:0.04em;transition:color 0.2s;}
        .fls a:hover{color:var(--gold);}
        footer p{font-size:11px;color:var(--mt);}

        /* ANIM */
        @keyframes fu{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fu 0.8s ease both;}
        .d1{animation-delay:0.1s;}.d2{animation-delay:0.25s;}.d3{animation-delay:0.4s;}.d4{animation-delay:0.55s;}.d5{animation-delay:0.68s;}

        @media(max-width:1024px){
          .hero{grid-template-columns:1fr;padding:150px 20px 56px;}
          .hw{display:none;}
          .si{grid-template-columns:repeat(2,1fr);padding:20px;}
          .cg3,.cg2{grid-template-columns:1fr;}
          .ng,.pg{grid-template-columns:1fr;}
          .nc.ft{grid-row:auto;min-height:200px;}
          .port-grid{grid-template-columns:1fr;}
          .port-stats{grid-template-columns:repeat(2,1fr);}
          .hmg{grid-template-columns:repeat(3,1fr);}
          .scg{grid-template-columns:repeat(2,1fr);}
          .wl{grid-template-columns:repeat(2,1fr);}
          .gs{grid-template-columns:1fr;}
          nav{padding:0 20px;}
          .nls{display:none;}
          .tw,.sec,.hmw,.ctaw{padding:48px 20px;}
          .er{flex-direction:column;}
          footer{flex-direction:column;gap:16px;padding:20px;}
        }
      `}</style>

      <div className="gbg" />
      <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />

      {/* ── NAV ── */}
      <nav>
        <div className="nl">
          <div className="lm">P</div>
          <div className="ln">Pulse <span>Markets</span></div>
        </div>
        <ul className="nls">
          {["Markets","AI Picks","Analysis","Watchlist","Portfolio"].map(l => <li key={l}><a href="#">{l}</a></li>)}
        </ul>
        <div className="nr">
          {/* DARK / LIGHT TOGGLE */}
          <button className="theme-toggle" onClick={() => setDark(d => !d)} title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <div className="toggle-track">
              <div className="toggle-thumb">{dark ? "🌙" : "☀️"}</div>
            </div>
            <span className="toggle-label">{dark ? "Dark" : "Light"}</span>
          </button>
          <button className="bg">Sign In</button>
          <button className="bp">Get Pro ↗</button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div className="tkb">
        <div className="tkt">
          {[...markets, ...markets].map((m, i) => (
            <div className="ti" key={i}>
              <span className="tn">{m.sym}</span>
              <span className="tv">{m.val > 999 ? m.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : m.val.toFixed(2)}</span>
              <span className={`tc ${m.chg >= 0 ? "up" : "dn"}`}>{m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div>
          <div className="hbadge fu d1"><div className="ldot" />AI-Powered Market Intelligence</div>
          <h1 className="fu d2">Markets move.<br /><em>Move first.</em></h1>
          <p className="hp fu d3">Real-time AI signals, curated stock picks, and institutional-grade intelligence — built for investors who refuse to be second.</p>
          <div className="hbtns fu d4">
            <button className="bh">Start Free Trial →</button>
            <button className="bo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              See How It Works
            </button>
          </div>
          <div className="trust fu d5">
            <div className="avs">
              {["H","A","R","K","S"].map((l, i) => (
                <div className="av" key={i} style={{ marginLeft: i===0?0:-8, background:`hsl(${i*55+20},35%,22%)` }}>{l}</div>
              ))}
            </div>
            <div className="txt"><strong>48,000+</strong> investors trust Pulse<br />for daily market intelligence</div>
          </div>
        </div>

        <div className="hw">
          <div className="wh">
            <span className="wt">Live Dashboard</span>
            <span className="lp"><div className="ldot" />Live</span>
          </div>
          <div className="mcs">
            {markets.slice(0,3).map((m, i) => (
              <div className="mc" key={i}>
                <div className="mcn">{m.name}</div>
                <div className={`mcv ${m.chg>=0?"up":"dn"}`}>{m.val > 999 ? m.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : m.val.toFixed(2)}</div>
                <div className={`mcc ${m.chg>=0?"up":"dn"}`}>{m.chg>=0?"▲":"▼"} {Math.abs(m.chg).toFixed(2)}%</div>
                <div style={{marginTop:8}}><MiniSpark data={SPX_DATA.slice(-20)} up={m.chg>=0} /></div>
              </div>
            ))}
          </div>
          <div className="apb">
            <div className="ai">⚡</div>
            <div>
              <div className="al">AI Top Pick Today</div>
              <div className="at"><strong>NVDA</strong> — AI chip supercycle intact. Earnings beat highly probable. Confidence: <strong style={{color:"var(--grn)"}}>94/100</strong></div>
            </div>
          </div>
          <div className="wf">
            <div className="ws"><div className="wsn">91%</div><div className="wsl">Accuracy</div></div>
            <div className="div1" />
            <div className="ws"><div className="wsn">2.4M</div><div className="wsl">Daily Signals</div></div>
            <div className="div1" />
            <div className="ws"><div className="wsn">&lt;2s</div><div className="wsl">Latency</div></div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="ss">
        <div className="si">
          {[{n:48000,s:"+",l:"Active Investors"},{n:2400000,s:"+",l:"Signals Per Day"},{n:91,s:"%",l:"AI Accuracy Rate"},{n:12,s:"ms",l:"Avg Alert Speed"}].map((s,i)=>(
            <div className="sb" key={i}>
              <div className="sn"><Counter end={s.n} suffix={s.s} /></div>
              <div className="sl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARKET CHARTS ── */}
      <div className="sec">
        <div className="slb">Live Charts</div>
        <div className="st">Market <em>Performance</em></div>
        <div className="cg3">
          {[
            { label:"S&P 500", sym:"SPX", data:SPX_DATA, up:true  },
            { label:"NASDAQ",  sym:"NDX", data:NDX_DATA, up:true  },
            { label:"BTC/USD", sym:"BTC", data:BTC_DATA, up:true  },
          ].map((c, i) => {
            const cur = c.data[c.data.length - 1].v;
            const prev = c.data[0].v;
            const chgPct = (((cur - prev) / prev) * 100).toFixed(2);
            const isUp = parseFloat(chgPct) >= 0;
            const color = isUp ? "#22d67a" : "#f05454";
            return (
              <div className="card" key={i}>
                <div className="ch">
                  <div>
                    <div className="ctn">{c.label}</div>
                    <div className={`cv ${isUp?"up":"dn"}`}>{cur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                    <div className={`cc ${isUp?"up":"dn"}`}>{isUp?"▲":"▼"} {Math.abs(parseFloat(chgPct)).toFixed(2)}% (30d)</div>
                  </div>
                  <span className={isUp?"tag tbu":"tag tbd"}>{isUp?"Bullish":"Bearish"}</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={c.data} margin={{top:0,right:0,left:0,bottom:0}}>
                    <defs>
                      <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" hide />
                    <YAxis domain={["auto","auto"]} hide />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} fill={`url(#g${i})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>

        {/* Volume + Sector bars */}
        <div className="cg2" style={{marginTop:16}}>
          <div className="card">
            <div className="ch" style={{marginBottom:16}}>
              <div><div className="ctn">Market Volume</div><div style={{fontSize:12,color:"var(--dm)",marginTop:4}}>Daily traded volume (Billions)</div></div>
              <span className="tag tbu">Above Avg</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={VOL_DATA} margin={{top:0,right:0,left:-28,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="d" tick={{fill:"#6b7280",fontSize:10}} />
                <YAxis tick={{fill:"#6b7280",fontSize:10}} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="v" radius={[4,4,0,0]}>
                  {VOL_DATA.map((d, i) => <Cell key={i} fill={d.c ? "#22d67a" : "#f05454"} opacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="ch" style={{marginBottom:12}}>
              <div><div className="ctn">Portfolio Allocation</div><div style={{fontSize:12,color:"var(--dm)",marginTop:4}}>By sector weight</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <PieChart width={130} height={130}>
                <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={38} outerRadius={60} dataKey="val" paddingAngle={3}
                  onMouseEnter={(_,i)=>setActivePie(i)} onMouseLeave={()=>setActivePie(null)}>
                  {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} opacity={activePie===null||activePie===i?1:0.4} />)}
                </Pie>
              </PieChart>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                {PIE_DATA.map((d, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                    <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}} />
                    <span style={{color:"var(--dm)",flex:1}}>{d.name}</span>
                    <span style={{color:"var(--tx)",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{d.val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="tw">
        <div className="slb">Intelligence Hub</div>
        <div className="st">Everything you need to <em>trade smarter</em></div>
        <div className="tabs">
          {(["overview","picks","news","portfolio"] as const).map(t => (
            <button key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>
              {t==="overview"?"📊 Markets":t==="picks"?"⚡ AI Picks":t==="news"?"📰 News":t==="portfolio"?"💼 Portfolio":""}
            </button>
          ))}
        </div>

        {/* OVERVIEW TABLE */}
        {tab === "overview" && (
          <table className="tbl">
            <thead>
              <tr>
                <th onClick={()=>handleSort("name")} className={sortCol==="name"?"act":""}>Asset {sortCol==="name"?(sortDir==="desc"?"↓":"↑"):""}</th>
                <th onClick={()=>handleSort("val")} className={sortCol==="val"?"act":""}>Price {sortCol==="val"?(sortDir==="desc"?"↓":"↑"):""}</th>
                <th onClick={()=>handleSort("chg")} className={sortCol==="chg"?"act":""}>24h {sortCol==="chg"?(sortDir==="desc"?"↓":"↑"):""}</th>
                <th>Trend</th>
                <th onClick={()=>handleSort("vol")} className={sortCol==="vol"?"act":""}>Volume</th>
                <th onClick={()=>handleSort("mkt")} className={sortCol==="mkt"?"act":""}>Mkt Cap</th>
                <th onClick={()=>handleSort("ai")} className={sortCol==="ai"?"act":""}>AI Score {sortCol==="ai"?(sortDir==="desc"?"↓":"↑"):""}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
                <tr key={i}>
                  <td>
                    <div className="sc">
                      <div className="si2">{m.sym.slice(0,3)}</div>
                      <div><div className="sn2">{m.name}</div><div className="ss2">{m.sym}</div></div>
                    </div>
                  </td>
                  <td style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15}}>
                    {m.val > 999 ? m.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : m.val.toFixed(2)}
                  </td>
                  <td><span className={`cp ${m.chg>=0?"cpu":"cpd"}`}>{m.chg>=0?"▲":"▼"} {Math.abs(m.chg).toFixed(2)}%</span></td>
                  <td style={{width:90}}><MiniSpark data={SPX_DATA.slice(-18)} up={m.chg>=0} /></td>
                  <td style={{color:"var(--dm)",fontSize:12}}>{m.vol}</td>
                  <td style={{color:"var(--dm)",fontSize:12}}>{m.mkt}</td>
                  <td>
                    <div className="sb2">
                      <div className="st2"><div className="sf2f" style={{width:`${m.ai}%`}} /></div>
                      <span style={{fontSize:11,color:"var(--gold)",width:28}}>{m.ai}</span>
                    </div>
                  </td>
                  <td><button className="wbtn">+ Watch</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* AI PICKS */}
        {tab === "picks" && (
          <div className="pg">
            {PICKS.map((p, i) => (
              <div className="pc" key={i}>
                <div className="pt">
                  <div><div className="psym">{p.sym}</div><div className="pnm">{p.name}</div></div>
                  <span className={`ap ${p.act==="BUY"?"ab":p.act==="SELL"?"as":"ah"}`}>{p.act}</span>
                </div>
                <div className="psr">
                  <span style={{fontSize:11,color:"var(--mt)",textTransform:"uppercase",letterSpacing:"0.06em"}}>AI Confidence</span>
                  <div style={{flex:1,height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${p.score}%`,background:"linear-gradient(90deg,var(--gold),var(--grn))",borderRadius:3}} />
                  </div>
                  <span style={{fontSize:12,color:"var(--gold)",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{p.score}</span>
                </div>
                <div className="prl">{p.reason}</div>
                <div className="pd2">
                  <div className="pdb"><div className="pdl">Entry</div><div className={`pdv up`}>{p.entry}</div></div>
                  <div className="pdb"><div className="pdl">Target</div><div className="pdv" style={{color:"var(--gold)"}}>{p.target}</div></div>
                  <div className="pdb"><div className="pdl">Stop</div><div className="pdv dn">{p.stop}</div></div>
                  <div className="pdb" style={{gridColumn:"1/-1"}}><div className="pdl">Risk Level</div>
                    <div className={`pdv ${p.risk==="Low"?"up":p.risk==="High"?"dn":""}`} style={{fontSize:13}}>{p.risk}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NEWS */}
        {tab === "news" && (
          <div className="ng">
            {NEWS.map((n, i) => (
              <div className={`nc ${i===0?"ft":""}`} key={i}>
                <div>
                  <span className={`ntg ${n.type==="bull"?"tbu":n.type==="bear"?"tbd":n.type==="ai"?"tai":"tne"}`}>{n.tag}</span>
                  <div className="ntt">{n.title}</div>
                  {n.excerpt && <div className="nex">{n.excerpt}</div>}
                  <div className="nm"><span>{n.src}</span><span>{n.time} ago</span></div>
                </div>
                <div className="nsc">
                  <span className="nsl">AI Score</span>
                  <div className="nst"><div className="nsf" style={{width:`${n.score}%`}} /></div>
                  <span className="nsn">{n.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PORTFOLIO */}
        {tab === "portfolio" && (
          <div>
            <div className="port-stats" style={{marginBottom:16}}>
              {[
                {l:"Total Value",   v:`$${portVal.toLocaleString()}`, c:`+${portChg}%`, up:true},
                {l:"Today's P&L",   v:"+$1,840",                     c:"+1.46%",       up:true},
                {l:"Total Return",  v:"+$27,420",                    c:"+27.4%",       up:true},
                {l:"Active Positions", v:"8",                        c:"3 Profitable", up:true},
              ].map((s,i) => (
                <div className="pst" key={i}>
                  <div className="pstn">{s.l}</div>
                  <div className={`pstv ${s.up?"up":""}`}>{s.v}</div>
                  <div className={`pstc ${s.up?"up":"dn"}`}>{s.c}</div>
                </div>
              ))}
            </div>
            <div className="port-grid">
              <div className="card">
                <div className="ch" style={{marginBottom:14}}>
                  <div><div className="ctn">Portfolio Performance</div><div style={{fontSize:12,color:"var(--dm)",marginTop:4}}>Total value over time</div></div>
                  <span className="tag tbu">+27.4%</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={PORT_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                    <defs>
                      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="t" tick={{fill:"#6b7280",fontSize:9}} interval={10} />
                    <YAxis tick={{fill:"#6b7280",fontSize:9}} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="v" stroke="#c9a84c" strokeWidth={2} fill="url(#pg)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <div className="ch" style={{marginBottom:12}}>
                  <div><div className="ctn">Sector Breakdown</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <PieChart width={130} height={130}>
                    <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={36} outerRadius={58} dataKey="val" paddingAngle={3}>
                      {PIE_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:9}}>
                    {PIE_DATA.map((d,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:12}}>
                        <div style={{width:7,height:7,borderRadius:2,background:d.color,flexShrink:0}} />
                        <span style={{color:"var(--dm)",flex:1,fontSize:11}}>{d.name}</span>
                        <span style={{color:"var(--tx)",fontFamily:"'Syne',sans-serif",fontWeight:700}}>{d.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{marginTop:16}}>
              <div style={{fontSize:12,color:"var(--mt)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Watchlist</div>
              <div className="wl">
                {WATCHLIST.map((w,i)=>(
                  <div className="wlc" key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div className="wls" style={{color:w.chg>=0?"var(--grn)":"var(--red)"}}>{w.sym}</div>
                      <span className={w.chg>=0?"tag tbu":"tag tbd"} style={{fontSize:9}}>{w.chg>=0?"▲":"▼"}{Math.abs(w.chg).toFixed(2)}%</span>
                    </div>
                    <div className="wlv">{w.val > 999 ? w.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : w.val.toFixed(2)}</div>
                    <MiniSpark data={w.data} up={w.chg>=0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── HEATMAP ── */}
      <div className="hms">
        <div className="hmw">
          <div className="slb">Market Pulse</div>
          <div className="st">S&P 500 <em>Heatmap</em></div>
          <div className="hmg">
            {HEATMAP.map((h, i) => {
              const intensity = Math.min(Math.abs(h.chg) / 5, 1);
              const bg = h.chg >= 0
                ? `rgba(34,214,122,${0.08 + intensity * 0.26})`
                : `rgba(240,84,84,${0.08 + intensity * 0.26})`;
              const bdr = h.chg >= 0
                ? `rgba(34,214,122,${0.15 + intensity * 0.3})`
                : `rgba(240,84,84,${0.15 + intensity * 0.3})`;
              return (
                <div key={i} className="hmc" style={{background:bg,borderColor:bdr}}>
                  <div className="hmsym" style={{color:h.chg>=0?"var(--grn)":"var(--red)"}}>{h.name}</div>
                  <div>
                    <div className={`hmch ${h.chg>=0?"up":"dn"}`}>{h.chg>=0?"▲":"▼"} {Math.abs(h.chg).toFixed(2)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTOR PERFORMANCE ── */}
      <div className="sec" style={{paddingTop:68}}>
        <div className="slb">Sector Intelligence</div>
        <div className="st">Sector <em>Performance</em></div>
        <div className="scg">
          {SECTOR_DATA.map((s, i) => {
            const isUp = s.chg >= 0;
            const color = isUp ? "var(--grn)" : "var(--red)";
            return (
              <div className="scc" key={i}>
                <div className="scn">{s.name}</div>
                <div className="scb">
                  <div className="scbf" style={{width:`${s.val}%`,background:isUp?"var(--grn)":"var(--red)",opacity:0.7}} />
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div className="scv" style={{color:"var(--dm)"}}>{s.val}% bullish</div>
                  <div className="scv" style={{color,fontWeight:600}}>{isUp?"▲":"▼"} {Math.abs(s.chg).toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sector bar chart */}
        <div className="card" style={{marginTop:16}}>
          <div className="ch" style={{marginBottom:16}}>
            <div><div className="ctn">Sector AI Sentiment Scores</div></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SECTOR_DATA} layout="vertical" margin={{top:0,right:20,left:60,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{fill:"#6b7280",fontSize:10}} />
              <YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:11}} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="val" radius={[0,4,4,0]}>
                {SECTOR_DATA.map((d,i)=><Cell key={i} fill={d.chg>=0?"#22d67a":"#f05454"} opacity={0.75} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── GAUGE ── */}
      <div className="gs">
        <div className="gb">
          <Gauge score={73} />
          <div style={{marginTop:16,fontSize:12,color:"var(--mt)",letterSpacing:"0.05em",textTransform:"uppercase"}}>Overall Market Sentiment</div>
        </div>
        <div>
          <div className="slb">AI Sentiment Engine</div>
          <div className="st">Know the <em>mood</em><br />of the market</div>
          <p className="sp" style={{marginBottom:32}}>Our AI aggregates signals from news, options flow, social media, and institutional data to deliver a real-time market sentiment score across every sector.</p>
          <div className="sbars">
            {[
              {name:"Technology", pct:82, color:"var(--grn)"},
              {name:"Healthcare", pct:55, color:"var(--gold)"},
              {name:"Finance",    pct:63, color:"var(--gold)"},
              {name:"Energy",     pct:31, color:"var(--red)"},
              {name:"Consumer",   pct:47, color:"var(--dm)"},
              {name:"Real Estate",pct:38, color:"var(--red)"},
            ].map((s,i) => (
              <div className="sbi" key={i}>
                <span className="sbn">{s.name}</span>
                <div className="sbt"><div className="sbf" style={{width:`${s.pct}%`,background:s.color}} /></div>
                <span className="sbp">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="ctaw">
        <div className="ctac">
          <h2>Get <em>AI Intelligence</em><br />delivered daily</h2>
          <p>Join 48,000+ investors receiving AI-curated stock picks, market signals, and news analysis — free to start, no credit card required.</p>
          {done ? (
            <div className="ok">✅ You&apos;re in! Check your inbox.</div>
          ) : (
            <>
              <div className="er">
                <input className="ei" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
                <button className="bsu" onClick={()=>email&&setDone(true)}>Get Free Access</button>
              </div>
              <div className="fn">No credit card · Unsubscribe anytime · 48K+ investors trust Pulse</div>
            </>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <p>© 2026 Pulse Markets AI — Not financial advice.</p>
        <ul className="fls">
          {["Privacy","Terms","Disclaimer","Contact"].map(l=><li key={l}><a href="#">{l}</a></li>)}
        </ul>
      </footer>
    </div>
  );
}
