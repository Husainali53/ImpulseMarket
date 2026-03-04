"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid, LineChart, Line,
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────
function gen(base: number, pts: number, vol: number) {
  let v = base;
  return Array.from({ length: pts }, (_, i) => {
    v = +(v + (Math.random() - 0.47) * vol).toFixed(2);
    return { t: `${i+1}`, v, d: new Date(2024,0,i+1).toLocaleDateString("en-US",{month:"short",day:"numeric"}) };
  });
}
const SPX  = gen(4500,60,20);
const BTC  = gen(42000,60,1100);
const ETH  = gen(2200,60,60);
const GOLD = gen(1980,60,12);
const NDX  = gen(14800,60,60);

const ASSETS = [
  {sym:"BTC", name:"Bitcoin",       cat:"crypto",       val:67320,   chg:3.20,  vol:"28.4B", mkt:"1.32T", ai:88},
  {sym:"ETH", name:"Ethereum",      cat:"crypto",       val:3842,    chg:2.15,  vol:"14.2B", mkt:"461B",  ai:82},
  {sym:"NVDA",name:"NVIDIA",        cat:"stocks",       val:621.90,  chg:4.33,  vol:"420M",  mkt:"1.54T", ai:94},
  {sym:"AAPL",name:"Apple Inc",     cat:"stocks",       val:186.42,  chg:2.10,  vol:"280M",  mkt:"2.89T", ai:81},
  {sym:"MSFT",name:"Microsoft",     cat:"stocks",       val:415.32,  chg:1.85,  vol:"160M",  mkt:"3.09T", ai:90},
  {sym:"TSLA",name:"Tesla",         cat:"stocks",       val:241.08,  chg:-1.45, vol:"510M",  mkt:"766B",  ai:61},
  {sym:"EUR", name:"EUR/USD",       cat:"forex",        val:1.0842,  chg:0.12,  vol:"6.8T",  mkt:"—",     ai:72},
  {sym:"GBP", name:"GBP/USD",       cat:"forex",        val:1.2710,  chg:-0.08, vol:"3.2T",  mkt:"—",     ai:65},
  {sym:"XAU", name:"Gold",          cat:"commodities",  val:2034,    chg:-0.12, vol:"142B",  mkt:"—",     ai:70},
  {sym:"OIL", name:"Crude Oil WTI", cat:"commodities",  val:78.42,   chg:-0.88, vol:"48B",   mkt:"—",     ai:58},
  {sym:"SOL", name:"Solana",        cat:"crypto",       val:142.30,  chg:5.44,  vol:"4.8B",  mkt:"62B",   ai:86},
  {sym:"SPX", name:"S&P 500",       cat:"stocks",       val:4783.45, chg:1.20,  vol:"3.2B",  mkt:"42T",   ai:85},
];
const NEWS = [
  {cat:"Markets",     tag:"Bullish",  title:"Fed signals rate cuts — markets surge to record highs across global tech sector",              src:"Bloomberg", time:"2m ago",  score:91, hot:true},
  {cat:"Crypto",      tag:"Alert",    title:"Bitcoin breaks $68K resistance — institutional inflows hit strongest 3-month peak",            src:"CoinDesk",  time:"8m ago",  score:88, hot:true},
  {cat:"Markets",     tag:"Analysis", title:"NVDA earnings beat: AI infrastructure demand drives 40% revenue surge quarter on quarter",     src:"Reuters",   time:"15m ago", score:94, hot:false},
  {cat:"Forex",       tag:"Risk",     title:"Dollar weakens ahead of FOMC minutes — EM currencies rally sharply across all major pairs",    src:"FX Street", time:"22m ago", score:72, hot:false},
  {cat:"Commodities", tag:"Watch",    title:"Gold holds $2,030 support amid geopolitical tensions and persistent dollar weakness signals",   src:"Kitco",     time:"31m ago", score:68, hot:false},
  {cat:"Crypto",      tag:"Bullish",  title:"Ethereum ETF approval odds rise to 78% — derivatives markets pricing in significant rally",    src:"The Block", time:"44m ago", score:85, hot:false},
  {cat:"Markets",     tag:"Bearish",  title:"China PMI contracts for second month running — global supply chain risk elevated significantly",src:"FT",        time:"1h ago",  score:74, hot:false},
];
const AI_PICKS = [
  {sym:"NVDA",name:"NVIDIA Corp",    act:"STRONG BUY",score:94,entry:"$610",target:"$740",stop:"$570",risk:"Low",   reason:"AI chip supercycle intact. Data center demand structurally elevated. Earnings beat highly probable.",sector:"Technology",tf:"2–4 wks"},
  {sym:"META",name:"Meta Platforms", act:"BUY",       score:87,entry:"$480",target:"$565",stop:"$452",risk:"Medium",reason:"Ad revenue recovery accelerating. AI monetization ramp beginning to show in core metrics.",sector:"Technology",tf:"3–6 wks"},
  {sym:"MSFT",name:"Microsoft",      act:"BUY",       score:90,entry:"$410",target:"$490",stop:"$388",risk:"Low",   reason:"Copilot enterprise ARR growing 60% QoQ. Azure AI workloads compounding at 40%+ rate.",sector:"Technology",tf:"4–8 wks"},
  {sym:"SOL", name:"Solana",         act:"BUY",       score:86,entry:"$138",target:"$175",stop:"$122",risk:"Medium",reason:"DeFi TVL at all-time highs. Developer activity outpacing all L1 blockchains decisively.",sector:"Crypto",tf:"1–3 wks"},
  {sym:"XOM", name:"Exxon Mobil",    act:"SELL",      score:38,entry:"$102",target:"$88", stop:"$108",risk:"Medium",reason:"China demand weakness and PMI contraction signal energy sector headwinds through Q2.",sector:"Energy",tf:"2–4 wks"},
  {sym:"TSLA",name:"Tesla Inc",      act:"HOLD",      score:61,entry:"$241",target:"$268",stop:"$215",risk:"High",  reason:"Margin pressure from price wars ongoing. Q2 delivery data critical. Await further clarity.",sector:"Automotive",tf:"6–8 wks"},
];
const HEATMAP = [
  {sym:"NVDA",chg:4.33},{sym:"META",chg:3.21},{sym:"SOL",chg:5.44},
  {sym:"AAPL",chg:2.10},{sym:"MSFT",chg:1.85},{sym:"GOOGL",chg:0.92},
  {sym:"AMZN",chg:-0.44},{sym:"TSLA",chg:-1.45},{sym:"JPM",chg:-0.88},
  {sym:"XOM",chg:-2.10},{sym:"BTC",chg:3.20},{sym:"ETH",chg:2.15},
];
const SECTORS = [
  {name:"Technology",score:88,chg:3.1, color:"#64b5f6"},
  {name:"Crypto",    score:82,chg:2.8, color:"#b0c4de"},
  {name:"Healthcare",score:61,chg:0.4, color:"#4db6ac"},
  {name:"Finance",   score:65,chg:1.2, color:"#7986cb"},
  {name:"Energy",    score:34,chg:-2.2,color:"#ef9a9a"},
  {name:"Consumer",  score:52,chg:-0.3,color:"#ffe082"},
];
const VOL_DATA = Array.from({length:14},(_,i)=>({d:`Mar ${i+1}`,v:+(2.5+Math.random()*5.5).toFixed(1),up:Math.random()>0.4}));
const CHART_DATA:{[k:string]:any[]} = {BTC,ETH,SPX,GOLD,NDX};
const CHART_INFO:{[k:string]:{label:string;color:string}} = {
  BTC:{label:"Bitcoin",  color:"#e8ecf0"},
  ETH:{label:"Ethereum", color:"#b0c4de"},
  SPX:{label:"S&P 500",  color:"#90caf9"},
  GOLD:{label:"Gold",    color:"#ffe082"},
  NDX:{label:"NASDAQ",   color:"#a5d6a7"},
};

// ── PARTICLES ────────────────────────────────────────────────────
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const pts = Array.from({length:60}, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.5+.5, o:Math.random()*.25+.05
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>c.width)p.vx*=-1;
        if(p.y<0||p.y>c.height)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(176,196,222,${p.o})`; ctx.fill();
        pts.forEach((p2,j)=>{if(i===j)return;const dx=p.x-p2.x,dy=p.y-p2.y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.strokeStyle=`rgba(144,174,202,${.08*(1-d/130)})`;ctx.lineWidth=.5;ctx.stroke();}});
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    const rs=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    window.addEventListener("resize",rs);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}/>;
}

// ── WAVE ─────────────────────────────────────────────────────────
function Wave() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const rs=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;};
    rs(); window.addEventListener("resize",rs);
    let t=0,raf:number;
    const waves=[
      {color:"rgba(144,174,202,0.18)",freq:.018,amp:22,spd:.016,off:0},
      {color:"rgba(176,196,222,0.12)",freq:.024,amp:16,spd:.012,off:2},
      {color:"rgba(120,150,180,0.10)",freq:.013,amp:28,spd:.02, off:4},
    ];
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      waves.forEach(w=>{
        ctx.beginPath();
        for(let x=0;x<=c.width;x+=2){const y=c.height/2+Math.sin(x*w.freq+t*w.spd*60+w.off)*w.amp+Math.sin(x*w.freq*1.5+t*w.spd*40)*w.amp*.4;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.lineTo(c.width,c.height);ctx.lineTo(0,c.height);ctx.closePath();
        const g=ctx.createLinearGradient(0,0,0,c.height);g.addColorStop(0,w.color);g.addColorStop(1,"transparent");
        ctx.fillStyle=g;ctx.fill();
      });
      t++;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

// ── TOOLTIP ───────────────────────────────────────────────────────
const CTip=({active,payload}:any)=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:"rgba(10,15,30,0.97)",border:"1px solid rgba(176,196,222,0.25)",borderRadius:10,padding:"8px 14px",fontSize:12,backdropFilter:"blur(16px)"}}><div style={{color:"rgba(176,196,222,0.55)",marginBottom:3}}>{payload[0]?.payload?.d}</div><div style={{color:"#e8ecf0",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>{typeof payload[0].value==="number"&&payload[0].value>1000?payload[0].value.toLocaleString():payload[0].value}</div></div>;
};

// ── SPARK ────────────────────────────────────────────────────────
function Spark({data,up}:{data:{v:number}[];up:boolean}){
  const c=up?"#90caf9":"#ef9a9a",vals=data.map(d=>d.v),mn=Math.min(...vals),mx=Math.max(...vals);
  const pts=vals.map((v,i)=>`${(i/(vals.length-1))*80},${28-((v-mn)/(mx-mn||1))*24}`).join(" ");
  return <svg viewBox="0 0 80 28" preserveAspectRatio="none" style={{width:"100%",height:28,display:"block"}}><defs><linearGradient id={`sp${up}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={.25}/><stop offset="100%" stopColor={c} stopOpacity={0}/></linearGradient></defs><polygon points={`0,28 ${pts} 80,28`} fill={`url(#sp${up})`}/><polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}

// ── COUNTER ──────────────────────────────────────────────────────
function Counter({end,suffix=""}:{end:number;suffix?:string}){
  const [v,setV]=useState(0);const ref=useRef<HTMLSpanElement>(null);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const step=end/55;const t=setInterval(()=>{s+=step;if(s>=end){setV(end);clearInterval(t);}else setV(Math.floor(s));},16);}});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[end]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

// ── GAUGE ─────────────────────────────────────────────────────────
function Gauge({score}:{score:number}){
  const a=-135+(score/100)*270;
  const lbl=score>=75?"Strongly Bullish":score>=55?"Moderately Bullish":score>=45?"Neutral":"Bearish";
  const lc=score>=55?"#90caf9":score>=45?"#e8ecf0":"#ef9a9a";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><svg viewBox="0 0 220 130" style={{width:220,height:130}}><defs><linearGradient id="ggnv" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef9a9a"/><stop offset="50%" stopColor="#b0c4de"/><stop offset="100%" stopColor="#90caf9"/></linearGradient></defs><path d="M 25 118 A 85 85 0 0 1 195 118" fill="none" stroke="rgba(176,196,222,0.1)" strokeWidth="14" strokeLinecap="round"/><path d="M 25 118 A 85 85 0 0 1 195 118" fill="none" stroke="url(#ggnv)" strokeWidth="14" strokeLinecap="round" strokeDasharray="267" strokeDashoffset={267-(score/100)*267} style={{transition:"stroke-dashoffset 1.8s ease"}}/><g transform={`rotate(${a},110,118)`}><line x1="110" y1="118" x2="110" y2="44" stroke="#e8ecf0" strokeWidth="2.5" strokeLinecap="round"/><circle cx="110" cy="118" r="5" fill="#e8ecf0"/></g><text x="110" y="103" textAnchor="middle" fill="#e8ecf0" style={{fontFamily:"'Poppins',sans-serif",fontSize:26,fontWeight:700}}>{score}</text></svg><div style={{fontFamily:"'Poppins',sans-serif",fontStyle:"italic",fontSize:16,color:lc,marginTop:-4,fontWeight:600}}>{lbl}</div></div>;
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function Home(){
  const [assets,setAssets]=useState(ASSETS);
  const [tab,setTab]=useState<"all"|"stocks"|"crypto"|"forex"|"commodities">("all");
  const [nf,setNf]=useState<"All"|"Markets"|"Crypto"|"Forex"|"Commodities">("All");
  const [cs,setCs]=useState<"BTC"|"ETH"|"SPX"|"GOLD"|"NDX">("SPX");
  const [email,setEmail]=useState("");const [done,setDone]=useState(false);
  const [alerts,setAlerts]=useState([
    {id:1,sym:"NVDA",msg:"AI Score hit 94 — Strong Buy signal triggered",type:"bull",time:"just now",read:false},
    {id:2,sym:"BTC", msg:"Broke $67K resistance — momentum building",    type:"bull",time:"3m ago", read:false},
    {id:3,sym:"XOM", msg:"Bearish divergence on daily chart detected",   type:"bear",time:"12m ago",read:true},
  ]);
  const [showA,setShowA]=useState(false);
  const [ap,setAp]=useState<number|null>(null);

  useEffect(()=>{const t=setInterval(()=>{setAssets(p=>p.map(a=>({...a,val:+(a.val*(1+(Math.random()-.499)*.0009)).toFixed(2),chg:+(a.chg+(Math.random()-.499)*.06).toFixed(2)})));},2400);return()=>clearInterval(t);},[]);

  const unread=alerts.filter(a=>!a.read).length;
  const filtered=tab==="all"?assets:assets.filter(a=>a.cat===tab);
  const fNews=nf==="All"?NEWS:NEWS.filter(n=>n.cat===nf);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

        /* ── PLATINUM & NAVY THEME ── */
        :root {
          --bg:     #080d1a;
          --bg2:    #0c1424;
          --bg3:    #101c30;
          --sf:     #14213a;
          --sf2:    #192844;
          --bd:     rgba(176,196,222,0.12);
          --bd2:    rgba(176,196,222,0.2);
          --bd3:    rgba(176,196,222,0.06);

          /* Platinum / Silver */
          --plat:   #e8ecf0;
          --plat2:  #c8d4e0;
          --plat3:  #98aec4;
          --steel:  #b0c4de;
          --steel2: #8aa4c0;

          /* Navy accent */
          --navy:   #1a3a6e;
          --navy2:  #1e4080;
          --navy3:  #2455a0;

          /* Sky blue highlight */
          --sky:    #90caf9;
          --sky2:   #64b5f6;

          /* Status */
          --green:  #4caf7d;
          --green2: #81c784;
          --red:    #e57373;
          --red2:   #ef9a9a;
          --gold:   #ffe082;

          --tx:     #eef2f7;
          --tx2:    #8aa4c0;
          --tx3:    #4a6080;

          --glow-s: 0 0 40px rgba(144,202,249,0.12);
          --glow-p: 0 0 60px rgba(176,196,222,0.08);
        }

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;overflow-x:hidden;min-height:100vh;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--bg2);}::-webkit-scrollbar-thumb{background:var(--navy3);border-radius:3px;}

        .up{color:var(--green2)!important;} .dn{color:var(--red2)!important;}

        /* ── NAVBAR ── */
        nav{position:fixed;top:0;left:0;right:0;z-index:500;height:68px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(8,13,26,0.88);backdrop-filter:blur(28px);border-bottom:1px solid var(--bd);}
        .nlogo{display:flex;align-items:center;gap:12px;}
        .lic{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--navy2),var(--navy3));display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:18px;font-weight:900;color:var(--plat);border:1px solid var(--bd2);box-shadow:var(--glow-s);}
        .ltx{font-family:'Montserrat',sans-serif;font-weight:800;font-size:16px;letter-spacing:-.01em;color:var(--plat);}
        .ltx span{color:var(--sky);}
        .nls{display:flex;gap:32px;list-style:none;}
        .nls a{color:var(--tx2);text-decoration:none;font-size:13px;font-weight:500;transition:color .2s;letter-spacing:.01em;}
        .nls a:hover{color:var(--plat);}
        .nr{display:flex;gap:10px;align-items:center;}
        .bell{position:relative;background:var(--sf);border:1px solid var(--bd);width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:16px;}
        .bell:hover{border-color:var(--bd2);background:var(--sf2);}
        .bbadge{position:absolute;top:-4px;right:-4px;background:var(--red);color:#fff;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg);}
        .bgh{background:transparent;border:1px solid var(--bd2);color:var(--tx2);padding:8px 18px;border-radius:8px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;letter-spacing:.02em;}
        .bgh:hover{border-color:var(--plat2);color:var(--plat);}
        .bprim{background:linear-gradient(135deg,var(--navy2),var(--navy3));border:1px solid var(--navy3);color:var(--plat);padding:9px 22px;border-radius:8px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .25s;letter-spacing:.03em;box-shadow:0 4px 20px rgba(26,58,110,.5);}
        .bprim:hover{transform:translateY(-1px);box-shadow:0 8px 32px rgba(26,58,110,.7);background:linear-gradient(135deg,var(--navy3),#2a5ab0);}

        /* ── ALERTS ── */
        .adrop{position:absolute;top:48px;right:0;width:340px;background:rgba(12,20,36,0.98);border:1px solid var(--bd2);border-radius:14px;backdrop-filter:blur(28px);z-index:600;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.8);animation:fdwn .2s ease;}
        @keyframes fdwn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        .ahdr{padding:14px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
        .aitem{padding:13px 18px;border-bottom:1px solid var(--bd3);display:flex;gap:10px;align-items:flex-start;cursor:pointer;transition:background .2s;}
        .aitem:hover{background:rgba(176,196,222,0.04);}
        .aico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
        .abull{background:rgba(76,175,125,.15);}.abear{background:rgba(229,115,115,.15);}
        .udot{width:6px;height:6px;border-radius:50%;background:var(--sky);flex-shrink:0;margin-top:5px;}

        /* ── TICKER ── */
        .tkb{position:fixed;top:68px;left:0;right:0;z-index:499;height:36px;background:rgba(12,20,36,.92);border-bottom:1px solid var(--bd);overflow:hidden;display:flex;align-items:center;backdrop-filter:blur(12px);}
        .tkt{display:flex;animation:tr 32s linear infinite;white-space:nowrap;}
        .ti{display:flex;align-items:center;gap:9px;padding:0 26px;font-size:11px;border-right:1px solid var(--bd3);font-family:'DM Mono',monospace;}
        .tsym{color:var(--tx3);font-weight:500;letter-spacing:.04em;}.tval{color:var(--plat2);}
        @keyframes tr{from{transform:translateX(0);}to{transform:translateX(-50%);}}

        /* ── HERO ── */
        .hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:130px 48px 80px;}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 35%,rgba(26,58,110,.22) 0%,transparent 70%),radial-gradient(ellipse 40% 35% at 85% 65%,rgba(144,202,249,.07) 0%,transparent 60%);pointer-events:none;}
        .hcon{max-width:1300px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;z-index:2;}
        .hbadge{display:inline-flex;align-items:center;gap:8px;background:rgba(26,58,110,.25);border:1px solid rgba(144,202,249,.2);border-radius:100px;padding:6px 16px;font-size:11px;color:var(--sky);letter-spacing:.1em;text-transform:uppercase;margin-bottom:24px;}
        .ldot{width:7px;height:7px;background:var(--green2);border-radius:50%;animation:lp 2s ease-in-out infinite;box-shadow:0 0 6px var(--green2);}
        @keyframes lp{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.7);}}
        h1{font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(40px,5.2vw,68px);line-height:1.02;letter-spacing:-.035em;margin-bottom:22px;color:var(--plat);}
        .grad{background:linear-gradient(135deg,var(--plat),var(--sky),var(--steel));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hsub{font-size:15px;line-height:1.8;color:var(--tx2);margin-bottom:40px;max-width:480px;font-weight:400;}
        .hbtns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:44px;}
        .bh1{background:linear-gradient(135deg,var(--navy2),var(--navy3));border:1px solid rgba(144,202,249,.2);color:var(--plat);padding:15px 36px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 4px 32px rgba(26,58,110,.6);transition:all .3s;letter-spacing:.02em;}
        .bh1:hover{transform:translateY(-3px);box-shadow:0 12px 48px rgba(26,58,110,.8);}
        .bh2{background:transparent;border:1px solid var(--bd2);color:var(--plat2);padding:15px 36px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .3s;}
        .bh2:hover{border-color:var(--sky);color:var(--sky);background:rgba(144,202,249,.05);}
        .htrust{display:flex;align-items:center;gap:16px;}
        .tavs{display:flex;}.tav{width:30px;height:30px;border-radius:50%;border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:var(--sf2);color:var(--plat2);}
        .trtx{font-size:12px;color:var(--tx2);line-height:1.55;}.trtx strong{color:var(--plat);}

        /* ── HERO CARD ── */
        .hcard{background:rgba(20,33,58,.6);backdrop-filter:blur(28px);border:1px solid var(--bd2);border-radius:20px;padding:26px;position:relative;overflow:hidden;animation:flt 8s ease-in-out infinite;box-shadow:0 40px 80px rgba(0,0,0,.6),var(--glow-s);}
        .hcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--steel),var(--sky),transparent);}
        @keyframes flt{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        .hcth{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .hctit{font-size:12px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.08em;}
        .lchip{background:rgba(76,175,125,.12);border:1px solid rgba(76,175,125,.25);color:var(--green2);font-size:10px;padding:3px 10px;border-radius:5px;display:flex;align-items:center;gap:5px;letter-spacing:.05em;}
        .mg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;}
        .mc{background:rgba(255,255,255,.04);border:1px solid var(--bd3);border-radius:10px;padding:12px 10px;}
        .mcn{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
        .mcv{font-family:'DM Mono',monospace;font-size:15px;margin-bottom:2px;}
        .mcc{font-size:11px;font-weight:600;}
        .aisb{background:rgba(26,58,110,.2);border:1px solid rgba(144,202,249,.15);border-radius:12px;padding:14px;display:flex;gap:12px;margin-bottom:16px;}
        .aisi{width:36px;height:36px;background:linear-gradient(135deg,var(--navy2),var(--navy3));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;border:1px solid rgba(144,202,249,.2);}
        .aisl{font-size:10px;color:var(--sky);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;}
        .aist{font-size:12px;color:var(--tx2);line-height:1.5;}.aist strong{color:var(--plat);}
        .hcf{display:flex;justify-content:space-between;padding-top:14px;border-top:1px solid var(--bd3);}
        .hs .hsn{font-family:'Montserrat',sans-serif;font-size:18px;font-weight:800;color:var(--sky);}
        .hs .hsl{font-size:10px;color:var(--tx3);margin-top:2px;letter-spacing:.04em;}

        /* ── STATS STRIP ── */
        .ststrip{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--bg2);padding:28px 48px;}
        .stinner{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
        .stbox{text-align:center;}
        .stnum{font-family:'Montserrat',sans-serif;font-size:36px;font-weight:900;color:var(--plat);line-height:1;margin-bottom:6px;letter-spacing:-.02em;}
        .stlbl{font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;}

        /* ── SECTIONS ── */
        .sec{max-width:1300px;margin:0 auto;padding:76px 48px;}
        .sbadge{display:inline-flex;align-items:center;gap:8px;font-size:11px;color:var(--sky);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;}
        .sbadge::before{content:'';display:block;width:22px;height:1px;background:var(--sky);}
        .stit{font-family:'Montserrat',sans-serif;font-size:clamp(26px,3vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.08;margin-bottom:12px;color:var(--plat);}
        .ssub{font-size:14px;color:var(--tx2);line-height:1.75;max-width:540px;}

        /* ── CHART CARD ── */
        .cmain{background:var(--sf);border:1px solid var(--bd);border-radius:18px;padding:24px;position:relative;overflow:hidden;}
        .cmain::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--steel),var(--sky),transparent);}
        .ctabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
        .ctab{padding:7px 18px;border-radius:8px;border:1px solid var(--bd);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
        .ctab.on{background:linear-gradient(135deg,var(--navy2),var(--navy3));color:var(--plat);border-color:rgba(144,202,249,.2);box-shadow:0 4px 16px rgba(26,58,110,.5);}
        .ctab:not(.on):hover{border-color:var(--sky);color:var(--sky);}

        /* ── ASSET TABLE ── */
        .atabs{display:flex;gap:6px;margin-bottom:22px;flex-wrap:wrap;}
        .atab{padding:7px 18px;border-radius:8px;border:1px solid var(--bd);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
        .atab.on{background:rgba(26,58,110,.3);border-color:rgba(144,202,249,.25);color:var(--sky);}
        .atab:not(.on):hover{border-color:var(--bd2);color:var(--plat2);}
        .atbl{width:100%;border-collapse:collapse;}
        .atbl th{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;padding:0 16px 14px;text-align:left;border-bottom:1px solid var(--bd);}
        .atbl td{padding:13px 16px;font-size:13px;border-bottom:1px solid var(--bd3);}
        .atbl tr{transition:background .18s;cursor:pointer;}.atbl tr:hover{background:rgba(176,196,222,.03);}
        .sbdg{width:32px;height:32px;border-radius:8px;background:rgba(26,58,110,.3);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--sky);}
        .chgp{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;}
        .chu{background:rgba(76,175,125,.1);}.chd{background:rgba(229,115,115,.1);}
        .aibar{display:flex;align-items:center;gap:8px;}.ait{flex:1;height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;}
        .aif{height:100%;background:linear-gradient(90deg,var(--navy3),var(--sky));border-radius:2px;}
        .wbtn{background:none;border:1px solid var(--bd);color:var(--tx3);padding:5px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;transition:all .2s;}
        .wbtn:hover{border-color:var(--sky);color:var(--sky);}

        /* ── NEWS ── */
        .nfilts{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
        .nflt{padding:7px 18px;border-radius:8px;border:1px solid var(--bd);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;cursor:pointer;transition:all .2s;}
        .nflt.on{background:rgba(26,58,110,.25);border-color:rgba(144,202,249,.25);color:var(--sky);}
        .nflt:not(.on):hover{border-color:var(--sky);color:var(--sky);}
        .ngrid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:auto auto;gap:14px;}
        .nc{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:20px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
        .nc:hover{border-color:var(--bd2);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.5),var(--glow-s);}
        .nc.ft{grid-row:1/3;display:flex;flex-direction:column;justify-content:flex-end;min-height:380px;background:linear-gradient(180deg,rgba(26,58,110,.12) 0%,rgba(8,13,26,.97) 100%);}
        .nc.ft::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--steel),transparent);}
        .hotb{display:inline-flex;align-items:center;gap:5px;background:rgba(229,115,115,.1);border:1px solid rgba(229,115,115,.2);color:var(--red2);font-size:10px;padding:3px 9px;border-radius:5px;margin-bottom:10px;}
        .ntag{display:inline-block;font-size:10px;letter-spacing:.07em;padding:3px 10px;border-radius:5px;text-transform:uppercase;margin-bottom:11px;}
        .tbull{background:rgba(76,175,125,.1);border:1px solid rgba(76,175,125,.22);color:var(--green2);}
        .tbear{background:rgba(229,115,115,.1);border:1px solid rgba(229,115,115,.22);color:var(--red2);}
        .tai{background:rgba(144,202,249,.08);border:1px solid rgba(144,202,249,.2);color:var(--sky);}
        .tne{background:rgba(176,196,222,.06);border:1px solid var(--bd);color:var(--plat2);}
        .twarn{background:rgba(255,224,130,.08);border:1px solid rgba(255,224,130,.2);color:var(--gold);}
        .ntit{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;line-height:1.4;color:var(--plat);margin-bottom:10px;}
        .nc.ft .ntit{font-size:19px;}
        .nexc{font-size:12px;color:var(--tx2);line-height:1.65;margin-bottom:12px;}
        .nmeta{font-size:11px;color:var(--tx3);display:flex;gap:12px;}
        .nscore{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--bd3);}
        .nsl{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
        .nst{flex:1;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;}
        .nsf{height:100%;background:linear-gradient(90deg,var(--navy3),var(--sky));border-radius:2px;}
        .nsn{font-size:11px;color:var(--sky);font-weight:600;}

        /* ── AI PICKS ── */
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px;}
        .pcard{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:22px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
        .pcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--navy3),var(--sky));opacity:0;transition:opacity .25s;}
        .pcard:hover,.pcard.act{border-color:var(--bd2);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.5),var(--glow-s);}
        .pcard:hover::after,.pcard.act::after{opacity:1;}
        .ptop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
        .psym{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:900;color:var(--plat);}
        .pnm{font-size:11px;color:var(--tx3);margin-top:2px;}
        .apill{padding:5px 13px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.05em;font-family:'Poppins',sans-serif;}
        .asbuy{background:rgba(144,202,249,.1);border:1px solid rgba(144,202,249,.25);color:var(--sky);}
        .abuy{background:rgba(76,175,125,.1);border:1px solid rgba(76,175,125,.25);color:var(--green2);}
        .asell{background:rgba(229,115,115,.1);border:1px solid rgba(229,115,115,.22);color:var(--red2);}
        .ahold{background:rgba(176,196,222,.07);border:1px solid var(--bd2);color:var(--plat2);}
        .crow{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
        .cbar{flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;}
        .cfill{height:100%;background:linear-gradient(90deg,var(--navy3),var(--sky));border-radius:3px;}
        .preason{font-size:12px;color:var(--tx2);line-height:1.6;margin-bottom:14px;}
        .pdg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        .pdb{background:rgba(255,255,255,.03);border:1px solid var(--bd3);border-radius:8px;padding:9px 11px;}
        .pdl{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
        .pdv{font-family:'DM Mono',monospace;font-size:14px;}

        /* ── HEATMAP ── */
        .hmbg{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--bg2);padding:76px 48px;}
        .hmw{max-width:1300px;margin:0 auto;}
        .hmg{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:36px;}
        .hmc{border-radius:11px;padding:16px 12px;cursor:pointer;transition:all .22s;border:1px solid transparent;min-height:86px;display:flex;flex-direction:column;justify-content:space-between;}
        .hmc:hover{transform:scale(1.05);box-shadow:0 8px 32px rgba(0,0,0,.5);border-color:rgba(176,196,222,.2)!important;}
        .hmsym{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:800;}
        .hmch{font-size:12px;font-weight:600;margin-top:2px;}

        /* ── GAUGE ── */
        .gsec{max-width:1300px;margin:0 auto;padding:76px 48px;display:grid;grid-template-columns:auto 1fr;gap:64px;align-items:center;}
        .gcard{background:var(--sf);border:1px solid var(--bd2);border-radius:20px;padding:38px 44px;text-align:center;position:relative;overflow:hidden;box-shadow:var(--glow-s);}
        .gcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--steel),var(--sky),transparent);}
        .sbars{display:flex;flex-direction:column;gap:13px;}
        .sbr{display:flex;align-items:center;gap:14px;}
        .sbn{font-size:12px;color:var(--tx2);width:100px;flex-shrink:0;}
        .sbt{flex:1;height:6px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;}
        .sbf{height:100%;border-radius:3px;transition:width 1.4s ease;}
        .sbp{font-size:12px;color:var(--plat2);width:34px;text-align:right;font-family:'DM Mono',monospace;}

        /* ── FEATURES ── */
        .fbg{background:var(--bg2);border-top:1px solid var(--bd);}
        .fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px;}
        .fcard{background:var(--sf);border:1px solid var(--bd);border-radius:16px;padding:28px;transition:all .3s;}
        .fcard:hover{border-color:var(--bd2);transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.4),var(--glow-s);}
        .fico{width:46px;height:46px;border-radius:12px;background:rgba(26,58,110,.3);border:1px solid rgba(144,202,249,.15);display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:18px;}
        .ftit{font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;color:var(--plat);margin-bottom:9px;}
        .fdesc{font-size:13px;color:var(--tx2);line-height:1.7;}

        /* ── CTA ── */
        .ctasec{padding:76px 48px;}
        .ctacard{max-width:780px;margin:0 auto;background:linear-gradient(135deg,rgba(26,58,110,.18),rgba(20,33,58,.6));border:1px solid var(--bd2);border-radius:24px;padding:64px 56px;text-align:center;position:relative;overflow:hidden;box-shadow:var(--glow-s);}
        .ctacard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--steel),var(--sky),transparent);}
        .ctacard::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(26,58,110,.15) 0%,transparent 70%);pointer-events:none;}
        .ctacard h2{font-family:'Montserrat',sans-serif;font-size:clamp(26px,3.2vw,42px);font-weight:900;letter-spacing:-.03em;line-height:1.08;margin-bottom:16px;color:var(--plat);position:relative;z-index:1;}
        .ctacard p{font-size:14px;color:var(--tx2);line-height:1.75;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;z-index:1;}
        .erow{display:flex;gap:10px;max-width:460px;margin:0 auto;position:relative;z-index:1;}
        .einp{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--bd2);color:var(--plat);padding:14px 18px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;transition:all .2s;}
        .einp:focus{border-color:var(--sky);box-shadow:0 0 0 3px rgba(144,202,249,.1);}
        .einp::placeholder{color:var(--tx3);}
        .bsub{background:linear-gradient(135deg,var(--navy2),var(--navy3));border:1px solid rgba(144,202,249,.2);color:var(--plat);padding:14px 26px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all .25s;white-space:nowrap;box-shadow:0 6px 28px rgba(26,58,110,.5);}
        .bsub:hover{transform:translateY(-1px);box-shadow:0 10px 40px rgba(26,58,110,.7);}
        .fnote{font-size:11px;color:var(--tx3);margin-top:14px;position:relative;z-index:1;}
        .subokk{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--green2);font-size:14px;font-weight:600;}

        /* ── FOOTER ── */
        footer{background:linear-gradient(180deg,transparent 0%,rgba(8,13,26,1) 100%);border-top:1px solid var(--bd);padding:48px 48px 28px;}
        .ftop{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
        .fbrand p{font-size:13px;color:var(--tx2);line-height:1.75;margin-top:14px;max-width:240px;}
        .fcol h4{font-size:13px;font-weight:700;color:var(--plat);margin-bottom:16px;letter-spacing:.02em;}
        .fcol ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
        .fcol ul a{font-size:12px;color:var(--tx3);text-decoration:none;transition:color .2s;}
        .fcol ul a:hover{color:var(--plat2);}
        .socrow{display:flex;gap:10px;margin-top:16px;}
        .sb2{width:36px;height:36px;background:var(--sf);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;transition:all .2s;text-decoration:none;color:var(--tx2);}
        .sb2:hover{border-color:var(--bd2);color:var(--plat);transform:translateY(-2px);}
        .fbot{max-width:1300px;margin:0 auto;padding-top:24px;border-top:1px solid var(--bd3);display:flex;align-items:center;justify-content:space-between;}
        .fleg{display:flex;gap:20px;list-style:none;}
        .fleg a{font-size:11px;color:var(--tx3);text-decoration:none;transition:color .2s;}
        .fleg a:hover{color:var(--plat2);}

        @keyframes fu{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fu .9s ease both;}
        .d1{animation-delay:.1s;}.d2{animation-delay:.25s;}.d3{animation-delay:.4s;}.d4{animation-delay:.55s;}.d5{animation-delay:.7s;}

        @media(max-width:1024px){
          nav{padding:0 20px;}.nls{display:none;}
          .hero{padding:130px 20px 60px;}
          .hcon{grid-template-columns:1fr;}.hcard{display:none;}
          .ststrip{padding:24px 20px;}.stinner{grid-template-columns:repeat(2,1fr);}
          .sec,.hmbg,.ctasec,footer{padding-left:20px;padding-right:20px;}
          .ngrid,.pgrid,.fgrid{grid-template-columns:1fr;}
          .nc.ft{grid-row:auto;min-height:220px;}
          .hmg{grid-template-columns:repeat(3,1fr);}
          .gsec{grid-template-columns:1fr;padding:56px 20px;}
          .ftop{grid-template-columns:1fr 1fr;gap:28px;}
          .erow{flex-direction:column;}
          .fbot{flex-direction:column;gap:14px;}
        }
      `}</style>

      <Particles />

      {/* ── NAVBAR ── */}
      <nav>
        <div className="nlogo">
          <div className="lic">P</div>
          <span className="ltx">Pulse<span>Markets</span> AI</span>
        </div>
        <ul className="nls">
          {["Markets","AI Signals","News Feed","Portfolio","Pricing"].map(l=><li key={l}><a href="#">{l}</a></li>)}
        </ul>
        <div className="nr">
          <div style={{position:"relative"}}>
            <div className="bell" onClick={()=>setShowA(s=>!s)}>
              🔔{unread>0&&<span className="bbadge">{unread}</span>}
            </div>
            {showA&&(
              <div className="adrop">
                <div className="ahdr">
                  <span style={{fontSize:13,fontWeight:600,color:"var(--plat)"}}>Alerts & Signals</span>
                  <button style={{background:"none",border:"none",color:"var(--sky)",fontSize:11,cursor:"pointer"}} onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true})))}>Mark all read</button>
                </div>
                {alerts.map(a=>(
                  <div className="aitem" key={a.id} onClick={()=>setAlerts(p=>p.map(x=>x.id===a.id?{...x,read:true}:x))}>
                    <div className={`aico ${a.type==="bull"?"abull":"abear"}`}>{a.type==="bull"?"📈":"📉"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:700,color:"var(--sky)"}}>{a.sym}</div>
                      <div style={{fontSize:11,color:"var(--tx2)",marginTop:1,lineHeight:1.45}}>{a.msg}</div>
                      <div style={{fontSize:10,color:"var(--tx3)",marginTop:3}}>{a.time}</div>
                    </div>
                    {!a.read&&<div className="udot"/>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="bgh">Sign In</button>
          <button className="bprim">Get Started →</button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div className="tkb">
        <div className="tkt">
          {[...assets,...assets].map((a,i)=>(
            <div className="ti" key={i}>
              <span className="tsym">{a.sym}</span>
              <span className="tval">{a.val>999?a.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):a.val.toFixed(a.val<10?4:2)}</span>
              <span className={a.chg>=0?"up":"dn"}>{a.chg>=0?"▲":"▼"}{Math.abs(a.chg).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hbg"/><Wave/>
        <div className="hcon">
          <div>
            <div className="hbadge fu d1"><div className="ldot"/>AI-Driven Financial Intelligence</div>
            <h1 className="fu d2">The Future of<br/><span className="grad">Market Intelligence</span><br/>is Here.</h1>
            <p className="hsub fu d3">Institutional-grade AI insights for global markets. Real-time signals, predictive analytics, and precision stock picks — built for serious investors.</p>
            <div className="hbtns fu d4">
              <button className="bh1">Start Now →</button>
              <button className="bh2">Explore AI Signals</button>
            </div>
            <div className="htrust fu d5">
              <div className="tavs">
                {["H","A","R","K","S"].map((l,i)=><div className="tav" key={i} style={{marginLeft:i===0?0:-10}}>{l}</div>)}
              </div>
              <div className="trtx"><strong>48,000+</strong> investors trust PulseMarkets AI<br/>for daily market intelligence</div>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="hcard">
            <div className="hcth">
              <span className="hctit">Live Dashboard</span>
              <span className="lchip"><div className="ldot"/>Live</span>
            </div>
            <div className="mg">
              {assets.slice(0,3).map((a,i)=>(
                <div className="mc" key={i}>
                  <div className="mcn">{a.sym}</div>
                  <div className={`mcv ${a.chg>=0?"up":"dn"}`}>{a.val>999?a.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):a.val.toFixed(2)}</div>
                  <div className={`mcc ${a.chg>=0?"up":"dn"}`}>{a.chg>=0?"▲":"▼"}{Math.abs(a.chg).toFixed(2)}%</div>
                  <div style={{marginTop:8}}><Spark data={SPX.slice(-16)} up={a.chg>=0}/></div>
                </div>
              ))}
            </div>
            <div className="aisb">
              <div className="aisi">⚡</div>
              <div>
                <div className="aisl">AI Top Signal Today</div>
                <div className="aist"><strong>NVDA</strong> — AI supercycle intact. Strong buy signal active. Confidence: <strong style={{color:"var(--sky)"}}>94/100</strong></div>
              </div>
            </div>
            <div className="hcf">
              <div className="hs"><div className="hsn">91%</div><div className="hsl">AI Accuracy</div></div>
              <div style={{width:1,background:"var(--bd)"}}/>
              <div className="hs"><div className="hsn">2.4M</div><div className="hsl">Daily Signals</div></div>
              <div style={{width:1,background:"var(--bd)"}}/>
              <div className="hs"><div className="hsn">&lt;2s</div><div className="hsl">Latency</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="ststrip">
        <div className="stinner">
          {[{n:48000,s:"+",l:"Active Investors"},{n:2400000,s:"+",l:"Signals Per Day"},{n:91,s:"%",l:"AI Accuracy Rate"},{n:150,s:"+",l:"Markets Covered"}].map((s,i)=>(
            <div className="stbox" key={i}><div className="stnum"><Counter end={s.n} suffix={s.s}/></div><div className="stlbl">{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="sec">
        <div className="sbadge">AI-Powered Analytics</div>
        <div className="stit">Real-Time <span className="grad">Market Charts</span></div>
        <div className="ssub" style={{marginBottom:28}}>Interactive charts powered by our AI prediction engine. Switchable across all major asset classes with 30-day history.</div>
        <div className="cmain">
          <div className="ctabs">
            {(["BTC","ETH","SPX","GOLD","NDX"] as const).map(c=>(
              <button key={c} className={`ctab ${cs===c?"on":""}`} onClick={()=>setCs(c)}>{CHART_INFO[c].label}</button>
            ))}
          </div>
          {(()=>{
            const d=CHART_DATA[cs],cur=d[d.length-1].v,prev=d[0].v;
            const pct=(((cur-prev)/prev)*100).toFixed(2),isUp=parseFloat(pct)>=0,color=CHART_INFO[cs].color;
            return <>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:32,fontWeight:900,color:isUp?"var(--plat)":"var(--red2)"}}>{cur>999?cur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):cur.toFixed(2)}</div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:14,color:isUp?"var(--green2)":"var(--red2)"}}>{isUp?"▲":"▼"} {Math.abs(parseFloat(pct)).toFixed(2)}% (30 days)</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,color:"var(--tx3)",marginBottom:4}}>AI Prediction</div>
                  <div style={{fontSize:14,fontWeight:700,color:isUp?"var(--sky)":"var(--red2)"}}>{isUp?"📈 Bullish Trend":"📉 Bearish Trend"}</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={d} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <defs><linearGradient id="cgg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={.22}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,196,222,0.05)"/>
                  <XAxis dataKey="d" tick={{fill:"#4a6080",fontSize:10}} interval={9}/>
                  <YAxis tick={{fill:"#4a6080",fontSize:10}} domain={["auto","auto"]}/>
                  <Tooltip content={<CTip/>}/>
                  <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill="url(#cgg)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </>;
          })()}
        </div>
        {/* mini charts */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:14}}>
          {[{label:"S&P 500",sym:"SPX",data:SPX,color:"#90caf9"},{label:"Bitcoin",sym:"BTC",data:BTC,color:"#e8ecf0"},{label:"Ethereum",sym:"ETH",data:ETH,color:"#b0c4de"},{label:"Gold",sym:"GOLD",data:GOLD,color:"#ffe082"}].map((c,i)=>{
            const cur=c.data[c.data.length-1].v,prev=c.data[0].v,pct=(((cur-prev)/prev)*100).toFixed(2),up=parseFloat(pct)>=0;
            return <div key={i} onClick={()=>setCs(c.sym as any)} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:12,padding:"14px 14px 10px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--bd2)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--bd)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><div style={{fontSize:10,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{c.label}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:c.color}}>{cur>999?cur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):cur.toFixed(2)}</div></div>
                <span style={{fontSize:11,fontWeight:600,color:up?"var(--green2)":"var(--red2)"}}>{up?"▲":"▼"}{Math.abs(parseFloat(pct)).toFixed(2)}%</span>
              </div>
              <Spark data={c.data.slice(-20)} up={up}/>
            </div>;
          })}
        </div>
      </div>

      {/* ── ASSET TABLE ── */}
      <div style={{background:"var(--bg2)",borderTop:"1px solid var(--bd)"}}>
        <div className="sec" style={{paddingTop:70}}>
          <div className="sbadge">Global Markets</div>
          <div className="stit">Live <span className="grad">Asset Tracker</span></div>
          <div className="atabs" style={{marginTop:24}}>
            {(["all","stocks","crypto","forex","commodities"] as const).map(t=>(
              <button key={t} className={`atab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>
                {t==="all"?"🌐 All":t==="stocks"?"📊 Stocks":t==="crypto"?"₿ Crypto":t==="forex"?"💱 Forex":"🥇 Commodities"}
              </button>
            ))}
          </div>
          <table className="atbl">
            <thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>Trend</th><th>Volume</th><th>Mkt Cap</th><th>AI Score</th><th></th></tr></thead>
            <tbody>
              {filtered.map((a,i)=>(
                <tr key={i}>
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="sbdg">{a.sym.slice(0,3)}</div><div><div style={{fontWeight:600,color:"var(--plat)",fontSize:13}}>{a.name}</div><div style={{fontSize:10,color:"var(--tx3)",marginTop:1}}>{a.sym}</div></div></div></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:"var(--plat2)"}}>{a.val>999?a.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):a.val.toFixed(a.val<10?4:2)}</td>
                  <td><span className={`chgp ${a.chg>=0?"chu":"chd"} ${a.chg>=0?"up":"dn"}`}>{a.chg>=0?"▲":"▼"} {Math.abs(a.chg).toFixed(2)}%</span></td>
                  <td style={{width:90}}><Spark data={SPX.slice(-16)} up={a.chg>=0}/></td>
                  <td style={{color:"var(--tx3)",fontSize:12}}>{a.vol}</td>
                  <td style={{color:"var(--tx3)",fontSize:12}}>{a.mkt}</td>
                  <td><div className="aibar"><div className="ait"><div className="aif" style={{width:`${a.ai}%`}}/></div><span style={{fontSize:11,color:"var(--sky)",width:28,fontWeight:600}}>{a.ai}</span></div></td>
                  <td style={{textAlign:"right"}}><button className="wbtn">+ Watch</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── NEWS ── */}
      <div className="sec">
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:24}}>
          <div><div className="sbadge">Live Intelligence</div><div className="stit">Global <span className="grad">News Feed</span></div></div>
          <a href="#" style={{fontSize:12,color:"var(--sky)",textDecoration:"none"}}>View All →</a>
        </div>
        <div className="nfilts">
          {(["All","Markets","Crypto","Forex","Commodities"] as const).map(f=>(
            <button key={f} className={`nflt ${nf===f?"on":""}`} onClick={()=>setNf(f)}>{f}</button>
          ))}
        </div>
        <div className="ngrid">
          {fNews.slice(0,5).map((n,i)=>(
            <div key={i} className={`nc ${i===0?"ft":""}`}>
              {n.hot&&<div className="hotb">🔥 Trending</div>}
              <div>
                <span className={`ntag ${n.tag==="Bullish"?"tbull":n.tag==="Bearish"?"tbear":n.tag==="Alert"?"twarn":n.tag==="Analysis"?"tai":"tne"}`}>{n.tag}</span>
                <div className="ntit">{n.title}</div>
                {i===0&&<div className="nexc">Markets responding strongly to the latest Fed communication. Our AI models indicate a high-probability continuation of the bullish trend across global technology and growth sectors.</div>}
                <div className="nmeta"><span>📡 {n.src}</span><span>{n.time}</span></div>
              </div>
              <div className="nscore">
                <span className="nsl">AI Relevance</span>
                <div className="nst"><div className="nsf" style={{width:`${n.score}%`}}/></div>
                <span className="nsn">{n.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI PICKS ── */}
      <div style={{background:"var(--bg2)",borderTop:"1px solid var(--bd)"}}>
        <div className="sec" style={{paddingTop:70}}>
          <div className="sbadge">AI Signal Engine</div>
          <div className="stit">Today&apos;s <span className="grad">AI Picks</span></div>
          <div className="ssub">Precision signals from our proprietary AI model. Entry, target, stop-loss and risk levels updated continuously.</div>
          <div className="pgrid">
            {AI_PICKS.map((p,i)=>(
              <div key={i} className={`pcard ${ap===i?"act":""}`} onClick={()=>setAp(ap===i?null:i)}>
                <div className="ptop">
                  <div><div className="psym">{p.sym}</div><div className="pnm">{p.name}</div></div>
                  <span className={`apill ${p.act==="STRONG BUY"?"asbuy":p.act==="BUY"?"abuy":p.act==="SELL"?"asell":"ahold"}`}>{p.act}</span>
                </div>
                <div className="crow">
                  <span style={{fontSize:11,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>Confidence</span>
                  <div className="cbar"><div className="cfill" style={{width:`${p.score}%`}}/></div>
                  <span style={{fontSize:12,color:"var(--sky)",fontWeight:700,width:28}}>{p.score}</span>
                </div>
                <div className="preason">{p.reason}</div>
                <div className="pdg">
                  <div className="pdb"><div className="pdl">Entry</div><div className="pdv up">{p.entry}</div></div>
                  <div className="pdb"><div className="pdl">Target</div><div className="pdv" style={{color:"var(--sky)"}}>{p.target}</div></div>
                  <div className="pdb"><div className="pdl">Stop</div><div className="pdv dn">{p.stop}</div></div>
                  <div className="pdb"><div className="pdl">Sector</div><div className="pdv" style={{fontSize:12,color:"var(--tx2)"}}>{p.sector}</div></div>
                  <div className="pdb"><div className="pdl">Timeframe</div><div className="pdv" style={{fontSize:11,color:"var(--tx2)"}}>{p.tf}</div></div>
                  <div className="pdb"><div className="pdl">Risk</div><div className={`pdv ${p.risk==="Low"?"up":p.risk==="High"?"dn":""}`} style={{fontSize:12}}>{p.risk}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HEATMAP ── */}
      <div className="hmbg">
        <div className="hmw">
          <div className="sbadge">Market Pulse</div>
          <div className="stit">S&P 500 <span className="grad">Heatmap</span></div>
          <div className="hmg">
            {HEATMAP.map((h,i)=>{
              const it=Math.min(Math.abs(h.chg)/5,1);
              const bg=h.chg>=0?`rgba(76,175,125,${.08+it*.28})`:`rgba(229,115,115,${.08+it*.28})`;
              const bd=h.chg>=0?`rgba(76,175,125,${.18+it*.3})`:`rgba(229,115,115,${.18+it*.3})`;
              return <div key={i} className="hmc" style={{background:bg,borderColor:bd}}>
                <div className="hmsym" style={{color:h.chg>=0?"var(--green2)":"var(--red2)"}}>{h.sym}</div>
                <div className={`hmch ${h.chg>=0?"up":"dn"}`}>{h.chg>=0?"▲":"▼"}{Math.abs(h.chg).toFixed(2)}%</div>
              </div>;
            })}
          </div>
          {/* Volume */}
          <div style={{marginTop:18,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:14,padding:"18px 18px 6px"}}>
            <div style={{fontSize:11,color:"var(--tx2)",fontWeight:600,marginBottom:14,textTransform:"uppercase",letterSpacing:".06em"}}>Market Volume — Billions</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={VOL_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,196,222,.05)" vertical={false}/>
                <XAxis dataKey="d" tick={{fill:"#4a6080",fontSize:10}}/>
                <YAxis tick={{fill:"#4a6080",fontSize:10}}/>
                <Tooltip content={<CTip/>}/>
                <Bar dataKey="v" radius={[4,4,0,0]}>
                  {VOL_DATA.map((d,i)=><Cell key={i} fill={d.up?"rgba(76,175,125,.65)":"rgba(229,115,115,.65)"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── GAUGE + SENTIMENT ── */}
      <div className="gsec">
        <div className="gcard">
          <div style={{fontSize:11,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Overall Sentiment</div>
          <Gauge score={73}/>
          <div style={{marginTop:14,fontSize:11,color:"var(--tx3)"}}>Updated 2 minutes ago</div>
        </div>
        <div>
          <div className="sbadge">AI Sentiment Engine</div>
          <div className="stit">Real-Time <span className="grad">Market Mood</span></div>
          <p className="ssub" style={{marginBottom:28}}>Our AI aggregates signals from global news, options flow, institutional positioning, and social data — updated every 60 seconds.</p>
          <div className="sbars">
            {[{name:"Technology",pct:88,c:"#90caf9"},{name:"Crypto",pct:82,c:"#b0c4de"},{name:"Healthcare",pct:61,c:"#4db6ac"},{name:"Finance",pct:65,c:"#7986cb"},{name:"Energy",pct:34,c:"#ef9a9a"},{name:"Consumer",pct:52,c:"#ffe082"},{name:"Real Estate",pct:41,c:"#ce93d8"}].map((s,i)=>(
              <div className="sbr" key={i}>
                <span className="sbn">{s.name}</span>
                <div className="sbt"><div className="sbf" style={{width:`${s.pct}%`,background:s.c}}/></div>
                <span className="sbp">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTORS ── */}
      <div style={{borderTop:"1px solid var(--bd)",background:"var(--bg2)"}}>
        <div className="sec">
          <div className="sbadge">Sector Intelligence</div>
          <div className="stit">Sector <span className="grad">Performance</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:28}}>
            {SECTORS.map((s,i)=>(
              <div key={i} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:12,padding:18,transition:"all .25s",cursor:"default"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--bd2)";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="var(--bd)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:14,color:"var(--plat)"}}>{s.name}</div>
                  <div style={{fontSize:12,fontWeight:600,color:s.chg>=0?"var(--green2)":"var(--red2)"}}>{s.chg>=0?"▲":"▼"}{Math.abs(s.chg).toFixed(1)}%</div>
                </div>
                <div style={{height:5,background:"rgba(255,255,255,.05)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                  <div style={{height:"100%",width:`${s.score}%`,background:s.color,borderRadius:3,opacity:.8}}/>
                </div>
                <div style={{fontSize:12,color:"var(--tx2)"}}>{s.score}% bullish</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="fbg">
        <div className="sec">
          <div className="sbadge">Platform Features</div>
          <div className="stit">Why <span className="grad">PulseMarkets AI</span></div>
          <div className="fgrid">
            {[
              {ico:"🧠",tit:"AI Signal Engine",        desc:"Proprietary models trained on decades of market data. Detects patterns before headlines — updated in real-time, 24/7."},
              {ico:"📡",tit:"Live News Intelligence",   desc:"We surface only market-moving stories from Bloomberg, Reuters, CNBC — scored by AI relevance and impact."},
              {ico:"⚡",tit:"Real-Time Alerts",         desc:"Instant notifications when AI detects significant momentum shifts, news sentiment changes, or unusual flow data."},
              {ico:"📊",tit:"Interactive Charts",       desc:"Professional-grade charting with AI overlay predictions, support/resistance levels, and pattern recognition."},
              {ico:"🎯",tit:"Precision AI Picks",       desc:"Daily curated picks with entry, target and stop-loss. Backed by quantitative reasoning and backtested strategies."},
              {ico:"🔒",tit:"Bank-Grade Security",      desc:"Read-only market data — we never touch your brokerage. End-to-end encrypted. Never sold to third parties."},
            ].map((f,i)=>(
              <div key={i} className="fcard">
                <div className="fico">{f.ico}</div>
                <div className="ftit">{f.tit}</div>
                <div className="fdesc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="ctasec">
        <div className="ctacard">
          <h2>Get <span className="grad">AI Intelligence</span><br/>delivered daily</h2>
          <p>Join 48,000+ investors receiving AI-curated signals, market analysis, and precision stock picks — completely free to start.</p>
          {done?<div className="subokk">✅ You&apos;re in! Check your inbox for your first AI market report.</div>:(
            <>
              <div className="erow">
                <input className="einp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                <button className="bsub" onClick={()=>email&&setDone(true)}>Get Free Access</button>
              </div>
              <div className="fnote">No spam · Unsubscribe anytime · 48K+ investors trust PulseMarkets</div>
            </>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="ftop">
          <div className="fbrand">
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className="lic" style={{width:36,height:36,fontSize:16}}>P</div>
              <span className="ltx" style={{fontSize:15}}>Pulse<span>Markets</span> AI</span>
            </div>
            <p>Institutional-grade AI financial intelligence for the modern investor. Real-time signals, global news, precision analytics.</p>
            <div className="socrow">{["𝕏","in","f","▶"].map((s,i)=><a key={i} href="#" className="sb2">{s}</a>)}</div>
          </div>
          <div className="fcol"><h4>Platform</h4><ul>{["Markets","AI Signals","News Feed","Portfolio Tracker","Watchlist","Alerts"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          <div className="fcol"><h4>Company</h4><ul>{["About Us","Blog","Careers","Press","Partners","Contact"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          <div className="fcol"><h4>Legal</h4><ul>{["Privacy Policy","Terms of Service","Cookie Policy","Disclaimer","Risk Warning","GDPR"].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
        </div>
        <div className="fbot">
          <p style={{fontSize:11,color:"var(--tx3)"}}>© 2026 PulseMarkets AI · Not financial advice · All data for informational purposes only.</p>
          <ul className="fleg"><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Risk Disclosure</a></li></ul>
        </div>
      </footer>
    </>
  );
}
