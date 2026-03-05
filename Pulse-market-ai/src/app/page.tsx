"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid,
} from "recharts";

// ── DATA ─────────────────────────────────────────────────────────
function gen(base: number, pts: number, vol: number) {
  let v = base;
  return Array.from({ length: pts }, (_, i) => {
    v = +(v + (Math.random() - 0.47) * vol).toFixed(2);
    return { t: `${i+1}`, v, d: new Date(2024,0,i+1).toLocaleDateString("en-US",{month:"short",day:"numeric"}) };
  });
}
const SPX  = gen(4500,60,20);  const BTC = gen(42000,60,1100);
const ETH  = gen(2200,60,60);  const GOLD = gen(1980,60,12);
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
const NEWS_DATA = [
  {cat:"Markets",tag:"Bullish",title:"Fed signals rate cuts ahead — global tech markets surge to record highs",src:"Bloomberg",time:"2m",score:91,hot:true},
  {cat:"Crypto", tag:"Alert",  title:"Bitcoin breaks $68K resistance — institutional inflows at 3-month peak",src:"CoinDesk",time:"8m", score:88,hot:true},
  {cat:"Markets",tag:"Analysis",title:"NVDA earnings beat: AI demand drives 40% revenue surge quarter-on-quarter",src:"Reuters",time:"15m",score:94,hot:false},
  {cat:"Forex",  tag:"Risk",   title:"Dollar weakens ahead of FOMC minutes — EM currencies rally sharply",src:"FX Street",time:"22m",score:72,hot:false},
  {cat:"Crypto", tag:"Bullish",title:"Ethereum ETF odds rise to 78% — derivatives pricing in significant rally",src:"The Block",time:"44m",score:85,hot:false},
  {cat:"Markets",tag:"Bearish",title:"China PMI contracts second month — global supply chain risk elevated",src:"FT",time:"1h", score:74,hot:false},
];
const AI_PICKS = [
  {sym:"NVDA",name:"NVIDIA Corp",   act:"STRONG BUY",score:94,entry:"$610",target:"$740",stop:"$570",risk:"Low",   reason:"AI chip supercycle intact. Data center demand structurally elevated.",sector:"Technology",tf:"2–4 wks"},
  {sym:"META",name:"Meta Platforms",act:"BUY",       score:87,entry:"$480",target:"$565",stop:"$452",risk:"Medium",reason:"Ad revenue recovery + AI monetization accelerating rapidly.",sector:"Technology",tf:"3–6 wks"},
  {sym:"MSFT",name:"Microsoft",     act:"BUY",       score:90,entry:"$410",target:"$490",stop:"$388",risk:"Low",   reason:"Copilot ARR growing 60% QoQ. Azure AI compounding at 40%.",sector:"Technology",tf:"4–8 wks"},
  {sym:"SOL", name:"Solana",        act:"BUY",       score:86,entry:"$138",target:"$175",stop:"$122",risk:"Medium",reason:"DeFi TVL at all-time highs. Developer activity outpacing all L1s.",sector:"Crypto",tf:"1–3 wks"},
  {sym:"XOM", name:"Exxon Mobil",   act:"SELL",      score:38,entry:"$102",target:"$88", stop:"$108",risk:"Medium",reason:"China PMI contraction signals energy sector headwinds through Q2.",sector:"Energy",tf:"2–4 wks"},
  {sym:"TSLA",name:"Tesla Inc",     act:"HOLD",      score:61,entry:"$241",target:"$268",stop:"$215",risk:"High",  reason:"Margin pressure from price wars. Await Q2 delivery clarity.",sector:"Automotive",tf:"6–8 wks"},
];
const HEATMAP = [
  {sym:"NVDA",chg:4.33},{sym:"META",chg:3.21},{sym:"SOL",chg:5.44},
  {sym:"AAPL",chg:2.10},{sym:"MSFT",chg:1.85},{sym:"GOOGL",chg:0.92},
  {sym:"AMZN",chg:-0.44},{sym:"TSLA",chg:-1.45},{sym:"JPM",chg:-0.88},
  {sym:"XOM",chg:-2.10},{sym:"BTC",chg:3.20},{sym:"ETH",chg:2.15},
];
const VOL_DATA = Array.from({length:14},(_,i)=>({d:`M${i+1}`,v:+(2.5+Math.random()*5.5).toFixed(1),up:Math.random()>0.4}));
const CHART_DATA:{[k:string]:any[]} = {BTC,ETH,SPX,GOLD,NDX};
const CHART_INFO:{[k:string]:{label:string;color:string}} = {
  BTC:{label:"Bitcoin",  color:"#e6af3c"},
  ETH:{label:"Ethereum", color:"#a78bfa"},
  SPX:{label:"S&P 500",  color:"#22c55e"},
  GOLD:{label:"Gold",    color:"#f5c842"},
  NDX:{label:"NASDAQ",   color:"#60a5fa"},
};

// ── 3D GLOBE ─────────────────────────────────────────────────────
function Globe3D() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const SIZE = 420; c.width = SIZE; c.height = SIZE;
    const R = 160, cx = SIZE/2, cy = SIZE/2;

    // Generate globe dots
    const dots: {lat:number;lng:number}[] = [];
    for (let lat=-90;lat<=90;lat+=10) {
      const r = Math.cos(lat*Math.PI/180);
      const count = Math.max(1, Math.round(36*r));
      for (let i=0;i<count;i++) {
        dots.push({lat, lng:(i/count)*360-180});
      }
    }
    // Market hotspots
    const hotspots = [
      {lat:40.7,lng:-74,label:"NYSE",val:"+1.2%"},
      {lat:51.5,lng:-0.1,label:"LSE", val:"+0.8%"},
      {lat:35.7,lng:139,label:"TSE", val:"-0.3%"},
      {lat:22.3,lng:114,label:"HKEx",val:"+2.1%"},
      {lat:48.9,lng:2.3,label:"EU",  val:"+0.5%"},
      {lat:19.1,lng:72.8,label:"NSE",val:"+1.8%"},
    ];

    // Animated lines between hotspots
    const connections = [
      [0,1],[1,2],[2,3],[3,4],[0,4],[0,5],[1,5]
    ];
    let angle = 0, raf: number;
    const drawDot = (lat:number, lng:number, rotY:number) => {
      const latR = lat*Math.PI/180;
      const lngR = (lng+rotY)*Math.PI/180;
      const x3 = R*Math.cos(latR)*Math.sin(lngR);
      const y3 = R*Math.sin(latR);
      const z3 = R*Math.cos(latR)*Math.cos(lngR);
      return {x:cx+x3, y:cy-y3, z:z3, visible:z3>-20};
    };

    const draw = () => {
      ctx.clearRect(0,0,SIZE,SIZE);

      // Outer glow
      const grd = ctx.createRadialGradient(cx,cy,R*0.3,cx,cy,R*1.4);
      grd.addColorStop(0,"rgba(230,175,60,0.04)");
      grd.addColorStop(0.7,"rgba(80,60,8,0.12)");
      grd.addColorStop(1,"transparent");
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(cx,cy,R*1.5,0,Math.PI*2); ctx.fill();

      // Globe circle
      const globeGrd = ctx.createRadialGradient(cx-40,cy-40,20,cx,cy,R);
      globeGrd.addColorStop(0,"rgba(230,175,60,0.05)");
      globeGrd.addColorStop(0.5,"rgba(80,60,8,0.18)");
      globeGrd.addColorStop(1,"rgba(0,10,30,0.3)");
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=globeGrd; ctx.fill();
      ctx.strokeStyle="rgba(230,175,60,0.13)"; ctx.lineWidth=1; ctx.stroke();

      // Grid lines (latitude/longitude)
      ctx.strokeStyle="rgba(230,175,60,0.05)"; ctx.lineWidth=0.5;
      for (let lat=-60;lat<=60;lat+=30) {
        ctx.beginPath();
        for (let lng=-180;lng<=180;lng+=5) {
          const p = drawDot(lat,lng,angle);
          if(p.visible) { lng===-180?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); }
        }
        ctx.stroke();
      }
      for (let lng=-180;lng<=180;lng+=30) {
        ctx.beginPath();
        let started=false;
        for (let lat=-80;lat<=80;lat+=5) {
          const p = drawDot(lat,lng,angle);
          if(p.visible) { if(!started){ctx.moveTo(p.x,p.y);started=true;}else ctx.lineTo(p.x,p.y); }
        }
        ctx.stroke();
      }

      // Dots
      dots.forEach(d => {
        const p = drawDot(d.lat,d.lng,angle);
        if (!p.visible) return;
        const brightness = (p.z+R)/(2*R);
        ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(230,175,60,${0.15+brightness*0.5})`; ctx.fill();
      });

      // Connections
      connections.forEach(([a,b]) => {
        const pa = drawDot(hotspots[a].lat,hotspots[a].lng,angle);
        const pb = drawDot(hotspots[b].lat,hotspots[b].lng,angle);
        if (!pa.visible||!pb.visible) return;
        ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y);
        const alpha = Math.sin(Date.now()/1000+a)*0.3+0.2;
        ctx.strokeStyle=`rgba(230,175,60,${alpha})`; ctx.lineWidth=0.8; ctx.stroke();
      });

      // Hotspots
      hotspots.forEach((hs,i) => {
        const p = drawDot(hs.lat,hs.lng,angle);
        if (!p.visible) return;
        const pulse = Math.sin(Date.now()/800+i*1.2)*3;
        // Ring
        ctx.beginPath(); ctx.arc(p.x,p.y,6+pulse,0,Math.PI*2);
        ctx.strokeStyle="rgba(230,175,60,0.4)"; ctx.lineWidth=1; ctx.stroke();
        // Dot
        ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2);
        const isUp = hs.val.startsWith("+");
        ctx.fillStyle=isUp?"rgba(0,230,118,0.9)":"rgba(255,82,82,0.9)"; ctx.fill();
        // Label
        if (p.z > 20) {
          ctx.font="bold 9px 'Poppins',sans-serif";
          ctx.fillStyle="rgba(255,255,255,0.8)";
          ctx.fillText(hs.label,p.x+8,p.y-4);
          const vc = isUp?"rgba(0,230,118,0.9)":"rgba(255,82,82,0.9)";
          ctx.fillStyle=vc; ctx.font="8px 'DM Mono',monospace";
          ctx.fillText(hs.val,p.x+8,p.y+6);
        }
      });

      // Rim light
      const rim = ctx.createRadialGradient(cx,cy,R-2,cx,cy,R+8);
      rim.addColorStop(0,"transparent");
      rim.addColorStop(0.5,"rgba(230,175,60,0.12)");
      rim.addColorStop(1,"transparent");
      ctx.beginPath(); ctx.arc(cx,cy,R+4,0,Math.PI*2);
      ctx.strokeStyle=rim; ctx.lineWidth=8; ctx.stroke();

      angle = (angle+0.18)%360;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  },[]);
  return (
    <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at center,rgba(230,175,60,0.05) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
      <canvas ref={ref} style={{width:420,height:420,maxWidth:"100%"}}/>
    </div>
  );
}

// ── 3D FLOATING CARDS ────────────────────────────────────────────
function Card3D({children,className,style,onClick}:{children:React.ReactNode;className?:string;style?:React.CSSProperties;onClick?:()=>void}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x*12}deg) rotateX(${-y*10}deg) translateZ(6px)`;
    el.style.boxShadow = `${-x*20}px ${-y*20}px 40px rgba(230,175,60,0.06), 0 20px 60px rgba(0,0,0,0.5)`;
  };
  const handleLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
  };
  return (
    <div ref={ref} className={className} style={{transition:"transform 0.15s ease,box-shadow 0.15s ease",...style}}
      onClick={onClick} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}

// ── TICKER ORBS (3D floating number balls) ───────────────────────
function FloatingOrbs() {
  const items = [
    {sym:"NVDA",val:"+4.33%",color:"#e6af3c"},{sym:"BTC",val:"+3.20%",color:"#22c55e"},
    {sym:"META",val:"+3.21%",color:"#7c4dff"},{sym:"TSLA",val:"-1.45%",color:"#ff5252"},
    {sym:"ETH",val:"+2.15%",color:"#40c4ff"},{sym:"XOM",val:"-2.10%",color:"#ff6d00"},
  ];
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {items.map((item,i)=>(
        <div key={i} style={{
          position:"absolute",
          top:`${15+i*13}%`,
          right:`${-2+Math.sin(i)*5}%`,
          background:`rgba(${item.color=="#ef4444"?"239,68,68":"200,150,30"},0.1)`,
          border:`1px solid ${item.color}30`,
          borderRadius:10,padding:"6px 12px",backdropFilter:"blur(12px)",
          animation:`orbFloat${i%3} ${5+i*0.7}s ease-in-out infinite`,
          animationDelay:`${i*0.8}s`,
        }}>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.06em"}}>{item.sym}</div>
          <div style={{fontSize:13,fontWeight:700,color:item.color,fontFamily:"'DM Mono',monospace"}}>{item.val}</div>
        </div>
      ))}
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────
const CTip=({active,payload}:any)=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:"rgba(13,12,10,0.97)",border:"1px solid rgba(230,175,60,0.22)",borderRadius:10,padding:"8px 14px",fontSize:12,backdropFilter:"blur(20px)"}}><div style={{color:"rgba(255,255,255,0.4)",marginBottom:3}}>{payload[0]?.payload?.d}</div><div style={{color:"#e6af3c",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>{typeof payload[0].value==="number"&&payload[0].value>1000?payload[0].value.toLocaleString():payload[0].value}</div></div>;
};

function Spark({data,up}:{data:{v:number}[];up:boolean}){
  const c=up?"#22c55e":"#ef4444",vals=data.map(d=>d.v),mn=Math.min(...vals),mx=Math.max(...vals);
  const pts=vals.map((v,i)=>`${(i/(vals.length-1))*80},${28-((v-mn)/(mx-mn||1))*24}`).join(" ");
  return <svg viewBox="0 0 80 28" preserveAspectRatio="none" style={{width:"100%",height:28,display:"block"}}><defs><linearGradient id={`sp${up?1:0}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={.3}/><stop offset="100%" stopColor={c} stopOpacity={0}/></linearGradient></defs><polygon points={`0,28 ${pts} 80,28`} fill={`url(#sp${up?1:0})`}/><polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}

function Counter({end,suffix=""}:{end:number;suffix?:string}){
  const [v,setV]=useState(0);const ref=useRef<HTMLSpanElement>(null);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const step=end/55;const t=setInterval(()=>{s+=step;if(s>=end){setV(end);clearInterval(t);}else setV(Math.floor(s));},16);}});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[end]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

function Gauge({score}:{score:number}){
  const a=-135+(score/100)*270;
  const lbl=score>=75?"Strongly Bullish":score>=55?"Moderately Bullish":score>=45?"Neutral":"Bearish";
  const lc=score>=55?"#22c55e":score>=45?"#e6af3c":"#ef4444";
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><svg viewBox="0 0 220 130" style={{width:220,height:130}}><defs><linearGradient id="ggfin" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444"/><stop offset="50%" stopColor="#e6af3c"/><stop offset="100%" stopColor="#e6af3c"/></linearGradient></defs><path d="M 25 118 A 85 85 0 0 1 195 118" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round"/><path d="M 25 118 A 85 85 0 0 1 195 118" fill="none" stroke="url(#ggfin)" strokeWidth="14" strokeLinecap="round" strokeDasharray="267" strokeDashoffset={267-(score/100)*267} style={{transition:"stroke-dashoffset 1.8s ease"}}/><g transform={`rotate(${a},110,118)`}><line x1="110" y1="118" x2="110" y2="44" stroke="#e6af3c" strokeWidth="2.5" strokeLinecap="round"/><circle cx="110" cy="118" r="5" fill="#e6af3c"/></g><text x="110" y="103" textAnchor="middle" fill="#fff" style={{fontFamily:"'Poppins',sans-serif",fontSize:26,fontWeight:700}}>{score}</text></svg><div style={{fontFamily:"'Poppins',sans-serif",fontStyle:"italic",fontSize:16,color:lc,marginTop:-4,fontWeight:600}}>{lbl}</div></div>;
}

// ── SCROLL HELPER ────────────────────────────────────────────────
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
};

// ── MAIN ─────────────────────────────────────────────────────────
export default function Home() {
  const [assets,setAssets]=useState(ASSETS);
  const [tab,setTab]=useState<"all"|"stocks"|"crypto"|"forex"|"commodities">("all");
  const [nf,setNf]=useState<"All"|"Markets"|"Crypto"|"Forex"|"Commodities">("All");
  const [cs,setCs]=useState<"BTC"|"ETH"|"SPX"|"GOLD"|"NDX">("BTC");
  const [email,setEmail]=useState("");const [done,setDone]=useState(false);
  const [alerts,setAlerts]=useState([
    {id:1,sym:"NVDA",msg:"AI Score 94 — Strong Buy signal triggered",type:"bull",time:"just now",read:false},
    {id:2,sym:"BTC", msg:"$67K resistance broken — momentum building",type:"bull",time:"3m ago", read:false},
    {id:3,sym:"XOM", msg:"Bearish divergence on daily chart",         type:"bear",time:"12m ago",read:true},
  ]);
  const [showA,setShowA]=useState(false);
  const [ap,setAp]=useState<number|null>(null);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    const t=setInterval(()=>{setAssets(p=>p.map(a=>({...a,val:+(a.val*(1+(Math.random()-.499)*.0009)).toFixed(2),chg:+(a.chg+(Math.random()-.499)*.06).toFixed(2)})));},2200);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const unread=alerts.filter(a=>!a.read).length;
  const filtered=tab==="all"?assets:assets.filter(a=>a.cat===tab);
  const fNews=nf==="All"?NEWS_DATA:NEWS_DATA.filter(n=>n.cat===nf);

  const NAV_LINKS = [
    {label:"Markets",    id:"markets"},
    {label:"AI Signals", id:"signals"},
    {label:"News Feed",  id:"news"},
    {label:"Portfolio",  id:"portfolio"},
    {label:"Pricing",    id:"pricing"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --bg:    #0d0d0b;
          --bg2:   #111110;
          --bg3:   #161614;
          --sf:    #1a1917;
          --sf2:   #201f1c;
          --bd:    rgba(230,175,60,0.15);
          --bd2:   rgba(230,175,60,0.30);
          --bd3:   rgba(230,175,60,0.07);
          --gold:  #e6af3c;
          --gold2: #f5c842;
          --gold3: #c99428;
          --green: #22c55e;
          --green2:#4ade80;
          --red:   #ef4444;
          --red2:  #f87171;
          --tx:    #f2f0eb;
          --tx2:   #7a776e;
          --tx3:   #4a4840;
          --glow:  0 0 40px rgba(230,175,60,0.14);
          --glow2: 0 0 80px rgba(230,175,60,0.08);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg2);}::-webkit-scrollbar-thumb{background:var(--gold3);border-radius:2px;}
        .up{color:var(--green)!important;} .dn{color:var(--red)!important;}

        /* ── SUBTLE GLOW BG ── */
        body::before{content:'';position:fixed;inset:0;background:
          radial-gradient(ellipse 70% 45% at 50% -5%,rgba(230,175,60,0.07) 0%,transparent 60%),
          radial-gradient(ellipse 40% 35% at 90% 80%,rgba(200,150,30,0.04) 0%,transparent 60%),
          radial-gradient(ellipse 30% 30% at 5%  60%,rgba(230,175,60,0.03) 0%,transparent 60%);
          pointer-events:none;z-index:0;}

        /* SUBTLE GRID */
        body::after{content:'';position:fixed;inset:0;
          background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:64px 64px;pointer-events:none;z-index:0;}

        /* ── NAV ── */
        nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:66px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;transition:all .3s;}
        nav.scrolled{background:rgba(11,11,9,0.94);backdrop-filter:blur(32px);border-bottom:1px solid var(--bd);}
        .nlogo{display:flex;align-items:center;gap:12px;cursor:pointer;}
        .lic{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#2e2205,#6a4e10);border:1px solid rgba(230,175,60,0.4);display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;font-size:18px;font-weight:900;color:var(--gold);box-shadow:0 0 18px rgba(230,175,60,0.22),inset 0 1px 0 rgba(255,255,255,0.08);}
        .ltx{font-family:'Montserrat',sans-serif;font-weight:800;font-size:17px;color:#fff;}
        .ltx span{color:var(--gold);}
        .nls{display:flex;gap:6px;list-style:none;}
        .nls button{background:none;border:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;cursor:pointer;padding:7px 14px;border-radius:8px;transition:all .2s;letter-spacing:.01em;}
        .nls button:hover{color:#fff;background:rgba(230,175,60,0.08);}
        .nr{display:flex;gap:10px;align-items:center;}
        .bell-wrap{position:relative;}
        .bell{background:rgba(255,255,255,0.04);border:1px solid var(--bd);width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:16px;}
        .bell:hover{border-color:var(--bd2);background:rgba(230,175,60,0.08);}
        .bbadge{position:absolute;top:-4px;right:-4px;background:var(--red);color:#fff;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg);animation:badgePulse 2s ease-in-out infinite;}
        @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.6);}60%{box-shadow:0 0 0 6px rgba(239,68,68,0);}}
        .bsign{background:transparent;border:1px solid var(--bd2);color:var(--tx2);padding:8px 18px;border-radius:8px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;letter-spacing:.03em;}
        .bsign:hover{border-color:var(--gold);color:var(--gold);}
        .bstart{background:var(--gold);border:none;color:#0d0d0b;padding:9px 22px;border-radius:8px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:.03em;box-shadow:0 4px 20px rgba(230,175,60,0.35);}
        .bstart:hover{transform:translateY(-1px);background:var(--gold2);box-shadow:0 8px 32px rgba(230,175,60,0.5);}

        /* ALERTS */
        .adrop{position:absolute;top:48px;right:0;width:340px;background:rgba(13,12,10,0.98);border:1px solid var(--bd2);border-radius:14px;backdrop-filter:blur(28px);z-index:2000;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.8),var(--glow);animation:fdwn .2s ease;}
        @keyframes fdwn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        .ahdr{padding:14px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
        .aitem{padding:13px 18px;border-bottom:1px solid var(--bd3);display:flex;gap:10px;align-items:flex-start;cursor:pointer;transition:background .2s;}
        .aitem:hover{background:rgba(230,175,60,0.04);}
        .aico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
        .abull{background:rgba(34,197,94,.15);}.abear{background:rgba(239,68,68,.15);}
        .udot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:5px;box-shadow:0 0 6px rgba(230,175,60,0.6);}

        /* TICKER */
        .tkb{position:fixed;top:66px;left:0;right:0;z-index:999;height:36px;background:rgba(11,11,9,.95);border-bottom:1px solid var(--bd);overflow:hidden;display:flex;align-items:center;backdrop-filter:blur(16px);}
        .tkt{display:flex;animation:tickroll 32s linear infinite;white-space:nowrap;}
        .ti{display:flex;align-items:center;gap:8px;padding:0 24px;font-size:11px;border-right:1px solid var(--bd3);font-family:'DM Mono',monospace;}
        .tsym{color:var(--tx3);font-weight:500;letter-spacing:.04em;}.tval{color:rgba(255,255,255,.65);}
        @keyframes tickroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}

        /* HERO */
        #hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:120px 48px 80px;}
        .hcon{max-width:1300px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;position:relative;z-index:2;}
        .hbadge{display:inline-flex;align-items:center;gap:8px;background:rgba(230,175,60,0.08);border:1px solid rgba(230,175,60,0.22);border-radius:100px;padding:6px 16px;font-size:11px;color:var(--gold);letter-spacing:.1em;text-transform:uppercase;margin-bottom:24px;}
        .ldot{width:7px;height:7px;background:var(--green);border-radius:50%;animation:ldp 2s ease-in-out infinite;box-shadow:0 0 8px rgba(34,197,94,0.7);}
        @keyframes ldp{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.7);}}
        h1{font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(44px,5.5vw,76px);line-height:.98;letter-spacing:-.04em;margin-bottom:22px;color:#fff;}
        .cyantext{color:var(--gold);font-style:italic;text-shadow:0 0 40px rgba(230,175,60,0.35);}
        .hsub{font-size:16px;line-height:1.8;color:var(--tx2);margin-bottom:40px;max-width:500px;}
        .hbtns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:44px;}
        .bh1{background:var(--gold);border:none;color:#0d0d0b;padding:16px 38px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 4px 40px rgba(230,175,60,0.35);transition:all .3s;letter-spacing:.02em;position:relative;overflow:hidden;}
        .bh1::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);opacity:0;transition:opacity .3s;}
        .bh1:hover{transform:translateY(-3px);background:var(--gold2);box-shadow:0 12px 50px rgba(230,175,60,.55);}.bh1:hover::before{opacity:1;}
        .bh2{background:transparent;border:1px solid rgba(255,255,255,.18);color:var(--tx);padding:16px 38px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .3s;display:flex;align-items:center;gap:8px;}
        .bh2:hover{border-color:var(--gold);color:var(--gold);}
        .htrust{display:flex;align-items:center;gap:16px;}
        .tavs{display:flex;}.tav{width:30px;height:30px;border-radius:50%;border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:var(--sf);color:var(--gold2);}
        .trtx{font-size:12px;color:var(--tx2);line-height:1.55;}.trtx strong{color:#fff;}

        /* HERO CARD */
        .hcard{background:rgba(22,20,16,.8);border:1px solid var(--bd2);border-radius:20px;padding:26px;position:relative;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.7),var(--glow);}
        .hcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(230,175,60,.6),rgba(230,175,60,.2),transparent);}
        .hcard::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top,rgba(230,175,60,.04) 0%,transparent 60%);pointer-events:none;}
        .hcth{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;position:relative;z-index:1;}
        .hctit{font-size:11px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.1em;}
        .lchip{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.28);color:#22c55e;font-size:10px;padding:3px 10px;border-radius:5px;display:flex;align-items:center;gap:5px;letter-spacing:.06em;}
        .mg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;position:relative;z-index:1;}
        .mc{background:rgba(0,0,0,.35);border:1px solid var(--bd3);border-radius:10px;padding:12px 10px;transition:border-color .2s;}
        .mc:hover{border-color:var(--bd);}
        .mcn{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
        .mcv{font-family:'DM Mono',monospace;font-size:16px;margin-bottom:3px;}
        .mcc{font-size:11px;font-weight:600;}
        .aisb{background:rgba(230,175,60,.05);border:1px solid var(--bd);border-radius:12px;padding:14px;display:flex;gap:12px;margin-bottom:16px;position:relative;z-index:1;}
        .aisi{width:36px;height:36px;background:linear-gradient(135deg,#3a2c08,#7a5c10);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;border:1px solid rgba(230,175,60,.25);box-shadow:0 0 14px rgba(230,175,60,.15);}
        .aisl{font-size:10px;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px;}
        .aist{font-size:12px;color:var(--tx2);line-height:1.5;}.aist strong{color:#fff;}
        .hcf{display:flex;justify-content:space-between;padding-top:14px;border-top:1px solid var(--bd3);position:relative;z-index:1;}
        .hs .hsn{font-family:'Montserrat',sans-serif;font-size:19px;font-weight:900;color:var(--gold);text-shadow:0 0 20px rgba(230,175,60,.35);}
        .hs .hsl{font-size:10px;color:var(--tx3);margin-top:2px;letter-spacing:.06em;}

        /* STATS */
        .ststrip{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:#0f0e0c;padding:28px 48px;position:relative;z-index:1;}
        .stinner{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
        .stbox{text-align:center;padding:8px;}
        .stnum{font-family:'Montserrat',sans-serif;font-size:38px;font-weight:900;color:var(--gold);line-height:1;margin-bottom:6px;letter-spacing:-.03em;text-shadow:0 0 30px rgba(230,175,60,.25);}
        .stlbl{font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;}

        /* SECTIONS */
        .sec{max-width:1300px;margin:0 auto;padding:80px 48px;position:relative;z-index:1;}
        .sbadge{display:inline-flex;align-items:center;gap:8px;font-size:11px;color:var(--gold);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;}
        .sbadge::before{content:'';display:block;width:22px;height:1px;background:var(--gold);box-shadow:0 0 8px rgba(230,175,60,.5);}
        .stit{font-family:'Montserrat',sans-serif;font-size:clamp(28px,3vw,46px);font-weight:900;letter-spacing:-.035em;line-height:1.06;margin-bottom:12px;color:#fff;}
        .stit .cy{color:var(--gold);text-shadow:0 0 30px rgba(230,175,60,.25);}
        .ssub{font-size:14px;color:var(--tx2);line-height:1.75;max-width:540px;}

        /* CHARTS */
        .cmain{background:var(--sf);border:1px solid var(--bd);border-radius:18px;padding:24px;position:relative;overflow:hidden;}
        .cmain::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(230,175,60,.5),rgba(230,175,60,.15),transparent);}
        .ctabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
        .ctab{padding:7px 18px;border-radius:8px;border:1px solid var(--bd3);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
        .ctab.on{background:rgba(230,175,60,.12);color:var(--gold);border-color:var(--bd2);box-shadow:0 0 16px rgba(230,175,60,.1);}
        .ctab:not(.on):hover{border-color:var(--bd);color:var(--tx);}

        /* TABLE */
        .atabs{display:flex;gap:6px;margin-bottom:22px;flex-wrap:wrap;}
        .atab{padding:7px 18px;border-radius:8px;border:1px solid var(--bd3);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
        .atab.on{background:rgba(230,175,60,.09);border-color:var(--bd2);color:var(--gold);}
        .atab:not(.on):hover{border-color:var(--bd);color:var(--tx);}
        .atbl{width:100%;border-collapse:collapse;}
        .atbl th{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.08em;padding:0 16px 14px;text-align:left;border-bottom:1px solid var(--bd);}
        .atbl td{padding:13px 16px;font-size:13px;border-bottom:1px solid var(--bd3);}
        .atbl tr{transition:background .18s;cursor:pointer;}.atbl tr:hover{background:rgba(230,175,60,.03);}
        .sbdg{width:32px;height:32px;border-radius:8px;background:rgba(230,175,60,.09);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--gold);}
        .chgp{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;}
        .chu{background:rgba(34,197,94,.1);color:var(--green);}.chd{background:rgba(239,68,68,.1);color:var(--red);}
        .aibar{display:flex;align-items:center;gap:8px;}.ait{flex:1;height:4px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden;}
        .aif{height:100%;background:linear-gradient(90deg,var(--gold3),var(--gold));border-radius:2px;}
        .wbtn{background:none;border:1px solid var(--bd);color:var(--tx3);padding:5px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;transition:all .2s;}
        .wbtn:hover{border-color:var(--gold);color:var(--gold);}

        /* NEWS */
        .nfilts{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
        .nflt{padding:7px 18px;border-radius:8px;border:1px solid var(--bd3);background:none;color:var(--tx2);font-family:'Poppins',sans-serif;font-size:12px;cursor:pointer;transition:all .2s;}
        .nflt.on{background:rgba(230,175,60,.08);border-color:var(--bd2);color:var(--gold);}
        .nflt:not(.on):hover{border-color:var(--bd2);color:var(--tx);}
        .ngrid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:auto auto;gap:14px;}
        .nc{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:20px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
        .nc:hover{border-color:var(--bd2);transform:translateY(-3px);box-shadow:0 20px 50px rgba(0,0,0,.6),var(--glow);}
        .nc.ft{grid-row:1/3;display:flex;flex-direction:column;justify-content:flex-end;min-height:380px;background:linear-gradient(180deg,rgba(230,175,60,.06) 0%,rgba(11,10,8,.97) 100%);}
        .nc.ft::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(230,175,60,.5),transparent);}
        .hotb{display:inline-flex;align-items:center;gap:5px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:var(--red2);font-size:10px;padding:3px 9px;border-radius:5px;margin-bottom:10px;}
        .ntag{display:inline-block;font-size:10px;letter-spacing:.07em;padding:3px 10px;border-radius:5px;text-transform:uppercase;margin-bottom:11px;}
        .tbull{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:var(--green2);}
        .tbear{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:var(--red2);}
        .tai{background:rgba(230,175,60,.08);border:1px solid rgba(230,175,60,.22);color:var(--gold);}
        .tne{background:rgba(255,255,255,.04);border:1px solid var(--bd3);color:var(--tx2);}
        .twarn{background:rgba(230,175,60,.07);border:1px solid rgba(230,175,60,.2);color:var(--gold2);}
        .ntit{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;line-height:1.4;color:#fff;margin-bottom:10px;}
        .nc.ft .ntit{font-size:19px;}
        .nexc{font-size:12px;color:var(--tx2);line-height:1.65;margin-bottom:12px;}
        .nmeta{font-size:11px;color:var(--tx3);display:flex;gap:12px;}
        .nscore{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--bd3);}
        .nsl{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;}
        .nst{flex:1;height:3px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden;}
        .nsf{height:100%;background:linear-gradient(90deg,var(--gold3),var(--gold));border-radius:2px;}
        .nsn{font-size:11px;color:var(--gold);font-weight:600;}

        /* PICKS */
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px;}
        .pcard{background:var(--sf);border:1px solid var(--bd);border-radius:14px;padding:22px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
        .pcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold3),var(--gold));opacity:0;transition:opacity .25s;}
        .pcard:hover,.pcard.act{border-color:var(--bd2);transform:translateY(-3px);box-shadow:0 20px 50px rgba(0,0,0,.6),var(--glow);}
        .pcard:hover::after,.pcard.act::after{opacity:1;}
        .ptop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
        .psym{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:900;color:#fff;}
        .pnm{font-size:11px;color:var(--tx3);margin-top:2px;}
        .apill{padding:5px 13px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.05em;}
        .asbuy{background:rgba(230,175,60,.12);border:1px solid rgba(230,175,60,.3);color:var(--gold);}
        .abuy{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:var(--green);}
        .asell{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:var(--red);}
        .ahold{background:rgba(255,255,255,.05);border:1px solid var(--bd2);color:var(--tx2);}
        .crow{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
        .cbar{flex:1;height:5px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden;}
        .cfill{height:100%;background:linear-gradient(90deg,var(--gold3),var(--gold));border-radius:3px;box-shadow:0 0 8px rgba(230,175,60,.3);}
        .preason{font-size:12px;color:var(--tx2);line-height:1.6;margin-bottom:14px;}
        .pdg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        .pdb{background:rgba(255,255,255,.03);border:1px solid var(--bd3);border-radius:8px;padding:9px 11px;}
        .pdl{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
        .pdv{font-family:'DM Mono',monospace;font-size:14px;}

        /* HEATMAP */
        .hmbg{border-top:1px solid var(--bd);background:#0f0e0c;padding:80px 48px;position:relative;z-index:1;}
        .hmw{max-width:1300px;margin:0 auto;}
        .hmg{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:36px;}
        .hmc{border-radius:11px;padding:16px 12px;cursor:pointer;transition:all .22s;border:1px solid transparent;min-height:86px;display:flex;flex-direction:column;justify-content:space-between;}
        .hmc:hover{transform:scale(1.06);box-shadow:0 8px 32px rgba(0,0,0,.6);}
        .hmsym{font-family:'Montserrat',sans-serif;font-size:14px;font-weight:900;}
        .hmch{font-size:12px;font-weight:600;margin-top:2px;}

        /* GAUGE */
        .gsec{max-width:1300px;margin:0 auto;padding:80px 48px;display:grid;grid-template-columns:auto 1fr;gap:64px;align-items:center;position:relative;z-index:1;}
        .gcard{background:var(--sf);border:1px solid var(--bd2);border-radius:20px;padding:38px 44px;text-align:center;position:relative;overflow:hidden;box-shadow:var(--glow);}
        .gcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(230,175,60,.55),rgba(230,175,60,.2),transparent);}
        .gcard::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top,rgba(230,175,60,.05) 0%,transparent 60%);pointer-events:none;}
        .sbars{display:flex;flex-direction:column;gap:13px;}
        .sbr{display:flex;align-items:center;gap:14px;}
        .sbn{font-size:12px;color:var(--tx2);width:100px;flex-shrink:0;}
        .sbt{flex:1;height:6px;background:rgba(255,255,255,.04);border-radius:3px;overflow:hidden;}
        .sbf{height:100%;border-radius:3px;transition:width 1.4s ease;}
        .sbp{font-size:12px;color:#fff;width:34px;text-align:right;font-family:'DM Mono',monospace;}

        /* FEATURES */
        .fbg{border-top:1px solid var(--bd);background:#0f0e0c;position:relative;z-index:1;}
        .fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px;}
        .fcard{background:var(--sf);border:1px solid var(--bd);border-radius:16px;padding:28px;transition:all .3s;position:relative;overflow:hidden;}
        .fcard::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top left,rgba(230,175,60,.04) 0%,transparent 50%);opacity:0;transition:opacity .3s;}
        .fcard:hover{border-color:var(--bd2);transform:translateY(-5px);box-shadow:0 20px 60px rgba(0,0,0,.5),var(--glow);}
        .fcard:hover::before{opacity:1;}
        .fico{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,rgba(100,78,10,.3),rgba(230,175,60,.1));border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:18px;box-shadow:0 0 16px rgba(230,175,60,.1);}
        .ftit{font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:9px;}
        .fdesc{font-size:13px;color:var(--tx2);line-height:1.7;}

        /* PRICING */
        #pricing{background:#0f0e0c;border-top:1px solid var(--bd);}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px;}
        .pricing-card{background:var(--sf);border:1px solid var(--bd);border-radius:20px;padding:32px;position:relative;overflow:hidden;transition:all .3s;}
        .pricing-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.5);}
        .pricing-card.popular{border-color:var(--gold);box-shadow:0 0 40px rgba(230,175,60,.15);}
        .pricing-card.popular::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
        .pop-badge{position:absolute;top:16px;right:16px;background:rgba(230,175,60,.12);border:1px solid var(--bd2);color:var(--gold);font-size:10px;font-weight:700;padding:4px 12px;border-radius:100px;letter-spacing:.06em;}
        .p-name{font-family:'Montserrat',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:8px;}
        .p-price{font-family:'Montserrat',sans-serif;font-size:44px;font-weight:900;color:var(--gold);line-height:1;margin-bottom:4px;letter-spacing:-.04em;}
        .p-price span{font-size:18px;color:var(--tx2);}
        .p-sub{font-size:12px;color:var(--tx3);margin-bottom:24px;}
        .p-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
        .p-features li{font-size:13px;color:var(--tx2);display:flex;gap:8px;align-items:flex-start;}
        .p-features li::before{content:'✓';color:var(--gold);font-weight:700;flex-shrink:0;}
        .pbtn{width:100%;padding:13px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:.03em;}
        .pbtn-ghost{background:transparent;border:1px solid var(--bd2);color:var(--tx2);}.pbtn-ghost:hover{border-color:var(--gold);color:var(--gold);}
        .pbtn-fill{background:var(--gold);border:none;color:#0d0d0b;box-shadow:0 4px 20px rgba(230,175,60,.3);}.pbtn-fill:hover{transform:translateY(-1px);background:var(--gold2);box-shadow:0 8px 32px rgba(230,175,60,.45);}

        /* CTA */
        .ctasec{padding:80px 48px;position:relative;z-index:1;}
        .ctacard{max-width:780px;margin:0 auto;background:linear-gradient(135deg,rgba(100,78,10,.14),rgba(230,175,60,.06));border:1px solid var(--bd2);border-radius:24px;padding:64px 56px;text-align:center;position:relative;overflow:hidden;box-shadow:var(--glow);}
        .ctacard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(230,175,60,.6),rgba(230,175,60,.2),transparent);}
        .ctacard::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(230,175,60,.06) 0%,transparent 70%);pointer-events:none;}
        .ctacard h2{font-family:'Montserrat',sans-serif;font-size:clamp(28px,3.2vw,44px);font-weight:900;letter-spacing:-.03em;line-height:1.06;margin-bottom:16px;color:#fff;position:relative;z-index:1;}
        .ctacard p{font-size:14px;color:var(--tx2);line-height:1.75;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;z-index:1;}
        .erow{display:flex;gap:10px;max-width:460px;margin:0 auto;position:relative;z-index:1;}
        .einp{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--bd2);color:#fff;padding:14px 18px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;transition:all .2s;}
        .einp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(230,175,60,.1);}
        .einp::placeholder{color:var(--tx3);}
        .bsub{background:var(--gold);border:none;color:#0d0d0b;padding:14px 26px;border-radius:10px;font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all .25s;white-space:nowrap;box-shadow:0 6px 28px rgba(230,175,60,.3);}
        .bsub:hover{transform:translateY(-1px);background:var(--gold2);box-shadow:0 10px 40px rgba(230,175,60,.45);}
        .fnote{font-size:11px;color:var(--tx3);margin-top:14px;position:relative;z-index:1;}
        .subokk{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--green);font-size:14px;font-weight:600;}

        /* FOOTER */
        footer{background:linear-gradient(180deg,transparent 0%,rgba(9,9,7,1) 100%);border-top:1px solid var(--bd);padding:48px 48px 28px;position:relative;z-index:1;}
        .ftop{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
        .fbrand p{font-size:13px;color:var(--tx2);line-height:1.75;margin-top:14px;max-width:240px;}
        .fcol h4{font-size:13px;font-weight:700;color:#fff;margin-bottom:16px;letter-spacing:.02em;}
        .fcol ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
        .fcol ul a{font-size:12px;color:var(--tx3);text-decoration:none;transition:color .2s;}
        .fcol ul a:hover{color:var(--gold);}
        .socrow{display:flex;gap:10px;margin-top:16px;}
        .sb2{width:36px;height:36px;background:var(--sf);border:1px solid var(--bd);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;transition:all .2s;text-decoration:none;color:var(--tx2);}
        .sb2:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px);box-shadow:0 4px 12px rgba(230,175,60,.15);}
        .fbot{max-width:1300px;margin:0 auto;padding-top:24px;border-top:1px solid var(--bd3);display:flex;align-items:center;justify-content:space-between;}
        .fleg{display:flex;gap:20px;list-style:none;}
        .fleg a{font-size:11px;color:var(--tx3);text-decoration:none;transition:color .2s;}
        .fleg a:hover{color:var(--gold);}

        /* ANIMATIONS */
        @keyframes orbFloat0{0%,100%{transform:translateY(0) translateX(0);}50%{transform:translateY(-14px) translateX(5px);}}
        @keyframes orbFloat1{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @keyframes orbFloat2{0%,100%{transform:translateY(0) translateX(0);}50%{transform:translateY(-18px) translateX(-4px);}}
        @keyframes fu{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        .fu{animation:fu .9s ease both;}
        .d1{animation-delay:.1s;}.d2{animation-delay:.25s;}.d3{animation-delay:.4s;}.d4{animation-delay:.55s;}.d5{animation-delay:.7s;}
        @keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
        .scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(230,175,60,0.06),transparent);animation:scanline 10s linear infinite;pointer-events:none;z-index:1;}

        /* RESPONSIVE */
        @media(max-width:1024px){
          nav{padding:0 20px;}.nls{display:none;}
          #hero{padding:120px 20px 60px;}
          .hcon{grid-template-columns:1fr;}.hcard{display:none;}
          .ststrip{padding:24px 20px;}.stinner{grid-template-columns:repeat(2,1fr);}
          .sec,.hmbg,.ctasec,.ctasec,footer{padding-left:20px;padding-right:20px;}
          .ngrid,.pgrid,.fgrid,.pricing-grid{grid-template-columns:1fr;}
          .nc.ft{grid-row:auto;min-height:220px;}
          .hmg{grid-template-columns:repeat(3,1fr);}
          .gsec{grid-template-columns:1fr;padding:56px 20px;}
          .ftop{grid-template-columns:1fr 1fr;gap:28px;}
          .erow{flex-direction:column;}
          .fbot{flex-direction:column;gap:14px;}
        }

      `}</style>

      {/* Scanline effect */}
      <div className="scanline"/>

      {/* ── NAVBAR ── */}
      <nav className={scrolled?"scrolled":""}>
        <div className="nlogo" onClick={()=>scrollTo("hero")}>
          <div className="lic">P</div>
          <span className="ltx">Pulse<span>Markets</span> AI</span>
        </div>
        <ul className="nls">
          {NAV_LINKS.map(l=>(
            <li key={l.id}><button onClick={()=>scrollTo(l.id)}>{l.label}</button></li>
          ))}
        </ul>
        <div className="nr">
          <div className="bell-wrap">
            <div className="bell" onClick={()=>setShowA(s=>!s)}>
              🔔{unread>0&&<span className="bbadge">{unread}</span>}
            </div>
            {showA&&(
              <div className="adrop">
                <div className="ahdr">
                  <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>Alerts & Signals</span>
                  <button style={{background:"none",border:"none",color:"var(--gold)",fontSize:11,cursor:"pointer"}} onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true})))}>Mark all read</button>
                </div>
                {alerts.map(a=>(
                  <div className="aitem" key={a.id} onClick={()=>setAlerts(p=>p.map(x=>x.id===a.id?{...x,read:true}:x))}>
                    <div className={`aico ${a.type==="bull"?"abull":"abear"}`}>{a.type==="bull"?"📈":"📉"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:700,color:"var(--gold)"}}>{a.sym}</div>
                      <div style={{fontSize:11,color:"var(--tx2)",marginTop:1,lineHeight:1.45}}>{a.msg}</div>
                      <div style={{fontSize:10,color:"var(--tx3)",marginTop:3}}>{a.time}</div>
                    </div>
                    {!a.read&&<div className="udot"/>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="bsign">Sign In</button>
          <button className="bstart">Get Started →</button>
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
      <section id="hero">
        <FloatingOrbs/>
        <div className="hcon">
          <div>
            <div className="hbadge fu d1"><div className="ldot"/>AI-Driven Financial Intelligence</div>
            <h1 className="fu d2">The Future of<br/><span className="cyantext">Market Intelligence</span><br/>is Here.</h1>
            <p className="hsub fu d3">Institutional-grade AI insights for global markets. Real-time signals, predictive analytics, and precision stock picks — built for serious investors.</p>
            <div className="hbtns fu d4">
              <button className="bh1" onClick={()=>scrollTo("markets")}>Start Now →</button>
              <button className="bh2" onClick={()=>scrollTo("signals")}>Explore AI Signals</button>
            </div>
            <div className="htrust fu d5">
              <div className="tavs">
                {["H","A","R","K","S"].map((l,i)=><div className="tav" key={i} style={{marginLeft:i===0?0:-10}}>{l}</div>)}
              </div>
              <div className="trtx"><strong>48,000+</strong> investors trust PulseMarkets AI<br/>for daily intelligence</div>
            </div>
          </div>

          {/* 3D GLOBE */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
            <Globe3D/>
            <div className="hcard" style={{width:"100%",maxWidth:420}}>
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
                    <div style={{marginTop:8}}><Spark data={BTC.slice(-16)} up={a.chg>=0}/></div>
                  </div>
                ))}
              </div>
              <div className="aisb">
                <div className="aisi">⚡</div>
                <div>
                  <div className="aisl">AI Top Signal Today</div>
                  <div className="aist"><strong>NVDA</strong> — AI supercycle intact. Strong buy. Confidence: <strong style={{color:"var(--gold)"}}>94/100</strong></div>
                </div>
              </div>
              <div className="hcf">
                <div className="hs"><div className="hsn">91%</div><div className="hsl">Accuracy</div></div>
                <div style={{width:1,background:"var(--bd)"}}/>
                <div className="hs"><div className="hsn">2.4M</div><div className="hsl">Signals/Day</div></div>
                <div style={{width:1,background:"var(--bd)"}}/>
                <div className="hs"><div className="hsn">&lt;2s</div><div className="hsl">Latency</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ststrip">
        <div className="stinner">
          {[{n:48000,s:"+",l:"Active Investors"},{n:2400000,s:"+",l:"Signals Per Day"},{n:91,s:"%",l:"AI Accuracy Rate"},{n:150,s:"+",l:"Markets Covered"}].map((s,i)=>(
            <div className="stbox" key={i}><div className="stnum"><Counter end={s.n} suffix={s.s}/></div><div className="stlbl">{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ── */}
      <section id="markets">
        <div className="sec">
          <div className="sbadge">AI-Powered Analytics</div>
          <div className="stit">Real-Time <span className="cy">Market Charts</span></div>
          <div className="ssub" style={{marginBottom:28}}>Interactive charts powered by our AI prediction engine — switchable across all major asset classes.</div>
          <Card3D className="cmain">
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
                    <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:34,fontWeight:900,color,textShadow:`0 0 30px ${color}50`}}>{cur>999?cur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):cur.toFixed(2)}</div>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:14,color:isUp?"var(--green)":"var(--red)"}}>{isUp?"▲":"▼"} {Math.abs(parseFloat(pct)).toFixed(2)}% (30 days)</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,color:"var(--tx3)",marginBottom:4}}>AI Prediction</div>
                    <div style={{fontSize:14,fontWeight:700,color:isUp?"var(--cyan)":"var(--red)"}}>{isUp?"📈 Bullish":"📉 Bearish"}</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={d} margin={{top:0,right:0,left:-20,bottom:0}}>
                    <defs><linearGradient id="cgg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={.25}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="d" tick={{fill:"#3a5a80",fontSize:10}} interval={9}/>
                    <YAxis tick={{fill:"#3a5a80",fontSize:10}} domain={["auto","auto"]}/>
                    <Tooltip content={<CTip/>}/>
                    <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill="url(#cgg)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </>;
            })()}
          </Card3D>
          {/* Mini charts */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:14}}>
            {([{label:"S&P 500",sym:"SPX",data:SPX,color:"#22c55e"},{label:"Bitcoin",sym:"BTC",data:BTC,color:"#e6af3c"},{label:"Ethereum",sym:"ETH",data:ETH,color:"#a78bfa"},{label:"Gold",sym:"GOLD",data:GOLD,color:"#f5c842"}] as any[]).map((c,i)=>{
              const cur=c.data[c.data.length-1].v,prev=c.data[0].v,pct=(((cur-prev)/prev)*100).toFixed(2),up=parseFloat(pct)>=0;
              return <Card3D key={i} onClick={()=>setCs(c.sym)} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:12,padding:"14px 14px 10px",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div><div style={{fontSize:10,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{c.label}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:c.color,textShadow:`0 0 12px ${c.color}50`}}>{cur>999?cur.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):cur.toFixed(2)}</div></div>
                  <span style={{fontSize:11,fontWeight:600,color:up?"var(--green)":"var(--red)"}}>{up?"▲":"▼"}{Math.abs(parseFloat(pct)).toFixed(2)}%</span>
                </div>
                <Spark data={c.data.slice(-20)} up={up}/>
              </Card3D>;
            })}
          </div>
        </div>
      </section>

      {/* ── ASSET TABLE ── */}
      <div style={{background:"var(--bg2)",borderTop:"1px solid var(--bd)"}}>
        <div className="sec">
          <div className="sbadge">Global Markets</div>
          <div className="stit">Live <span className="cy">Asset Tracker</span></div>
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
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="sbdg">{a.sym.slice(0,3)}</div><div><div style={{fontWeight:600,color:"#fff",fontSize:13}}>{a.name}</div><div style={{fontSize:10,color:"var(--tx3)",marginTop:1}}>{a.sym}</div></div></div></td>
                  <td style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:"rgba(255,255,255,.85)"}}>{a.val>999?a.val.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):a.val.toFixed(a.val<10?4:2)}</td>
                  <td><span className={`chgp ${a.chg>=0?"chu":"chd"} ${a.chg>=0?"up":"dn"}`}>{a.chg>=0?"▲":"▼"} {Math.abs(a.chg).toFixed(2)}%</span></td>
                  <td style={{width:90}}><Spark data={SPX.slice(-16)} up={a.chg>=0}/></td>
                  <td style={{color:"var(--tx3)",fontSize:12}}>{a.vol}</td>
                  <td style={{color:"var(--tx3)",fontSize:12}}>{a.mkt}</td>
                  <td><div className="aibar"><div className="ait"><div className="aif" style={{width:`${a.ai}%`}}/></div><span style={{fontSize:11,color:"var(--gold)",width:28,fontWeight:600}}>{a.ai}</span></div></td>
                  <td style={{textAlign:"right"}}><button className="wbtn">+ Watch</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── NEWS ── */}
      <section id="news">
        <div className="sec">
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:24}}>
            <div><div className="sbadge">Live Intelligence</div><div className="stit">Global <span className="cy">News Feed</span></div></div>
            <a href="#" style={{fontSize:12,color:"var(--gold)",textDecoration:"none"}}>View All →</a>
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
                  {i===0&&<div className="nexc">Markets responding strongly to the latest Fed communication. Our AI models indicate a high-probability continuation of the bullish trend across technology and growth sectors.</div>}
                  <div className="nmeta"><span>📡 {n.src}</span><span>{n.time} ago</span></div>
                </div>
                <div className="nscore">
                  <span className="nsl">AI Score</span>
                  <div className="nst"><div className="nsf" style={{width:`${n.score}%`}}/></div>
                  <span className="nsn">{n.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PICKS ── */}
      <section id="signals" style={{background:"var(--bg2)",borderTop:"1px solid var(--bd)"}}>
        <div className="sec">
          <div className="sbadge">AI Signal Engine</div>
          <div className="stit">Today&apos;s <span className="cy">AI Picks</span></div>
          <div className="ssub">Precision signals from our proprietary model. Entry, target, stop-loss and risk — updated continuously.</div>
          <div className="pgrid">
            {AI_PICKS.map((p,i)=>(
              <Card3D key={i} className={`pcard ${ap===i?"act":""}`} onClick={()=>setAp(ap===i?null:i)} style={{cursor:"pointer"}}>
                <div className="ptop">
                  <div><div className="psym">{p.sym}</div><div className="pnm">{p.name}</div></div>
                  <span className={`apill ${p.act==="STRONG BUY"?"asbuy":p.act==="BUY"?"abuy":p.act==="SELL"?"asell":"ahold"}`}>{p.act}</span>
                </div>
                <div className="crow">
                  <span style={{fontSize:11,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>Confidence</span>
                  <div className="cbar"><div className="cfill" style={{width:`${p.score}%`}}/></div>
                  <span style={{fontSize:12,color:"var(--gold)",fontWeight:700,width:28}}>{p.score}</span>
                </div>
                <div className="preason">{p.reason}</div>
                <div className="pdg">
                  <div className="pdb"><div className="pdl">Entry</div><div className="pdv up">{p.entry}</div></div>
                  <div className="pdb"><div className="pdl">Target</div><div className="pdv" style={{color:"var(--gold)"}}>{p.target}</div></div>
                  <div className="pdb"><div className="pdl">Stop</div><div className="pdv dn">{p.stop}</div></div>
                  <div className="pdb"><div className="pdl">Sector</div><div className="pdv" style={{fontSize:12,color:"var(--tx2)"}}>{p.sector}</div></div>
                  <div className="pdb"><div className="pdl">Timeframe</div><div className="pdv" style={{fontSize:11,color:"var(--tx2)"}}>{p.tf}</div></div>
                  <div className="pdb"><div className="pdl">Risk</div><div className={`pdv ${p.risk==="Low"?"up":p.risk==="High"?"dn":""}`} style={{fontSize:12}}>{p.risk}</div></div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEATMAP ── */}
      <div className="hmbg">
        <div className="hmw">
          <div className="sbadge">Market Pulse</div>
          <div className="stit">S&P 500 <span className="cy">Heatmap</span></div>
          <div className="hmg">
            {HEATMAP.map((h,i)=>{
              const it=Math.min(Math.abs(h.chg)/5,1);
              const bg=h.chg>=0?`rgba(0,230,118,${.08+it*.28})`:`rgba(255,82,82,${.08+it*.28})`;
              const bd=h.chg>=0?`rgba(0,230,118,${.18+it*.3})`:`rgba(255,82,82,${.18+it*.3})`;
              return <div key={i} className="hmc" style={{background:bg,borderColor:bd}}>
                <div className="hmsym" style={{color:h.chg>=0?"var(--green)":"var(--red)"}}>{h.sym}</div>
                <div className={`hmch ${h.chg>=0?"up":"dn"}`}>{h.chg>=0?"▲":"▼"}{Math.abs(h.chg).toFixed(2)}%</div>
              </div>;
            })}
          </div>
          <div style={{marginTop:18,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:14,padding:"18px 18px 6px"}}>
            <div style={{fontSize:11,color:"var(--tx2)",fontWeight:600,marginBottom:14,textTransform:"uppercase",letterSpacing:".06em"}}>Market Volume — Billions USD</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={VOL_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis dataKey="d" tick={{fill:"#3a5a80",fontSize:10}}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:10}}/>
                <Tooltip content={<CTip/>}/>
                <Bar dataKey="v" radius={[4,4,0,0]}>
                  {VOL_DATA.map((d,i)=><Cell key={i} fill={d.up?"rgba(0,230,118,.65)":"rgba(255,82,82,.65)"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── SENTIMENT ── */}
      <div className="gsec">
        <div className="gcard">
          <div style={{fontSize:11,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>Overall Sentiment</div>
          <Gauge score={73}/>
          <div style={{marginTop:14,fontSize:11,color:"var(--tx3)"}}>Updated 2 minutes ago</div>
        </div>
        <div>
          <div className="sbadge">AI Sentiment Engine</div>
          <div className="stit">Real-Time <span className="cy">Market Mood</span></div>
          <p className="ssub" style={{marginBottom:28}}>Our AI aggregates signals from global news, options flow, institutional positioning, and social data — updated every 60 seconds.</p>
          <div className="sbars">
            {[{n:"Technology",p:88,c:"#e6af3c"},{n:"Crypto",p:82,c:"#a78bfa"},{n:"Healthcare",p:61,c:"#22c55e"},{n:"Finance",p:65,c:"#60a5fa"},{n:"Energy",p:34,c:"#ef4444"},{n:"Consumer",p:52,c:"#f5c842"},{n:"Real Estate",p:41,c:"#fb923c"}].map((s,i)=>(
              <div className="sbr" key={i}>
                <span className="sbn">{s.n}</span>
                <div className="sbt"><div className="sbf" style={{width:`${s.p}%`,background:s.c,boxShadow:`0 0 8px ${s.c}40`}}/></div>
                <span className="sbp">{s.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="fbg">
        <div className="sec">
          <div className="sbadge">Platform Features</div>
          <div className="stit">Why <span className="cy">PulseMarkets AI</span></div>
          <div className="fgrid">
            {[
              {ico:"🧠",t:"AI Signal Engine",        d:"Proprietary models trained on decades of market data. Detects patterns before headlines break — updated in real-time, 24/7 globally."},
              {ico:"📡",t:"Live News Intelligence",   d:"We surface only market-moving stories from Bloomberg, Reuters, CNBC — AI-scored by relevance, sentiment and potential market impact."},
              {ico:"⚡",t:"Real-Time Alerts",         d:"Instant push notifications when AI detects significant momentum shifts, sentiment changes, or unusual institutional flow data."},
              {ico:"📊",t:"Interactive 3D Charts",    d:"Professional-grade charting with AI overlay predictions, support/resistance levels, and automated pattern recognition."},
              {ico:"🎯",t:"Precision AI Picks",       d:"Daily curated picks with clear entry, target and stop-loss. Backed by quantitative reasoning and backtested over 10+ years."},
              {ico:"🔒",t:"Bank-Grade Security",      d:"Read-only market data — we never touch your brokerage. End-to-end encrypted. SOC2 compliant. GDPR ready. Never sold to third parties."},
            ].map((f,i)=>(
              <Card3D key={i} className="fcard">
                <div className="fico">{f.ico}</div>
                <div className="ftit">{f.t}</div>
                <div className="fdesc">{f.d}</div>
              </Card3D>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <section id="pricing">
        <div className="sec">
          <div className="sbadge">Simple Pricing</div>
          <div className="stit">Choose your <span className="cy">Intelligence Plan</span></div>
          <div className="ssub">Start free — upgrade when you&apos;re ready. No hidden fees. Cancel anytime.</div>
          <div className="pricing-grid">
            {[
              {name:"Starter",price:"Free",sub:"Forever free",popular:false,features:["5 AI signals per day","Basic market data","News feed (delayed)","Email alerts","Community access"],btn:"Start Free",btnStyle:"pbtn-ghost"},
              {name:"Pro",price:"$29",sub:"per month",popular:true,features:["Unlimited AI signals","Real-time market data","Live news intelligence","Priority alerts","AI picks with entry/target","Portfolio tracker","Advanced charts","Sector sentiment"],btn:"Get Pro Now",btnStyle:"pbtn-fill"},
              {name:"Institutional",price:"$99",sub:"per month",popular:false,features:["Everything in Pro","API access","Custom AI model","Dedicated account manager","White-label reports","Team collaboration","Historical backtesting","Priority support"],btn:"Contact Sales",btnStyle:"pbtn-ghost"},
            ].map((p,i)=>(
              <Card3D key={i} className={`pricing-card ${p.popular?"popular":""}`}>
                {p.popular&&<span className="pop-badge">MOST POPULAR</span>}
                <div className="p-name">{p.name}</div>
                <div className="p-price">{p.price}{p.price!=="Free"&&<span>/mo</span>}</div>
                <div className="p-sub">{p.sub}</div>
                <ul className="p-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
                <button className={`pbtn ${p.btnStyle}`}>{p.btn}</button>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      <section id="portfolio" style={{borderTop:"1px solid var(--bd)"}}>
        <div className="sec">
          <div className="sbadge">Portfolio Intelligence</div>
          <div className="stit">Track your <span className="cy">Investments</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:32}}>
            {[
              {l:"Total Value",  v:"$127,420", c:"+27.4%",  up:true, icon:"💼"},
              {l:"Today's P&L",  v:"+$1,840",  c:"+1.46%",  up:true, icon:"📈"},
              {l:"Best Pick",    v:"NVDA",      c:"+44%",    up:true, icon:"🏆"},
              {l:"AI Score Avg", v:"82/100",    c:"Bullish", up:true, icon:"🧠"},
            ].map((s,i)=>(
              <Card3D key={i} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:14,padding:20}}>
                <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:11,color:"var(--tx3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>{s.l}</div>
                <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:4}}>{s.v}</div>
                <div style={{fontSize:12,fontWeight:600,color:s.up?"var(--green)":"var(--red)"}}>{s.c}</div>
              </Card3D>
            ))}
          </div>
          <div style={{marginTop:16,background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:18,padding:24}}>
            <div style={{fontSize:12,color:"var(--tx2)",fontWeight:600,marginBottom:16,textTransform:"uppercase",letterSpacing:".06em"}}>Portfolio Performance (60 days)</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={gen(100000,60,1200)} margin={{top:0,right:0,left:-20,bottom:0}}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e6af3c" stopOpacity={.2}/><stop offset="95%" stopColor="#e6af3c" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="d" tick={{fill:"#3a5a80",fontSize:9}} interval={10}/>
                <YAxis tick={{fill:"#3a5a80",fontSize:9}}/>
                <Tooltip content={<CTip/>}/>
                <Area type="monotone" dataKey="v" stroke="#e6af3c" strokeWidth={2} fill="url(#pg)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="ctasec">
        <div className="ctacard">
          <h2>Get <span className="cyantext">AI Intelligence</span><br/>delivered daily</h2>
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
            <p>Institutional-grade AI financial intelligence. Real-time signals, global news, and precision analytics for the modern investor.</p>
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
