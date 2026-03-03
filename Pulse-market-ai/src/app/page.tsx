"use client";
import { useState, useEffect, useRef } from "react";

// ── TYPES ──────────────────────────────────────────────────────────
interface MarketItem { name: string; val: number; chg: number; symbol: string; }
interface NewsItem { tag: string; tagType: string; title: string; source: string; time: string; score: number; excerpt?: string; }
interface HeatItem { name: string; chg: number; mktCap: string; }

// ── DATA ──────────────────────────────────────────────────────────
const INITIAL_MARKETS: MarketItem[] = [
  { name: "S&P 500",  symbol: "SPX",   val: 4783.45, chg: 1.20 },
  { name: "NASDAQ",   symbol: "NDX",   val: 15123.67, chg: 0.80 },
  { name: "NIFTY 50", symbol: "NIFTY", val: 21456.30, chg: -0.30 },
  { name: "DOW",      symbol: "DJI",   val: 37440.11, chg: 0.54 },
  { name: "AAPL",     symbol: "AAPL",  val: 186.42, chg: 2.10 },
  { name: "NVDA",     symbol: "NVDA",  val: 621.90, chg: 4.33 },
  { name: "TSLA",     symbol: "TSLA",  val: 241.08, chg: -1.45 },
  { name: "BTC",      symbol: "BTC",   val: 67320, chg: 3.20 },
  { name: "GOLD",     symbol: "GOLD",  val: 2034, chg: -0.12 },
];

const NEWS: NewsItem[] = [
  { tag: "Bullish", tagType: "bull", title: "Fed holds rates steady as inflation cools — AI models flag historic buying window in tech sector", source: "Reuters · Bloomberg", time: "2h ago", score: 88, excerpt: "With CPI printing below expectations for the third consecutive month, quantitative models are detecting the early hallmarks of a sustained rally across large-cap growth." },
  { tag: "AI Pick", tagType: "ai", title: "NVDA earnings preview: Wall Street expects record data center revenue amid AI infrastructure boom", source: "WSJ", time: "4h ago", score: 94 },
  { tag: "Risk", tagType: "bear", title: "China manufacturing PMI contracts for second straight month — global supply chain ripple expected", source: "FT · CNBC", time: "5h ago", score: 76 },
  { tag: "Opportunity", tagType: "bull", title: "EV sector rotation: institutional flows suggest contrarian entry point forming", source: "Barron's", time: "6h ago", score: 81 },
  { tag: "Macro", tagType: "neutral", title: "Dollar weakens ahead of FOMC minutes — EM currencies and commodities rally sharply", source: "Bloomberg", time: "7h ago", score: 69 },
  { tag: "Bullish", tagType: "bull", title: "Apple Vision Pro enterprise adoption accelerates — analysts raise price targets", source: "CNBC", time: "9h ago", score: 85 },
];

const HEATMAP: HeatItem[] = [
  { name: "NVDA", chg: 4.33, mktCap: "1.5T" },
  { name: "AAPL", chg: 2.10, mktCap: "2.9T" },
  { name: "MSFT", chg: 1.85, mktCap: "3.1T" },
  { name: "GOOGL", chg: 0.92, mktCap: "1.7T" },
  { name: "META", chg: 3.21, mktCap: "1.2T" },
  { name: "AMZN", chg: -0.44, mktCap: "1.8T" },
  { name: "TSLA", chg: -1.45, mktCap: "0.76T" },
  { name: "BRK", chg: 0.31, mktCap: "0.87T" },
  { name: "JPM", chg: -0.88, mktCap: "0.54T" },
  { name: "V", chg: 1.22, mktCap: "0.52T" },
  { name: "XOM", chg: -2.10, mktCap: "0.45T" },
  { name: "JNJ", chg: -0.33, mktCap: "0.38T" },
];

const PICKS = [
  { symbol: "NVDA", name: "NVIDIA Corp", action: "BUY", score: 94, reason: "AI chip supercycle, earnings beat expected", sector: "Technology", entry: "$610", target: "$720", risk: "Low" },
  { symbol: "META", name: "Meta Platforms", action: "BUY", score: 87, reason: "Ad revenue rebound + AI monetization", sector: "Technology", entry: "$480", target: "$560", risk: "Medium" },
  { symbol: "XOM", name: "Exxon Mobil", action: "SELL", score: 72, reason: "Demand concerns + China PMI weakness", sector: "Energy", entry: "$102", target: "$88", risk: "Medium" },
  { symbol: "TSLA", name: "Tesla Inc", action: "HOLD", score: 61, reason: "Price war pressure, wait for Q2 margins", sector: "Automotive", entry: "$241", target: "$260", risk: "High" },
];

// ── SPARK SVG ──────────────────────────────────────────────────────
function Spark({ up, width = 80, height = 32 }: { up: boolean; width?: number; height?: number }) {
  const pts = up
    ? "0,28 12,22 22,25 32,16 44,12 54,8 66,11 80,4"
    : "0,6 12,10 22,8 32,16 44,20 54,22 66,18 80,28";
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height: `${height}px`, display: "block" }}>
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? "#22d67a" : "#f05454"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={up ? "#22d67a" : "#f05454"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#sg-${up})`} />
      <polyline points={pts} fill="none" stroke={up ? "#22d67a" : "#f05454"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ── ANIMATED COUNTER ──────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= end) { setVal(end); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── GAUGE ─────────────────────────────────────────────────────────
function SentimentGauge({ score }: { score: number }) {
  const angle = -135 + (score / 100) * 270;
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 200 120" style={{ width: "200px", height: "120px" }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f05454" />
            <stop offset="50%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#22d67a" />
          </linearGradient>
        </defs>
        <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (score / 100) * 251} style={{ transition: "stroke-dashoffset 1.5s ease" }} />
        <g transform={`rotate(${angle}, 100, 110)`}>
          <line x1="100" y1="110" x2="100" y2="42" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="110" r="5" fill="#c9a84c" />
        </g>
        <text x="100" y="98" textAnchor="middle" fill="#e8eaf0" style={{ fontFamily: "inherit", fontSize: "22px", fontWeight: "700" }}>{score}</text>
        <text x="100" y="112" textAnchor="middle" fill="#6b7280" style={{ fontFamily: "inherit", fontSize: "9px", letterSpacing: "0.1em" }}>SENTIMENT SCORE</text>
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", width: "200px", marginTop: "-4px" }}>
        <span style={{ fontSize: "10px", color: "#f05454", letterSpacing: "0.06em" }}>BEARISH</span>
        <span style={{ fontSize: "10px", color: "#22d67a", letterSpacing: "0.06em" }}>BULLISH</span>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function Home() {
  const [markets, setMarkets] = useState<MarketItem[]>(INITIAL_MARKETS);
  const [activeTab, setActiveTab] = useState<"markets" | "picks" | "news">("markets");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hoveredHeat, setHoveredHeat] = useState<number | null>(null);

  // Simulate live price updates
  useEffect(() => {
    const t = setInterval(() => {
      setMarkets(prev => prev.map(m => ({
        ...m,
        val: +(m.val * (1 + (Math.random() - 0.499) * 0.0008)).toFixed(m.val > 1000 ? 2 : m.val > 100 ? 2 : 2),
        chg: +(m.chg + (Math.random() - 0.499) * 0.04).toFixed(2),
      })));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const spx = markets[0];
  const ndx = markets[1];
  const nifty = markets[2];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');
        :root {
          --bg: #07090e; --bg2: #0c0f19; --bg3: #111520;
          --surface: #141927; --surface2: #1a2035;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --gold: #c9a84c; --gold2: #f0cc6e; --gold3: rgba(201,168,76,0.1);
          --green: #22d67a; --red: #f05454;
          --text: #e8eaf0; --dim: #9ca3af; --muted: #6b7280;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Mono', monospace; overflow-x: hidden; }

        body::after {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999; opacity: 0.5;
        }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .orb { position: fixed; border-radius: 50%; filter: blur(130px); pointer-events: none; animation: driftOrb 14s ease-in-out infinite alternate; }
        .orb1 { width: 700px; height: 700px; background: rgba(201,168,76,0.055); top: -250px; right: -150px; }
        .orb2 { width: 500px; height: 500px; background: rgba(34,214,122,0.035); bottom: -100px; left: -150px; animation-delay: -7s; }
        .orb3 { width: 300px; height: 300px; background: rgba(201,168,76,0.04); top: 50%; left: 40%; animation-delay: -3s; }
        @keyframes driftOrb { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,50px) scale(1.15); } }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 68px; padding: 0 48px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(7,9,14,0.75); backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 12px; }
        .logo-mark {
          width: 38px; height: 38px; border-radius: 9px;
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: #07090e;
        }
        .logo-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: -0.02em; }
        .logo-name span { color: var(--gold); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { color: var(--muted); text-decoration: none; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-right { display: flex; gap: 10px; align-items: center; }
        .btn-ghost { background: none; border: 1px solid var(--border2); color: var(--dim); padding: 8px 18px; border-radius: 7px; font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
        .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; color: #07090e; padding: 9px 22px; border-radius: 7px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.04em; cursor: pointer; transition: all 0.2s; }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(201,168,76,0.35); }

        /* TICKER */
        .ticker-bar { position: fixed; top: 68px; left: 0; right: 0; z-index: 199; height: 34px; background: var(--bg2); border-bottom: 1px solid var(--border); overflow: hidden; display: flex; align-items: center; }
        .ticker-track { display: flex; animation: tickScroll 32s linear infinite; white-space: nowrap; }
        .tick { display: flex; align-items: center; gap: 8px; padding: 0 28px; font-size: 11px; letter-spacing: 0.03em; border-right: 1px solid var(--border); }
        .tick-n { color: var(--muted); }
        .tick-v { color: var(--text); }
        .tick-c { font-weight: 500; }
        @keyframes tickScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* HERO */
        .hero { padding: 190px 48px 80px; max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.18); border-radius: 100px; padding: 5px 16px; font-size: 11px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
        .live-dot { width: 7px; height: 7px; background: var(--green); border-radius: 50%; animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }
        .hero h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(44px,5.5vw,72px); line-height: 1; letter-spacing: -0.035em; margin-bottom: 22px; }
        .hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--gold); }
        .hero-p { font-size: 14.5px; line-height: 1.75; color: var(--dim); margin-bottom: 40px; max-width: 460px; }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-hero-main { background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; color: #07090e; padding: 15px 34px; border-radius: 9px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.03em; cursor: pointer; box-shadow: 0 0 40px rgba(201,168,76,0.28); transition: all 0.25s; }
        .btn-hero-main:hover { transform: translateY(-2px); box-shadow: 0 10px 48px rgba(201,168,76,0.42); }
        .btn-hero-out { background: none; border: 1px solid rgba(255,255,255,0.1); color: var(--text); padding: 15px 34px; border-radius: 9px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 8px; }
        .btn-hero-out:hover { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.03); }
        .hero-trust { margin-top: 36px; display: flex; align-items: center; gap: 20px; }
        .trust-avatars { display: flex; }
        .avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg); background: linear-gradient(135deg, var(--gold3), var(--surface)); margin-left: -8px; first-child { margin-left: 0; } display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--gold); }
        .trust-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .trust-text strong { color: var(--text); }

        /* HERO WIDGET */
        .hero-widget {
          background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 26px;
          position: relative; overflow: hidden; animation: floatWidget 7s ease-in-out infinite;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .hero-widget::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        @keyframes floatWidget { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(0.3deg); } }
        .w-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .w-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; color: var(--dim); text-transform: uppercase; }
        .live-pill { background: rgba(34,214,122,0.1); border: 1px solid rgba(34,214,122,0.2); color: var(--green); font-size: 10px; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 5px; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
        .mcards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .mcard { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 13px 11px; cursor: default; transition: border-color 0.2s; }
        .mcard:hover { border-color: rgba(201,168,76,0.25); }
        .mc-name { font-size: 9px; color: var(--muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 7px; }
        .mc-val { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 3px; }
        .mc-chg { font-size: 11px; font-weight: 500; }
        .up { color: var(--green); }
        .dn { color: var(--red); }
        .ai-pick-box { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.14); border-radius: 11px; padding: 14px; display: flex; gap: 12px; margin-bottom: 18px; }
        .ai-icon { width: 34px; height: 34px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; color: #07090e; }
        .ai-label { font-size: 10px; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
        .ai-text { font-size: 12px; color: var(--dim); line-height: 1.5; }
        .ai-text strong { color: var(--text); }
        .w-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border); }
        .w-stat { text-align: center; }
        .w-stat-n { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--gold); }
        .w-stat-l { font-size: 10px; color: var(--muted); letter-spacing: 0.05em; margin-top: 2px; }

        /* STATS */
        .stats-strip { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg2); }
        .stats-inner { max-width: 1300px; margin: 0 auto; padding: 32px 48px; display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; }
        .stat-box { text-align: center; }
        .stat-n { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 800; color: var(--gold); letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px; }
        .stat-l { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

        /* TABS SECTION */
        .tabs-wrap { max-width: 1300px; margin: 0 auto; padding: 72px 48px; }
        .sec-label { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px; }
        .sec-label::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); }
        .sec-title { font-family: 'Syne', sans-serif; font-size: clamp(28px,3.2vw,46px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; margin-bottom: 36px; }
        .sec-title em { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--gold); }
        .tab-btns { display: flex; gap: 4px; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 5px; width: fit-content; margin-bottom: 36px; }
        .tab-btn { padding: 9px 26px; border-radius: 7px; border: none; background: none; color: var(--muted); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
        .tab-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 2px 12px rgba(0,0,0,0.4); }

        /* MARKETS TABLE */
        .mkt-table { width: 100%; border-collapse: collapse; }
        .mkt-table th { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; padding: 0 16px 12px; text-align: left; border-bottom: 1px solid var(--border); }
        .mkt-table th:last-child,.mkt-table td:last-child { text-align: right; }
        .mkt-row { border-bottom: 1px solid var(--border); transition: background 0.18s; cursor: pointer; }
        .mkt-row:hover { background: rgba(255,255,255,0.025); }
        .mkt-row td { padding: 14px 16px; font-size: 13px; }
        .sym-chip { display: inline-flex; align-items: center; gap: 8px; }
        .sym-ico { width: 30px; height: 30px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 9px; font-weight: 700; color: var(--gold); letter-spacing: 0.04em; }
        .sym-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; }
        .sym-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
        .chg-pill { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 5px; font-size: 11px; font-weight: 600; }
        .chg-up { background: rgba(34,214,122,0.1); color: var(--green); }
        .chg-dn { background: rgba(240,84,84,0.1); color: var(--red); }

        /* NEWS GRID */
        .news-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: auto auto; gap: 16px; }
        .ncard { background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 22px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
        .ncard:hover { border-color: rgba(201,168,76,0.22); transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.55); }
        .ncard.feat { grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: flex-end; min-height: 380px; }
        .ncard.feat::before { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(201,168,76,0.05) 0%, transparent 50%); }
        .ntag { display: inline-block; font-size: 10px; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 5px; text-transform: uppercase; margin-bottom: 14px; }
        .ntag-bull { background: rgba(34,214,122,0.1); border: 1px solid rgba(34,214,122,0.2); color: var(--green); }
        .ntag-bear { background: rgba(240,84,84,0.1); border: 1px solid rgba(240,84,84,0.2); color: var(--red); }
        .ntag-ai { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); color: var(--gold); }
        .ntag-neutral { background: rgba(156,163,175,0.1); border: 1px solid rgba(156,163,175,0.2); color: var(--dim); }
        .n-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; line-height: 1.35; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; }
        .ncard.feat .n-title { font-size: 21px; }
        .n-excerpt { font-size: 12px; color: var(--dim); line-height: 1.65; margin-bottom: 14px; }
        .n-meta { font-size: 11px; color: var(--muted); display: flex; gap: 12px; }
        .n-score { display: flex; align-items: center; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); }
        .score-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
        .score-track { flex: 1; height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
        .score-fill-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--green)); border-radius: 2px; }
        .score-n { font-size: 11px; color: var(--gold); }

        /* AI PICKS */
        .picks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .pick-card { background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 24px; cursor: pointer; transition: all 0.25s; }
        .pick-card:hover { border-color: rgba(201,168,76,0.22); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
        .pick-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .pick-sym { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
        .pick-name { font-size: 11px; color: var(--muted); margin-top: 2px; }
        .action-pill { padding: 5px 14px; border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; }
        .act-buy { background: rgba(34,214,122,0.12); border: 1px solid rgba(34,214,122,0.25); color: var(--green); }
        .act-sell { background: rgba(240,84,84,0.12); border: 1px solid rgba(240,84,84,0.25); color: var(--red); }
        .act-hold { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); color: var(--gold); }
        .pick-score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .pick-reason { font-size: 12px; color: var(--dim); line-height: 1.6; margin-bottom: 16px; }
        .pick-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pd-box { background: var(--bg3); border: 1px solid var(--border); border-radius: 7px; padding: 10px 12px; }
        .pd-l { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .pd-v { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }

        /* HEATMAP */
        .heatmap-section { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .heatmap-wrap { max-width: 1300px; margin: 0 auto; padding: 72px 48px; }
        .heat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 40px; }
        .heat-cell { border-radius: 10px; padding: 16px 12px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; border: 1px solid transparent; min-height: 90px; display: flex; flex-direction: column; justify-content: space-between; }
        .heat-cell:hover { transform: scale(1.04); border-color: rgba(255,255,255,0.15) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .heat-sym { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
        .heat-chg { font-size: 12px; font-weight: 600; }
        .heat-mc { font-size: 10px; opacity: 0.6; margin-top: 2px; }

        /* GAUGE SECTION */
        .gauge-section { max-width: 1300px; margin: 0 auto; padding: 72px 48px; display: grid; grid-template-columns: 1fr 2fr; gap: 64px; align-items: center; }
        .gauge-box { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 36px; text-align: center; position: relative; overflow: hidden; }
        .gauge-box::before { content: ''; position: absolute; top: -40px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%); pointer-events: none; }
        .gauge-label { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: var(--dim); text-transform: uppercase; margin-top: 12px; }
        .gauge-status { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 22px; color: var(--green); margin-top: 4px; }
        .sentiment-bars { display: flex; flex-direction: column; gap: 14px; }
        .s-bar-item { display: flex; align-items: center; gap: 16px; }
        .s-bar-name { font-size: 12px; color: var(--dim); width: 80px; flex-shrink: 0; }
        .s-bar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
        .s-bar-fill { height: 100%; border-radius: 3px; transition: width 1.2s ease; }
        .s-bar-pct { font-size: 12px; color: var(--text); width: 38px; text-align: right; }

        /* CTA */
        .cta-wrap { padding: 80px 48px; }
        .cta-card { max-width: 780px; margin: 0 auto; background: var(--surface); border: 1px solid rgba(201,168,76,0.18); border-radius: 24px; padding: 64px 56px; text-align: center; position: relative; overflow: hidden; }
        .cta-card::before { content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 400px; height: 400px; background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%); pointer-events: none; }
        .cta-card h2 { font-family: 'Syne', sans-serif; font-size: clamp(28px,3.5vw,44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 16px; }
        .cta-card h2 em { font-family: 'Instrument Serif', serif; font-style: italic; color: var(--gold); }
        .cta-card p { font-size: 14px; color: var(--dim); line-height: 1.75; margin-bottom: 36px; max-width: 500px; margin-left: auto; margin-right: auto; }
        .email-row { display: flex; gap: 10px; max-width: 460px; margin: 0 auto; }
        .email-in { flex: 1; background: var(--bg3); border: 1px solid var(--border2); color: var(--text); padding: 13px 18px; border-radius: 9px; font-family: 'DM Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .email-in:focus { border-color: rgba(201,168,76,0.4); }
        .email-in::placeholder { color: var(--muted); }
        .btn-submit { background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; color: #07090e; padding: 13px 26px; border-radius: 9px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.03em; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 24px rgba(201,168,76,0.28); }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 36px rgba(201,168,76,0.42); }
        .form-note { font-size: 11px; color: var(--muted); margin-top: 14px; }
        .success-msg { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--green); font-size: 14px; font-family: 'Syne', sans-serif; font-weight: 600; }

        /* FOOTER */
        footer { border-top: 1px solid var(--border); padding: 30px 48px; display: flex; align-items: center; justify-content: space-between; }
        .footer-links { display: flex; gap: 28px; list-style: none; }
        .footer-links a { font-size: 11px; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
        .footer-links a:hover { color: var(--gold); }
        footer p { font-size: 11px; color: var(--muted); }

        /* ANIM */
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.25s; } .d3 { animation-delay: 0.4s; } .d4 { animation-delay: 0.55s; }

        @media (max-width: 960px) {
          nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; padding: 150px 20px 60px; }
          .hero-widget { display: none; }
          .stats-inner { grid-template-columns: repeat(2,1fr); padding: 24px 20px; }
          .tabs-wrap,.heatmap-wrap,.gauge-section,.cta-wrap { padding: 48px 20px; }
          .news-grid { grid-template-columns: 1fr; }
          .ncard.feat { grid-row: auto; min-height: 200px; }
          .picks-grid { grid-template-columns: 1fr; }
          .heat-grid { grid-template-columns: repeat(3,1fr); }
          .gauge-section { grid-template-columns: 1fr; }
          .email-row { flex-direction: column; }
          footer { flex-direction: column; gap: 16px; padding: 20px; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="logo-mark">P</div>
          <div className="logo-name">Pulse <span>Markets</span></div>
        </div>
        <ul className="nav-links">
          <li><a href="#">Markets</a></li>
          <li><a href="#">AI Picks</a></li>
          <li><a href="#">Analysis</a></li>
          <li><a href="#">Watchlist</a></li>
          <li><a href="#">Portfolio</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn-ghost">Sign In</button>
          <button className="btn-gold">Get Pro ↗</button>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...markets, ...markets].map((m, i) => (
            <div className="tick" key={i}>
              <span className="tick-n">{m.symbol}</span>
              <span className="tick-v">{m.val > 1000 ? m.val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : m.val.toFixed(2)}</span>
              <span className={`tick-c ${m.chg >= 0 ? "up" : "dn"}`}>{m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div>
          <div className="hero-badge fade-up d1"><div className="live-dot" />AI-Powered Market Intelligence</div>
          <h1 className="fade-up d2">Markets move.<br /><em>Move first.</em></h1>
          <p className="hero-p fade-up d3">Real-time AI signals, curated stock picks, and institutional-grade intelligence — built for investors who refuse to be second.</p>
          <div className="hero-btns fade-up d4">
            <button className="btn-hero-main">Start Free Trial →</button>
            <button className="btn-hero-out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              See How It Works
            </button>
          </div>
          <div className="hero-trust fade-up" style={{ animationDelay: "0.65s" }}>
            <div className="trust-avatars">
              {["H","A","R","K","S"].map((l, i) => (
                <div className="avatar" key={i} style={{ marginLeft: i === 0 ? 0 : -8, background: `hsl(${i*60+20},40%,25%)` }}>{l}</div>
              ))}
            </div>
            <div className="trust-text"><strong>48,000+</strong> investors trust Pulse<br />for daily market intelligence</div>
          </div>
        </div>

        <div className="hero-widget">
          <div className="w-header">
            <span className="w-title">Live Dashboard</span>
            <span className="live-pill"><div className="live-dot" />Live</span>
          </div>
          <div className="mcards">
            {[spx, ndx, nifty].map((m, i) => (
              <div className="mcard" key={i}>
                <div className="mc-name">{m.name}</div>
                <div className={`mc-val ${m.chg >= 0 ? "up" : "dn"}`}>{m.val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`mc-chg ${m.chg >= 0 ? "up" : "dn"}`}>{m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%</div>
                <div style={{ marginTop: 10 }}><Spark up={m.chg >= 0} /></div>
              </div>
            ))}
          </div>
          <div className="ai-pick-box">
            <div className="ai-icon">⚡</div>
            <div>
              <div className="ai-label">AI Top Pick Today</div>
              <div className="ai-text"><strong>NVDA</strong> — AI chip supercycle intact. Earnings beat highly probable. Sentiment score: <strong style={{ color: "var(--green)" }}>94/100</strong></div>
            </div>
          </div>
          <div className="w-footer">
            <div className="w-stat"><div className="w-stat-n">91%</div><div className="w-stat-l">Accuracy</div></div>
            <div style={{ width: 1, height: 36, background: "var(--border)" }} />
            <div className="w-stat"><div className="w-stat-n">2.4M</div><div className="w-stat-l">Daily Signals</div></div>
            <div style={{ width: 1, height: 36, background: "var(--border)" }} />
            <div className="w-stat"><div className="w-stat-n">&lt;2s</div><div className="w-stat-l">Latency</div></div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-strip">
        <div className="stats-inner">
          {[{ n: 48000, s: "+", l: "Active Investors" }, { n: 2400000, s: "+", l: "Signals Per Day" }, { n: 91, s: "%", l: "AI Accuracy Rate" }, { n: 12, s: "ms", l: "Avg Alert Speed" }].map((s, i) => (
            <div className="stat-box" key={i}>
              <div className="stat-n"><Counter end={s.n} suffix={s.s} /></div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-wrap">
        <div className="sec-label">Intelligence Hub</div>
        <div className="sec-title">Everything you need to <em>trade smarter</em></div>
        <div className="tab-btns">
          {(["markets", "picks", "news"] as const).map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "markets" ? "📊 Markets" : t === "picks" ? "⚡ AI Picks" : "📰 News Feed"}
            </button>
          ))}
        </div>

        {activeTab === "markets" && (
          <table className="mkt-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Trend</th>
                <th>AI Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr className="mkt-row" key={i}>
                  <td>
                    <div className="sym-chip">
                      <div className="sym-ico">{m.symbol.slice(0, 3)}</div>
                      <div><div className="sym-name">{m.name}</div><div className="sym-sub">{m.symbol}</div></div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>
                    {m.val > 1000 ? m.val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : m.val.toFixed(2)}
                  </td>
                  <td>
                    <span className={`chg-pill ${m.chg >= 0 ? "chg-up" : "chg-dn"}`}>
                      {m.chg >= 0 ? "▲" : "▼"} {Math.abs(m.chg).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ width: 100 }}><Spark up={m.chg >= 0} width={80} height={28} /></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${60 + Math.round(Math.random() * 35)}%`, background: "linear-gradient(90deg, var(--gold), var(--green))", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--gold)", width: 30 }}>{60 + i * 4}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button style={{ background: "none", border: "1px solid var(--border2)", color: "var(--dim)", padding: "5px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "var(--gold)"; (e.target as HTMLElement).style.color = "var(--gold)"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "var(--border2)"; (e.target as HTMLElement).style.color = "var(--dim)"; }}>
                      + Watch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "picks" && (
          <div className="picks-grid">
            {PICKS.map((p, i) => (
              <div className="pick-card" key={i}>
                <div className="pick-top">
                  <div>
                    <div className="pick-sym">{p.symbol}</div>
                    <div className="pick-name">{p.name}</div>
                  </div>
                  <span className={`action-pill ${p.action === "BUY" ? "act-buy" : p.action === "SELL" ? "act-sell" : "act-hold"}`}>{p.action}</span>
                </div>
                <div className="pick-score-row">
                  <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Confidence</span>
                  <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.score}%`, background: "linear-gradient(90deg, var(--gold), var(--green))", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--gold)", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{p.score}</span>
                </div>
                <div className="pick-reason">{p.reason}</div>
                <div className="pick-details">
                  <div className="pd-box"><div className="pd-l">Entry</div><div className="pd-v up">{p.entry}</div></div>
                  <div className="pd-box"><div className="pd-l">Target</div><div className="pd-v" style={{ color: "var(--gold)" }}>{p.target}</div></div>
                  <div className="pd-box"><div className="pd-l">Risk</div><div className={`pd-v ${p.risk === "Low" ? "up" : p.risk === "High" ? "dn" : ""}`}>{p.risk}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "news" && (
          <div className="news-grid">
            {NEWS.map((n, i) => (
              <div className={`ncard ${i === 0 ? "feat" : ""}`} key={i}>
                <div>
                  <span className={`ntag ntag-${n.tagType}`}>{n.tag}</span>
                  <div className="n-title">{n.title}</div>
                  {n.excerpt && <div className="n-excerpt">{n.excerpt}</div>}
                  <div className="n-meta"><span>{n.source}</span><span>{n.time}</span></div>
                </div>
                <div className="n-score">
                  <span className="score-label">AI Score</span>
                  <div className="score-track"><div className="score-fill-bar" style={{ width: `${n.score}%` }} /></div>
                  <span className="score-n">{n.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HEATMAP */}
      <div className="heatmap-section">
        <div className="heatmap-wrap">
          <div className="sec-label">Market Pulse</div>
          <div className="sec-title">S&P 500 <em>Heatmap</em></div>
          <div className="heat-grid">
            {HEATMAP.map((h, i) => {
              const intensity = Math.min(Math.abs(h.chg) / 5, 1);
              const bg = h.chg >= 0
                ? `rgba(34,214,122,${0.08 + intensity * 0.25})`
                : `rgba(240,84,84,${0.08 + intensity * 0.25})`;
              const border = h.chg >= 0
                ? `rgba(34,214,122,${0.15 + intensity * 0.3})`
                : `rgba(240,84,84,${0.15 + intensity * 0.3})`;
              return (
                <div key={i} className="heat-cell"
                  style={{ background: bg, borderColor: hoveredHeat === i ? "rgba(255,255,255,0.2)" : border }}
                  onMouseEnter={() => setHoveredHeat(i)}
                  onMouseLeave={() => setHoveredHeat(null)}>
                  <div className="heat-sym" style={{ color: h.chg >= 0 ? "var(--green)" : "var(--red)" }}>{h.name}</div>
                  <div>
                    <div className={`heat-chg ${h.chg >= 0 ? "up" : "dn"}`}>{h.chg >= 0 ? "▲" : "▼"} {Math.abs(h.chg).toFixed(2)}%</div>
                    <div className="heat-mc">{h.mktCap}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SENTIMENT GAUGE */}
      <div className="gauge-section">
        <div className="gauge-box">
          <SentimentGauge score={73} />
          <div className="gauge-label">Market Sentiment</div>
          <div className="gauge-status">Moderately Bullish</div>
        </div>
        <div>
          <div className="sec-label">AI Sentiment Engine</div>
          <div className="sec-title">Know the <em>mood</em> of the market</div>
          <p style={{ fontSize: 14, color: "var(--dim)", lineHeight: 1.75, marginBottom: 32 }}>
            Our proprietary AI aggregates signals from news, options flow, social media, and institutional movements to give you a real-time pulse on market sentiment.
          </p>
          <div className="sentiment-bars">
            {[
              { name: "Tech", pct: 82, color: "var(--green)" },
              { name: "Energy", pct: 34, color: "var(--red)" },
              { name: "Finance", pct: 61, color: "var(--gold)" },
              { name: "Healthcare", pct: 55, color: "var(--green)" },
              { name: "Consumer", pct: 47, color: "#6b7280" },
            ].map((s, i) => (
              <div className="s-bar-item" key={i}>
                <span className="s-bar-name">{s.name}</span>
                <div className="s-bar-track">
                  <div className="s-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
                <span className="s-bar-pct">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-wrap">
        <div className="cta-card">
          <h2>Get <em>AI Intelligence</em><br />delivered daily</h2>
          <p>Join 48,000+ investors receiving AI-curated stock picks, market signals, and news analysis — completely free to start.</p>
          {submitted ? (
            <div className="success-msg">✅ You're in! Check your inbox.</div>
          ) : (
            <>
              <div className="email-row">
                <input className="email-in" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="btn-submit" onClick={() => email && setSubmitted(true)}>Get Free Access</button>
              </div>
              <div className="form-note">No credit card required · Unsubscribe anytime · 48K+ investors trust Pulse</div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Pulse Markets AI — Not financial advice.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Disclaimer</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </footer>
    </>
  );
}
