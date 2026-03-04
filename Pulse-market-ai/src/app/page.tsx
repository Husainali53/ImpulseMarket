import { useState, useEffect, useRef } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, CartesianGrid, PieChart, Pie 
} from "recharts";
import { motion } from "motion/react";
import { Play, Activity, Zap, Newspaper, Briefcase, LayoutDashboard, Search, ChevronRight, Globe, TrendingUp, TrendingDown, ShieldCheck, Clock } from "lucide-react";

// ── HELPERS ──────────────────────────────────────────────────────
const genArea = (base: number, count: number, volatility: number) => {
  let current = base;
  return Array.from({ length: count }, (_, i) => {
    current = current + (Math.random() - 0.48) * volatility;
    return { t: i, v: current };
  });
};

// ── DATA ─────────────────────────────────────────────────────────
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

// ── COMPONENTS ───────────────────────────────────────────────────

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#141927] border border-[rgba(201,168,76,0.3)] rounded-lg p-2 px-3.5 text-xs">
      <div className="text-[#6b7280] mb-1">{label}</div>
      <div className="text-[#c9a84c] font-['Syne'] font-bold">
        {typeof payload[0].value === "number" && payload[0].value > 10000
          ? payload[0].value.toLocaleString()
          : payload[0].value?.toLocaleString()}
      </div>
    </div>
  );
};

function MiniSpark({ data, up }: { data: { v: number }[]; up: boolean }) {
  const color = up ? "#22d67a" : "#f05454";
  const vals = data.map(d => d.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 80},${32 - ((v - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 80 32" preserveAspectRatio="none" className="w-full h-8 block">
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

function Gauge({ score }: { score: number }) {
  const a = -135 + (score / 100) * 270;
  const label = score >= 75 ? "Strongly Bullish" : score >= 55 ? "Moderately Bullish" : score >= 45 ? "Neutral" : score >= 30 ? "Bearish" : "Strongly Bearish";
  const lc = score >= 55 ? "#22d67a" : score >= 45 ? "#c9a84c" : "#f05454";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="w-[220px] h-[130px]">
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
        <text x="110" y="105" textAnchor="middle" fill="#e8eaf0" className="font-['Syne'] text-[26px] font-bold">{score}</text>
      </svg>
      <div className="font-['Instrument Serif'] italic text-lg mt-[-4px]" style={{ color: lc }}>{label}</div>
    </div>
  );
}

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

// ── MAIN APP ─────────────────────────────────────────────────────

export default function App() {
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="hbadge"><div className="ldot" />AI-Powered Market Intelligence</div>
          <h1>Markets move.<br /><em>Move first.</em></h1>
          <p className="hp">Real-time AI signals, curated stock picks, and institutional-grade intelligence — built for investors who refuse to be second.</p>
          <div className="hbtns">
            <button className="bh">Start Free Trial →</button>
            <button className="bo">
              <Play size={16} fill="currentColor" />
              See How It Works
            </button>
          </div>
          <div className="trust">
            <div className="avs">
              {["H","A","R","K","S"].map((l, i) => (
                <div className="av" key={i} style={{ marginLeft: i===0?0:-8, background:`hsl(${i*55+20},35%,22%)` }}>{l}</div>
              ))}
            </div>
            <div className="txt"><strong>48,000+</strong> investors trust Pulse<br />for daily market intelligence</div>
          </div>
        </motion.div>

        <motion.div className="hw" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
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
                <div className="mt-2"><MiniSpark data={SPX_DATA.slice(-20)} up={m.chg>=0} /></div>
              </div>
            ))}
          </div>
          <div className="apb">
            <div className="ai"><Zap size={15} /></div>
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
        </motion.div>
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

        <div className="cg2 mt-4">
          <div className="card">
            <div className="ch mb-4">
              <div><div className="ctn">Market Volume</div><div className="text-xs text-[#6b7280] mt-1">Daily traded volume (Billions)</div></div>
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
            <div className="ch mb-3">
              <div><div className="ctn">Portfolio Allocation</div><div className="text-xs text-[#6b7280] mt-1">By sector weight</div></div>
            </div>
            <div className="flex items-center gap-5">
              <PieChart width={130} height={130}>
                <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={38} outerRadius={60} dataKey="val" paddingAngle={3}
                  onMouseEnter={(_,i)=>setActivePie(i)} onMouseLeave={()=>setActivePie(null)}>
                  {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} opacity={activePie===null||activePie===i?1:0.4} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 flex flex-col gap-2">
                {PIE_DATA.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: d.color }} />
                    <span className="text-[#6b7280] flex-1">{d.name}</span>
                    <span className="text-[#e8eaf0] font-['Syne'] font-bold">{d.val}%</span>
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
              {t==="overview" && <><LayoutDashboard size={12} className="inline mr-2" /> Markets</>}
              {t==="picks" && <><Zap size={12} className="inline mr-2" /> AI Picks</>}
              {t==="news" && <><Newspaper size={12} className="inline mr-2" /> News</>}
              {t==="portfolio" && <><Briefcase size={12} className="inline mr-2" /> Portfolio</>}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="overflow-x-auto">
            <table className="tbl min-w-[800px]">
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
                    <td className="font-['Syne'] font-bold text-[15px]">
                      {m.val > 999 ? m.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) : m.val.toFixed(2)}
                    </td>
                    <td><span className={`cp ${m.chg>=0?"cpu":"cpd"}`}>{m.chg>=0?"▲":"▼"} {Math.abs(m.chg).toFixed(2)}%</span></td>
                    <td className="w-[90px]"><MiniSpark data={SPX_DATA.slice(-18)} up={m.chg>=0} /></td>
                    <td className="text-[#6b7280] text-xs">{m.vol}</td>
                    <td className="text-[#6b7280] text-xs">{m.mkt}</td>
                    <td>
                      <div className="sb2">
                        <div className="st2"><div className="sf2f" style={{width:`${m.ai}%`}} /></div>
                        <span className="text-xs text-[#c9a84c] w-7">{m.ai}</span>
                      </div>
                    </td>
                    <td><button className="wbtn">+ Watch</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "picks" && (
          <div className="pg">
            {PICKS.map((p, i) => (
              <div className="pc" key={i}>
                <div className="pt">
                  <div><div className="psym">{p.sym}</div><div className="pnm">{p.name}</div></div>
                  <span className={`ap ${p.act==="BUY"?"ab":p.act==="SELL"?"as":"ah"}`}>{p.act}</span>
                </div>
                <div className="psr">
                  <span className="text-[11px] text-[#6b7280] uppercase tracking-wider">AI Confidence</span>
                  <div className="flex-1 h-[5px] bg-white/7 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c9a84c] to-[#22d67a] rounded-full" style={{ width: `${p.score}%` }} />
                  </div>
                  <span className="text-xs text-[#c9a84c] font-['Syne'] font-bold">{p.score}</span>
                </div>
                <div className="prl">{p.reason}</div>
                <div className="pd2">
                  <div className="pdb"><div className="pdl">Entry</div><div className="pdv up">{p.entry}</div></div>
                  <div className="pdb"><div className="pdl">Target</div><div className="pdv text-[#c9a84c]">{p.target}</div></div>
                  <div className="pdb"><div className="pdl">Stop</div><div className="pdv dn">{p.stop}</div></div>
                  <div className="pdb col-span-full"><div className="pdl">Risk Level</div>
                    <div className={`pdv ${p.risk==="Low"?"up":p.risk==="High"?"dn":""} text-[13px]`}>{p.risk}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {tab === "portfolio" && (
          <div>
            <div className="port-stats mb-4">
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
                <div className="ch mb-3.5">
                  <div><div className="ctn">Portfolio Performance</div><div className="text-xs text-[#6b7280] mt-1">Total value over time</div></div>
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
                <div className="ch mb-3">
                  <div><div className="ctn">Sector Breakdown</div></div>
                </div>
                <div className="flex items-center gap-4">
                  <PieChart width={130} height={130}>
                    <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={36} outerRadius={58} dataKey="val" paddingAngle={3}>
                      {PIE_DATA.map((d,i)=><Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                  <div className="flex-1 flex flex-col gap-2">
                    {PIE_DATA.map((d,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-[7px] h-[7px] rounded-[2px] shrink-0" style={{ background: d.color }} />
                        <span className="text-[#6b7280] flex-1 text-[11px]">{d.name}</span>
                        <span className="text-[#e8eaf0] font-['Syne'] font-bold">{d.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[12px] text-[#6b7280] uppercase tracking-widest mb-2.5">Watchlist</div>
              <div className="wl">
                {WATCHLIST.map((w,i)=>(
                  <div className="wlc" key={i}>
                    <div className="flex justify-between items-start">
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
      <div className="sec pt-[68px]">
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
                <div className="flex justify-between items-center">
                  <div className="scv text-[#6b7280]">{s.val}% bullish</div>
                  <div className="scv font-semibold" style={{color}}>{isUp?"▲":"▼"} {Math.abs(s.chg).toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card mt-4">
          <div className="ch mb-4">
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
          <div className="mt-4 text-[12px] text-[#6b7280] tracking-widest uppercase">Overall Market Sentiment</div>
        </div>
        <div>
          <div className="slb">AI Sentiment Engine</div>
          <div className="st">Know the <em>mood</em><br />of the market</div>
          <p className="sp mb-8">Our AI aggregates signals from news, options flow, social media, and institutional data to deliver a real-time market sentiment score across every sector.</p>
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
