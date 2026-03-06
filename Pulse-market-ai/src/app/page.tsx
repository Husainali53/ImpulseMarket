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
// Indian indices data generators
const NIFTY = gen(22000,60,180); const SENSEX = gen(72000,60,450);

// ── GLOBAL ASSETS ─────────────────────────────────────────────────
const GLOBAL_ASSETS = [
  {sym:"BTC", name:"Bitcoin",       cat:"crypto",       val:67320,   chg:3.20,  vol:"28.4B", mkt:"1.32T", ai:88, currency:"USD"},
  {sym:"ETH", name:"Ethereum",      cat:"crypto",       val:3842,    chg:2.15,  vol:"14.2B", mkt:"461B",  ai:82, currency:"USD"},
  {sym:"NVDA",name:"NVIDIA",        cat:"stocks",       val:621.90,  chg:4.33,  vol:"420M",  mkt:"1.54T", ai:94, currency:"USD"},
  {sym:"AAPL",name:"Apple Inc",     cat:"stocks",       val:186.42,  chg:2.10,  vol:"280M",  mkt:"2.89T", ai:81, currency:"USD"},
  {sym:"MSFT",name:"Microsoft",     cat:"stocks",       val:415.32,  chg:1.85,  vol:"160M",  mkt:"3.09T", ai:90, currency:"USD"},
  {sym:"TSLA",name:"Tesla",         cat:"stocks",       val:241.08,  chg:-1.45, vol:"510M",  mkt:"766B",  ai:61, currency:"USD"},
  {sym:"EUR", name:"EUR/USD",       cat:"forex",        val:1.0842,  chg:0.12,  vol:"6.8T",  mkt:"—",     ai:72, currency:"USD"},
  {sym:"GBP", name:"GBP/USD",       cat:"forex",        val:1.2710,  chg:-0.08, vol:"3.2T",  mkt:"—",     ai:65, currency:"USD"},
  {sym:"XAU", name:"Gold",          cat:"commodities",  val:2034,    chg:-0.12, vol:"142B",  mkt:"—",     ai:70, currency:"USD"},
  {sym:"OIL", name:"Crude Oil WTI", cat:"commodities",  val:78.42,   chg:-0.88, vol:"48B",   mkt:"—",     ai:58, currency:"USD"},
  {sym:"SOL", name:"Solana",        cat:"crypto",       val:142.30,  chg:5.44,  vol:"4.8B",  mkt:"62B",   ai:86, currency:"USD"},
  {sym:"SPX", name:"S&P 500",       cat:"indices",      val:4783.45, chg:1.20,  vol:"3.2B",  mkt:"42T",   ai:85, currency:"USD"},
];

// ── INDIAN ASSETS (NSE/BSE) ────────────────────────────────────────
const INDIAN_ASSETS = [
  {sym:"NIFTY", name:"Nifty 50",           cat:"indices",      val:22450.30, chg:1.45,  vol:"8.2B",  mkt:"—",     ai:87, currency:"INR", exchange:"NSE"},
  {sym:"SENSEX",name:"Sensex",             cat:"indices",      val:73890.50, chg:1.38,  vol:"4.1B",  mkt:"—",     ai:86, currency:"INR", exchange:"BSE"},
  {sym:"RELIANCE",name:"Reliance Industries",cat:"stocks",     val:2450.50,  chg:1.88,  vol:"12.5M", mkt:"16.5T", ai:92, currency:"INR", exchange:"NSE"},
  {sym:"TCS",   name:"Tata Consultancy",   cat:"stocks",       val:3890.75,  chg:-0.32, vol:"2.1M",  mkt:"14.2T", ai:88, currency:"INR", exchange:"NSE"},
  {sym:"HDFCBANK",name:"HDFC Bank",         cat:"stocks",       val:1420.30,  chg:1.32,  vol:"8.7M",  mkt:"8.9T",  ai:85, currency:"INR", exchange:"NSE"},
  {sym:"INFY",  name:"Infosys",            cat:"stocks",       val:1580.20,  chg:1.42,  vol:"5.3M",  mkt:"6.5T",  ai:83, currency:"INR", exchange:"NSE"},
  {sym:"ICICIBANK",name:"ICICI Bank",      cat:"stocks",       val:985.60,   chg:1.59,  vol:"10.2M", mkt:"6.9T",  ai:81, currency:"INR", exchange:"NSE"},
  {sym:"SBIN",  name:"State Bank of India",cat:"stocks",       val:720.45,   chg:-1.13, vol:"15.8M", mkt:"6.4T",  ai:78, currency:"INR", exchange:"NSE"},
  {sym:"BHARTIARTL",name:"Bharti Airtel",  cat:"stocks",       val:1120.80,  chg:2.34,  vol:"4.2M",  mkt:"6.2T",  ai:80, currency:"INR", exchange:"NSE"},
  {sym:"ITC",   name:"ITC Limited",        cat:"stocks",       val:420.15,   chg:0.84,  vol:"9.1M",  mkt:"5.2T",  ai:76, currency:"INR", exchange:"NSE"},
  {sym:"KOTAKBANK",name:"Kotak Mahindra Bank",cat:"stocks",     val:1750.90,  chg:-1.26, vol:"1.8M",  mkt:"3.5T",  ai:74, currency:"INR", exchange:"NSE"},
  {sym:"LT",    name:"Larsen & Toubro",    cat:"stocks",       val:2850.30,  chg:2.34,  vol:"3.2M",  mkt:"4.0T",  ai:82, currency:"INR", exchange:"NSE"},
  {sym:"HINDUNILVR",name:"Hindustan Unilever",cat:"stocks",     val:2350.60,  chg:-0.77, vol:"1.5M",  mkt:"5.5T",  ai:79, currency:"INR", exchange:"NSE"},
  {sym:"AXISBANK",name:"Axis Bank",        cat:"stocks",       val:950.25,   chg:1.37,  vol:"6.7M",  mkt:"2.9T",  ai:77, currency:"INR", exchange:"NSE"},
  {sym:"ASIANPAINT",name:"Asian Paints",   cat:"stocks",       val:3150.40,  chg:-1.43, vol:"0.9M",  mkt:"3.0T",  ai:75, currency:"INR", exchange:"NSE"},
  {sym:"MARUTI",name:"Maruti Suzuki",      cat:"stocks",       val:9850.00,  chg:1.87,  vol:"0.5M",  mkt:"2.9T",  ai:84, currency:"INR", exchange:"NSE"},
  {sym:"SUNPHARMA",name:"Sun Pharma",      cat:"stocks",       val:1420.75,  chg:2.08,  vol:"3.8M",  mkt:"3.4T",  ai:81, currency:"INR", exchange:"NSE"},
  {sym:"TATAMOTORS",name:"Tata Motors",    cat:"stocks",       val:780.50,   chg:4.72,  vol:"25.4M", mkt:"2.6T",  ai:86, currency:"INR", exchange:"NSE"},
  {sym:"ADANIENT",name:"Adani Enterprises",cat:"stocks",      val:2180.30,  chg:-5.23, vol:"8.9M",  mkt:"2.5T",  ai:65, currency:"INR", exchange:"NSE"},
  {sym:"BAJFINANCE",name:"Bajaj Finance",  cat:"stocks",       val:6850.60,  chg:1.87,  vol:"1.2M",  mkt:"4.1T",  ai:87, currency:"INR", exchange:"NSE"},
  {sym:"WIPRO", name:"Wipro",              cat:"stocks",       val:285.40,   chg:2.00,  vol:"8.3M",  mkt:"1.5T",  ai:72, currency:"INR", exchange:"NSE"},
  {sym:"BAJAJFINSV",name:"Bajaj Finserv",  cat:"stocks",       val:1580.20,  chg:1.25,  vol:"1.5M",  mkt:"2.4T",  ai:80, currency:"INR", exchange:"NSE"},
  {sym:"HCLTECH",name:"HCL Technologies",  cat:"stocks",       val:1380.50,  chg:0.95,  vol:"2.8M",  mkt:"3.7T",  ai:78, currency:"INR", exchange:"NSE"},
  {sym:"ONGC",  name:"Oil & Natural Gas",  cat:"stocks",       val:275.30,   chg:-0.45, vol:"12.5M", mkt:"3.5T",  ai:68, currency:"INR", exchange:"NSE"},
];

const NEWS_DATA = [
  {cat:"Markets",tag:"Bullish",title:"Fed signals rate cuts ahead — global tech markets surge to record highs",src:"Bloomberg",time:"2m",score:91,hot:true},
  {cat:"Crypto", tag:"Alert",  title:"Bitcoin breaks $68K resistance — institutional inflows at 3-month peak",src:"CoinDesk",time:"8m", score:88,hot:true},
  {cat:"Markets",tag:"Analysis",title:"NVDA earnings beat: AI demand drives 40% revenue surge quarter-on-quarter",src:"Reuters",time:"15m",score:94,hot:false},
  {cat:"Forex",  tag:"Risk",   title:"Dollar weakens ahead of FOMC minutes — EM currencies rally sharply",src:"FX Street",time:"22m",score:72,hot:false},
  {cat:"Crypto", tag:"Bullish",title:"Ethereum ETF odds rise to 78% — derivatives pricing in significant rally",src:"The Block",time:"44m",score:85,hot:false},
  {cat:"Markets",tag:"Bearish",title:"China PMI contracts second month — global supply chain risk elevated",src:"FT",time:"1h", score:74,hot:false},
  // Indian news
  {cat:"Markets",tag:"Bullish",title:"Nifty hits all-time high as FIIs pump $2B into Indian equities",src:"Economic Times",time:"5m",score:89,hot:true},
  {cat:"Markets",tag:"Analysis",title:"RBI maintains repo rate at 6.5% — banking stocks rally",src:"Business Standard",time:"12m",score:86,hot:false},
];

const AI_PICKS_GLOBAL = [
  {sym:"NVDA",name:"NVIDIA Corp",   act:"STRONG BUY",score:94,entry:"$610",target:"$740",stop:"$570",risk:"Low",   reason:"AI chip supercycle intact. Data center demand structurally elevated.",sector:"Technology",tf:"2–4 wks"},
  {sym:"META",name:"Meta Platforms",act:"BUY",       score:87,entry:"$480",target:"$565",stop:"$452",risk:"Medium",reason:"Ad revenue recovery + AI monetization accelerating rapidly.",sector:"Technology",tf:"3–6 wks"},
  {sym:"MSFT",name:"Microsoft",     act:"BUY",       score:90,entry:"$410",target:"$490",stop:"$388",risk:"Low",   reason:"Copilot ARR growing 60% QoQ. Azure AI compounding at 40%.",sector:"Technology",tf:"4–8 wks"},
  {sym:"SOL", name:"Solana",        act:"BUY",       score:86,entry:"$138",target:"$175",stop:"$122",risk:"Medium",reason:"DeFi TVL at all-time highs. Developer activity outpacing all L1s.",sector:"Crypto",tf:"1–3 wks"},
  {sym:"XOM", name:"Exxon Mobil",   act:"SELL",      score:38,entry:"$102",target:"$88", stop:"$108",risk:"Medium",reason:"China PMI contraction signals energy sector headwinds through Q2.",sector:"Energy",tf:"2–4 wks"},
  {sym:"TSLA",name:"Tesla Inc",     act:"HOLD",      score:61,entry:"$241",target:"$268",stop:"$215",risk:"High",  reason:"Margin pressure from price wars. Await Q2 delivery clarity.",sector:"Automotive",tf:"6–8 wks"},
];

const AI_PICKS_INDIAN = [
  {sym:"RELIANCE",name:"Reliance Industries",act:"STRONG BUY",score:92,entry:"₹2,380",target:"₹2,750",stop:"₹2,180",risk:"Low",   reason:"Jio+Retail growth accelerating. 5G monetization ahead of schedule.",sector:"Conglomerate",tf:"4–8 wks"},
  {sym:"TCS",   name:"Tata Consultancy",   act:"BUY",       score:88,entry:"₹3,750",target:"₹4,400",stop:"₹3,450",risk:"Low",   reason:"AI deal pipeline strongest in 5 years. Margins expanding.",sector:"IT Services",tf:"3–6 wks"},
  {sym:"HDFCBANK",name:"HDFC Bank",         act:"BUY",       score:85,entry:"₹1,380",target:"₹1,650",stop:"₹1,250",risk:"Medium",reason:"Merger synergies delivering. Deposit growth reaccelerating.",sector:"Banking",tf:"4–12 wks"},
  {sym:"TATAMOTORS",name:"Tata Motors",     act:"BUY",       score:86,entry:"₹745",  target:"₹950", stop:"₹650",  risk:"Medium",reason:"JLR turnaround + EV momentum. India PV market share gains.",sector:"Automotive",tf:"6–10 wks"},
  {sym:"ADANIENT",name:"Adani Enterprises",act:"SELL",      score:65,entry:"₹2,200",target:"₹1,800",stop:"₹2,450",risk:"High",  reason:"Valuation stretched. Regulatory overhang persists.",sector:"Conglomerate",tf:"2–4 wks"},
  {sym:"SBIN",  name:"State Bank of India",act:"HOLD",      score:78,entry:"₹710",  target:"₹820", stop:"₹640",  risk:"Medium",reason:"PSU rally extended. Await Q4 earnings for re-entry.",sector:"Banking",tf:"4–6 wks"},
];

const HEATMAP_GLOBAL = [
  {sym:"NVDA",chg:4.33},{sym:"META",chg:3.21},{sym:"SOL",chg:5.44},
  {sym:"AAPL",chg:2.10},{sym:"MSFT",chg:1.85},{sym:"GOOGL",chg:0.92},
  {sym:"AMZN",chg:-0.44},{sym:"TSLA",chg:-1.45},{sym:"JPM",chg:-0.88},
  {sym:"XOM",chg:-2.10},{sym:"BTC",chg:3.20},{sym:"ETH",chg:2.15},
];

const HEATMAP_INDIAN = [
  {sym:"RELIANCE",chg:1.88},{sym:"TATAMOTORS",chg:4.72},{sym:"BHARTIARTL",chg:2.34},
  {sym:"LT",chg:2.34},{sym:"TCS",chg:-0.32},{sym:"INFY",chg:1.42},
  {sym:"ICICIBANK",chg:1.59},{sym:"HDFCBANK",chg:1.32},{sym:"MARUTI",chg:1.87},
  {sym:"ADANIENT",chg:-5.23},{sym:"NIFTY",chg:1.45},{sym:"SENSEX",chg:1.38},
];

const VOL_DATA = Array.from({length:14},(_,i)=>({d:`M${i+1}`,v:+(2.5+Math.random()*5.5).toFixed(1),up:Math.random()>0.4}));
const CHART_DATA:{[k:string]:any[]} = {BTC,ETH,SPX,GOLD,NDX,NIFTY,SENSEX};
const CHART_INFO:{[k:string]:{label:string;color:string}} = {
  BTC:{label:"Bitcoin",  color:"#e6af3c"},
  ETH:{label:"Ethereum", color:"#a78bfa"},
  SPX:{label:"S&P 500",  color:"#22c55e"},
  GOLD:{label:"Gold",    color:"#f5c842"},
  NDX:{label:"NASDAQ",   color:"#60a5fa"},
  NIFTY:{label:"Nifty 50", color:"#ff6b35"}, // Indian orange
  SENSEX:{label:"Sensex",  color:"#1e88e5"}, // Indian blue
};

// ── 3D GLOBE ─────────────────────────────────────────────────────
function Globe3D({market = 'global'}: {market?: string}) {
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
    // Market hotspots - different for Indian market
    const hotspots = market === 'indian' ? [
      {lat:19.1,lng:72.8,label:"NSE",val:"+1.45%", primary: true},
      {lat:19.1,lng:72.8,label:"BSE", val:"+1.38%", primary: false},
      {lat:28.6,lng:77.2,label:"Delhi",val:"+1.2%"},
      {lat:12.9,lng:77.6,label:"Bangalore",val:"+0.9%"},
      {lat:22.5,lng:88.3,label:"Kolkata",val:"+0.7%"},
      {lat:13.0,lng:80.2,label:"Chennai",val:"+1.1%"},
    ] : [
      {lat:40.7,lng:-74,label:"NYSE",val:"+1.2%"},
      {lat:51.5,lng:-0.1,label:"LSE", val:"+0.8%"},
      {lat:35.7,lng:139,label:"TSE", val:"-0.3%"},
      {lat:22.3,lng:114,label:"HKEx",val:"+2.1%"},
      {lat:48.9,lng:2.3,label:"EU",  val:"+0.5%"},
      {lat:19.1,lng:72.8,label:"NSE",val:"+1.8%"},
    ];

    // Animated lines between hotspots
    const connections = market === 'indian' 
      ? [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,3]]
      : [[0,1],[1,2],[2,3],[3,4],[0,4],[0,5],[1,5]];
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

      // Outer glow - saffron tint for Indian market
      const grd = ctx.createRadialGradient(cx,cy,R*0.3,cx,cy,R*1.4);
      if (market === 'indian') {
        grd.addColorStop(0,"rgba(255,107,53,0.04)");
        grd.addColorStop(0.7,"rgba(255,107,53,0.08)");
      } else {
        grd.addColorStop(0,"rgba(230,175,60,0.04)");
        grd.addColorStop(0.7,"rgba(80,60,8,0.12)");
      }
      grd.addColorStop(1,"transparent");
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(cx,cy,R*1.5,0,Math.PI*2); ctx.fill();

      // Globe circle
      const globeGrd = ctx.createRadialGradient(cx-40,cy-40,20,cx,cy,R);
      if (market === 'indian') {
        globeGrd.addColorStop(0,"rgba(255,107,53,0.05)");
        globeGrd.addColorStop(0.5,"rgba(30,136,229,0.08)");
      } else {
        globeGrd.addColorStop(0,"rgba(230,175,60,0.05)");
        globeGrd.addColorStop(0.5,"rgba(80,60,8,0.18)");
      }
      globeGrd.addColorStop(1,"rgba(0,10,30,0.3)");
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=globeGrd; ctx.fill();
      ctx.strokeStyle=market==="indian"?"rgba(255,107,53,0.13)":"rgba(230,175,60,0.13)"; 
      ctx.lineWidth=1; ctx.stroke();

      // Grid lines
      ctx.strokeStyle=market==="indian"?"rgba(255,107,53,0.05)":"rgba(230,175,60,0.05)"; 
      ctx.lineWidth=0.5;
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
        ctx.fillStyle=market==="indian"?`rgba(255,107,53,${0.15+brightness*0.5})`:`rgba(230,175,60,${0.15+brightness*0.5})`; 
        ctx.fill();
      });

      // Connections
      connections.forEach(([a,b]) => {
        const pa = drawDot(hotspots[a].lat,hotspots[a].lng,angle);
        const pb = drawDot(hotspots[b].lat,hotspots[b].lng,angle);
        if (!pa.visible||!pb.visible) return;
        ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y);
        const alpha = Math.sin(Date.now()/1000+a)*0.3+0.2;
        ctx.strokeStyle=market==="indian"?`rgba(255,107,53,${alpha})`:`rgba(230,175,60,${alpha})`; 
        ctx.lineWidth=0.8; ctx.stroke();
      });

      // Hotspots
      hotspots.forEach((hs,i) => {
        const p = drawDot(hs.lat,hs.lng,angle);
        if (!p.visible) return;
        const pulse = Math.sin(Date.now()/800+i*1.2)*3;
        // Ring
        ctx.beginPath(); ctx.arc(p.x,p.y,6+pulse,0,Math.PI*2);
        ctx.strokeStyle=market==="indian"?"rgba(255,107,53,0.4)":"rgba(230,175,60,0.4)"; 
        ctx.lineWidth=1; ctx.stroke();
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
      rim.addColorStop(0.5,market==="indian"?"rgba(255,107,53,0.12)":"rgba(230,175,60,0.12)");
      rim.addColorStop(1,"transparent");
      ctx.beginPath(); ctx.arc(cx,cy,R+4,0,Math.PI*2);
      ctx.strokeStyle=rim; ctx.lineWidth=8; ctx.stroke();

      angle = (angle+0.18)%360;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  },[market]);
  return (
    <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,background:market==="indian"?"radial-gradient(circle at center,rgba(255,107,53,0.05) 0%,transparent 70%)":"radial-gradient(circle at center,rgba(230,175,60,0.05) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
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
function FloatingOrbs({market = 'global'}: {market?: string}) {
  const items = market === 'indian' ? [
    {sym:"RELIANCE",val:"+1.88%",color:"#ff6b35"},{sym:"TATAMOTORS",val:"+4.72%",color:"#1e88e5"},
    {sym:"NIFTY",val:"+1.45%",color:"#22c55e"},{sym:"ADANIENT",val:"-5.23%",color:"#ef4444"},
    {sym:"TCS",val:"-0.32%",color:"#a78bfa"},{sym:"HDFCBANK",val:"+1.32%",color:"#e6af3c"},
  ] : [
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
  const [market, setMarket] = useState<'global' | 'indian'>('global');
  const [assets,setAssets]=useState(GLOBAL_ASSETS);
  const [tab,setTab]=useState<"all"|"stocks"|"crypto"|"forex"|"commodities"|"indices">("all");
  const [nf,setNf]=useState<"All"|"Markets"|"Crypto"|"Forex"|"Commodities">("All");
  const [cs,setCs]=useState<"BTC"|"ETH"|"SPX"|"GOLD"|"NDX"|"NIFTY"|"SENSEX">("BTC");
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

  // Update assets when market changes
  useEffect(() => {
    setAssets(market === 'indian' ? INDIAN_ASSETS : GLOBAL_ASSETS);
    // Reset chart selection to appropriate default
    setCs(market === 'indian' ? 'NIFTY' : 'BTC');
  }, [market]);

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
  
  // Filter assets based on category
  const filtered = tab==="all" 
    ? assets 
    : assets.filter(a => a.cat === tab || (tab === 'indices' && (a.sym === 'NIFTY' || a.sym === 'SENSEX' || a.sym === 'SPX')));

  const fNews=nf==="All"?NEWS_DATA:NEWS_DATA.filter(n=>n.cat===nf);
  const currentPicks = market === 'indian' ? AI_PICKS_INDIAN : AI_PICKS_GLOBAL;
  const currentHeatmap = market === 'indian' ? HEATMAP_INDIAN : HEATMAP_GLOBAL;

  const NAV_LINKS = [
    {label:"Markets",    id:"markets"},
    {label:"AI Signals", id:"signals"},
    {label:"News Feed",  id:"news"},
    {label:"Portfolio",  id:"portfolio"},
    {label:"Pricing",    id:"pricing"},
  ];

  // Format currency display
  const formatPrice = (val: number, currency: string) => {
    if (currency === 'INR') {
      return '₹' + val.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    return '$' + (val > 999 ? val.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : val.toFixed(val < 10 ? 4 : 2));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300 ;400;500;600;700;800&family=Montserrat:wght@600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

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
          --indian-saffron: #ff6b35;
          --indian-blue: #1e88e5;
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
        .bsign{background:transparent;border:1px solid var(--bd2);color:var(--tx2);padding:8px 18px;border-radius:8px;font-family:'Poppins',
