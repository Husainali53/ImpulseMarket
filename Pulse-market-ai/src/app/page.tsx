<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pulse Markets AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #080a0f;
    --bg2: #0d1018;
    --bg3: #111520;
    --surface: #151b28;
    --border: rgba(255,255,255,0.07);
    --gold: #c9a84c;
    --gold2: #f0cc6e;
    --green: #22d67a;
    --red: #f05454;
    --text: #e8eaf0;
    --muted: #6b7280;
    --dim: #9ca3af;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1000;
    opacity: 0.6;
  }

  /* ── GRID BACKGROUND ── */
  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }

  /* ── GLOW ORBS ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    animation: drift 12s ease-in-out infinite alternate;
  }
  .orb1 { width: 600px; height: 600px; background: rgba(201,168,76,0.06); top: -200px; right: -100px; }
  .orb2 { width: 400px; height: 400px; background: rgba(34,214,122,0.04); bottom: 0; left: -100px; animation-delay: -6s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px, 40px) scale(1.1); }
  }

  /* ── NAV ── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 40px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(8,10,15,0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 16px;
    color: #080a0f;
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .logo-text span { color: var(--gold); }

  nav .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }

  nav .nav-links a {
    color: var(--dim);
    text-decoration: none;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  nav .nav-links a:hover { color: var(--text); }

  .nav-cta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-ghost {
    background: none;
    border: 1px solid var(--border);
    color: var(--dim);
    padding: 8px 18px;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

  .btn-primary {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none;
    color: #080a0f;
    padding: 9px 20px;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── TICKER STRIP ── */
  .ticker-strip {
    position: fixed;
    top: 72px; left: 0; right: 0;
    z-index: 99;
    height: 36px;
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .ticker-inner {
    display: flex;
    gap: 0;
    animation: ticker 28s linear infinite;
    white-space: nowrap;
  }

  .tick-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 32px;
    font-size: 11px;
    letter-spacing: 0.04em;
    border-right: 1px solid var(--border);
  }

  .tick-name { color: var(--dim); }
  .tick-val { color: var(--text); font-weight: 500; }
  .tick-up { color: var(--green); }
  .tick-dn { color: var(--red); }

  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── HERO ── */
  .hero {
    padding: 200px 40px 100px;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .hero-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 11px;
    color: var(--gold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  .hero-label::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(42px, 5vw, 68px);
    line-height: 1.02;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
  }

  .hero h1 em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    color: var(--gold);
  }

  .hero p {
    font-size: 15px;
    line-height: 1.7;
    color: var(--dim);
    margin-bottom: 40px;
    max-width: 440px;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .btn-hero {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none;
    color: #080a0f;
    padding: 14px 32px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 40px rgba(201,168,76,0.3);
  }
  .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(201,168,76,0.4); }

  .btn-hero-outline {
    background: none;
    border: 1px solid rgba(255,255,255,0.12);
    color: var(--text);
    padding: 14px 32px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-hero-outline:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.04); }

  /* ── HERO DASHBOARD WIDGET ── */
  .hero-widget {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .hero-widget::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .widget-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--dim);
    text-transform: uppercase;
  }

  .ai-badge {
    background: rgba(34,214,122,0.1);
    border: 1px solid rgba(34,214,122,0.2);
    color: var(--green);
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 3px 10px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .market-cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .m-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 12px;
    transition: border-color 0.2s;
  }
  .m-card:hover { border-color: rgba(201,168,76,0.3); }

  .m-card-name {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .m-card-val {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }

  .m-card-chg { font-size: 11px; font-weight: 500; }
  .up { color: var(--green); }
  .dn { color: var(--red); }

  /* mini spark */
  .spark { margin-top: 10px; }
  .spark svg { width: 100%; height: 32px; display: block; }

  /* AI pick */
  .ai-pick {
    background: rgba(201,168,76,0.06);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .ai-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    color: #080a0f;
  }

  .ai-pick-content { flex: 1; }
  .ai-pick-label { font-size: 10px; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .ai-pick-text { font-size: 12px; color: var(--dim); line-height: 1.5; }
  .ai-pick-text strong { color: var(--text); }

  /* ── STATS BAR ── */
  .stats-bar {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    padding: 28px 40px;
  }

  .stats-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }

  .stat-item { text-align: center; }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: var(--gold);
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 8px;
  }

  .stat-label { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

  /* ── SECTION ── */
  section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px;
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--gold);
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  .section-title em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    color: var(--gold);
  }

  .section-sub {
    font-size: 14px;
    color: var(--dim);
    line-height: 1.7;
    max-width: 520px;
  }

  /* ── NEWS GRID ── */
  .news-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .view-all {
    font-size: 12px;
    color: var(--gold);
    text-decoration: none;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.2s;
  }
  .view-all:hover { gap: 10px; }

  .news-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
  }

  .news-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }

  .news-card:hover {
    border-color: rgba(201,168,76,0.25);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  }

  .news-card.featured {
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 360px;
    background: linear-gradient(180deg, var(--bg3) 0%, rgba(8,10,15,0.95) 100%);
    background-image: linear-gradient(180deg, transparent 30%, rgba(8,10,15,0.97) 100%);
  }

  .news-card.featured::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
  }

  .news-tag {
    display: inline-block;
    background: rgba(34,214,122,0.1);
    border: 1px solid rgba(34,214,122,0.2);
    color: var(--green);
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 3px 10px;
    border-radius: 4px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .news-tag.bullish { background: rgba(34,214,122,0.1); border-color: rgba(34,214,122,0.2); color: var(--green); }
  .news-tag.bearish { background: rgba(240,84,84,0.1); border-color: rgba(240,84,84,0.2); color: var(--red); }
  .news-tag.neutral { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.2); color: var(--gold); }

  .news-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.35;
    color: var(--text);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .news-card.featured .news-title { font-size: 22px; }

  .news-meta {
    font-size: 11px;
    color: var(--muted);
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .news-meta span { display: flex; align-items: center; gap: 4px; }
  .news-excerpt {
    font-size: 12px;
    color: var(--dim);
    line-height: 1.6;
    margin-bottom: 16px;
    margin-top: 8px;
  }

  .ai-score {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .ai-score-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }

  .score-bar {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--green));
    border-radius: 2px;
    transition: width 1s ease;
  }

  .score-num { font-size: 11px; color: var(--gold); }

  /* ── FEATURES ── */
  .features-section {
    background: var(--bg2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .features-section section {
    padding: 80px 40px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 56px;
  }

  .feat-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    transition: all 0.25s;
  }

  .feat-card:hover {
    border-color: rgba(201,168,76,0.2);
    transform: translateY(-4px);
  }

  .feat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .feat-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--text);
  }

  .feat-desc { font-size: 13px; color: var(--dim); line-height: 1.7; }

  /* ── CTA SECTION ── */
  .cta-section {
    padding: 100px 40px;
  }

  .cta-inner {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-glow {
    position: relative;
    background: var(--surface);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 24px;
    padding: 64px 56px;
    overflow: hidden;
  }

  .cta-glow::before {
    content: '';
    position: absolute;
    top: -60px; left: 50%; transform: translateX(-50%);
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .cta-glow h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3.5vw, 44px);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
    line-height: 1.1;
  }

  .cta-glow h2 em {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    color: var(--gold);
  }

  .cta-glow p { font-size: 14px; color: var(--dim); line-height: 1.7; margin-bottom: 36px; }

  .email-form {
    display: flex;
    gap: 12px;
    max-width: 440px;
    margin: 0 auto;
  }

  .email-input {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 13px 18px;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .email-input:focus { border-color: rgba(201,168,76,0.4); }
  .email-input::placeholder { color: var(--muted); }

  .email-form button {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none;
    color: #080a0f;
    padding: 13px 24px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.04em;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    box-shadow: 0 4px 24px rgba(201,168,76,0.3);
  }
  .email-form button:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.4); }

  .form-note { font-size: 11px; color: var(--muted); margin-top: 14px; letter-spacing: 0.02em; }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
  }

  footer p { font-size: 11px; color: var(--muted); letter-spacing: 0.04em; }

  footer .footer-links {
    display: flex;
    gap: 28px;
    list-style: none;
  }

  footer .footer-links a {
    font-size: 11px;
    color: var(--muted);
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: color 0.2s;
  }
  footer .footer-links a:hover { color: var(--gold); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-left > * {
    animation: fadeUp 0.8s ease both;
  }
  .hero-left > *:nth-child(1) { animation-delay: 0.1s; }
  .hero-left > *:nth-child(2) { animation-delay: 0.2s; }
  .hero-left > *:nth-child(3) { animation-delay: 0.35s; }
  .hero-left > *:nth-child(4) { animation-delay: 0.5s; }

  .hero-widget { animation: fadeUp 0.8s ease 0.3s both, float 6s ease-in-out 1.2s infinite; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding: 160px 24px 60px; gap: 48px; }
    .hero-widget { display: none; }
    .news-grid { grid-template-columns: 1fr; }
    .news-card.featured { grid-row: auto; min-height: 240px; }
    .features-grid { grid-template-columns: 1fr; }
    .stats-inner { grid-template-columns: repeat(2, 1fr); }
    nav .nav-links { display: none; }
    .email-form { flex-direction: column; }
    footer { flex-direction: column; gap: 20px; text-align: center; }
  }
</style>
</head>
<body>

<div class="grid-bg"></div>
<div class="orb orb1"></div>
<div class="orb orb2"></div>

<!-- NAV -->
<nav>
  <div class="logo">
    <div class="logo-mark">P</div>
    <div class="logo-text">Pulse <span>Markets</span></div>
  </div>
  <ul class="nav-links">
    <li><a href="#">Markets</a></li>
    <li><a href="#">AI Picks</a></li>
    <li><a href="#">Analysis</a></li>
    <li><a href="#">Watchlist</a></li>
    <li><a href="#">Portfolio</a></li>
  </ul>
  <div class="nav-cta">
    <button class="btn-ghost">Sign In</button>
    <button class="btn-primary">Get Pro ↗</button>
  </div>
</nav>

<!-- TICKER STRIP -->
<div class="ticker-strip">
  <div class="ticker-inner">
    <!-- set 1 -->
    <div class="tick-item"><span class="tick-name">S&P 500</span><span class="tick-val">4,783.45</span><span class="tick-up">▲ +1.20%</span></div>
    <div class="tick-item"><span class="tick-name">NASDAQ</span><span class="tick-val">15,123.67</span><span class="tick-up">▲ +0.80%</span></div>
    <div class="tick-item"><span class="tick-name">NIFTY 50</span><span class="tick-val">21,456.30</span><span class="tick-dn">▼ −0.30%</span></div>
    <div class="tick-item"><span class="tick-name">AAPL</span><span class="tick-val">$186.42</span><span class="tick-up">▲ +2.10%</span></div>
    <div class="tick-item"><span class="tick-name">TSLA</span><span class="tick-val">$241.08</span><span class="tick-dn">▼ −1.45%</span></div>
    <div class="tick-item"><span class="tick-name">NVDA</span><span class="tick-val">$621.90</span><span class="tick-up">▲ +4.33%</span></div>
    <div class="tick-item"><span class="tick-name">DOW</span><span class="tick-val">37,440.11</span><span class="tick-up">▲ +0.54%</span></div>
    <div class="tick-item"><span class="tick-name">BTC</span><span class="tick-val">$67,320</span><span class="tick-up">▲ +3.20%</span></div>
    <div class="tick-item"><span class="tick-name">GOLD</span><span class="tick-val">$2,034</span><span class="tick-dn">▼ −0.12%</span></div>
    <!-- set 2 (duplicate for seamless loop) -->
    <div class="tick-item"><span class="tick-name">S&P 500</span><span class="tick-val">4,783.45</span><span class="tick-up">▲ +1.20%</span></div>
    <div class="tick-item"><span class="tick-name">NASDAQ</span><span class="tick-val">15,123.67</span><span class="tick-up">▲ +0.80%</span></div>
    <div class="tick-item"><span class="tick-name">NIFTY 50</span><span class="tick-val">21,456.30</span><span class="tick-dn">▼ −0.30%</span></div>
    <div class="tick-item"><span class="tick-name">AAPL</span><span class="tick-val">$186.42</span><span class="tick-up">▲ +2.10%</span></div>
    <div class="tick-item"><span class="tick-name">TSLA</span><span class="tick-val">$241.08</span><span class="tick-dn">▼ −1.45%</span></div>
    <div class="tick-item"><span class="tick-name">NVDA</span><span class="tick-val">$621.90</span><span class="tick-up">▲ +4.33%</span></div>
    <div class="tick-item"><span class="tick-name">DOW</span><span class="tick-val">37,440.11</span><span class="tick-up">▲ +0.54%</span></div>
    <div class="tick-item"><span class="tick-name">BTC</span><span class="tick-val">$67,320</span><span class="tick-up">▲ +3.20%</span></div>
    <div class="tick-item"><span class="tick-name">GOLD</span><span class="tick-val">$2,034</span><span class="tick-dn">▼ −0.12%</span></div>
  </div>
</div>

<!-- HERO -->
<div class="hero">
  <div class="hero-left">
    <div class="hero-label">Live AI Market Intelligence</div>
    <h1>Markets move fast.<br><em>Move faster.</em></h1>
    <p>Real-time AI analysis, curated stock picks, and expert-grade intelligence — built for investors who refuse to be second.</p>
    <div class="hero-actions">
      <button class="btn-hero">Start Free Trial →</button>
      <button class="btn-hero-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        See How It Works
      </button>
    </div>
  </div>

  <div class="hero-widget">
    <div class="widget-header">
      <span class="widget-title">Market Overview</span>
      <span class="ai-badge">● Live</span>
    </div>

    <div class="market-cards">
      <div class="m-card">
        <div class="m-card-name">S&P 500</div>
        <div class="m-card-val">4,783</div>
        <div class="m-card-chg up">▲ +1.20%</div>
        <div class="spark">
          <svg viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points="0,28 12,22 22,25 32,18 44,14 54,8 64,11 80,4" fill="none" stroke="#22d67a" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="m-card">
        <div class="m-card-name">NASDAQ</div>
        <div class="m-card-val">15,123</div>
        <div class="m-card-chg up">▲ +0.80%</div>
        <div class="spark">
          <svg viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points="0,20 10,22 20,16 30,18 42,12 52,14 66,9 80,6" fill="none" stroke="#22d67a" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="m-card">
        <div class="m-card-name">NIFTY 50</div>
        <div class="m-card-val">21,456</div>
        <div class="m-card-chg dn">▼ −0.30%</div>
        <div class="spark">
          <svg viewBox="0 0 80 32" preserveAspectRatio="none">
            <polyline points="0,10 14,8 26,12 36,10 48,14 58,18 70,22 80,26" fill="none" stroke="#f05454" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="ai-pick">
      <div class="ai-icon">⚡</div>
      <div class="ai-pick-content">
        <div class="ai-pick-label">AI Top Pick Today</div>
        <div class="ai-pick-text"><strong>NVDA</strong> — Earnings beat likely. AI chip demand remains structurally elevated. Sentiment score: <strong style="color:var(--green)">94/100</strong></div>
      </div>
    </div>
  </div>
</div>

<!-- STATS BAR -->
<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-item">
      <div class="stat-num">48K+</div>
      <div class="stat-label">Active Investors</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">2.4M</div>
      <div class="stat-label">Signals Analyzed Daily</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">91%</div>
      <div class="stat-label">AI Accuracy Rate</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">&lt;2s</div>
      <div class="stat-label">Real-Time Latency</div>
    </div>
  </div>
</div>

<!-- NEWS -->
<section>
  <div class="news-header">
    <div>
      <div class="section-label">AI-Curated</div>
      <div class="section-title">Market <em>Intelligence</em></div>
    </div>
    <a href="#" class="view-all">View All Stories →</a>
  </div>

  <div class="news-grid">
    <div class="news-card featured">
      <span class="news-tag bullish">Bullish Signal</span>
      <div class="news-title">Fed holds rates steady as inflation cools — AI models flag historic buying window in tech sector</div>
      <div class="news-excerpt">With CPI printing below expectations for the third consecutive month, quantitative models are detecting the early hallmarks of a sustained rally. Risk-adjusted returns look favorable across large-cap growth.</div>
      <div class="news-meta">
        <span>📡 Reuters · Bloomberg</span>
        <span>2h ago</span>
      </div>
      <div class="ai-score">
        <span class="ai-score-label">AI Confidence</span>
        <div class="score-bar"><div class="score-fill" style="width:88%"></div></div>
        <span class="score-num">88</span>
      </div>
    </div>

    <div class="news-card">
      <span class="news-tag neutral">Watch</span>
      <div class="news-title">NVDA earnings preview: Wall Street expects record data center revenue</div>
      <div class="news-meta"><span>WSJ</span><span>4h ago</span></div>
      <div class="ai-score">
        <span class="ai-score-label">AI Confidence</span>
        <div class="score-bar"><div class="score-fill" style="width:94%"></div></div>
        <span class="score-num">94</span>
      </div>
    </div>

    <div class="news-card">
      <span class="news-tag bearish">Bearish Risk</span>
      <div class="news-title">China manufacturing PMI contracts for second straight month</div>
      <div class="news-meta"><span>FT · CNBC</span><span>5h ago</span></div>
      <div class="ai-score">
        <span class="ai-score-label">AI Confidence</span>
        <div class="score-bar"><div class="score-fill" style="width:76%"></div></div>
        <span class="score-num">76</span>
      </div>
    </div>

    <div class="news-card">
      <span class="news-tag bullish">Opportunity</span>
      <div class="news-title">EV sector rotation: institutional flows suggest contrarian entry point</div>
      <div class="news-meta"><span>Barron's</span><span>6h ago</span></div>
      <div class="ai-score">
        <span class="ai-score-label">AI Confidence</span>
        <div class="score-bar"><div class="score-fill" style="width:81%"></div></div>
        <span class="score-num">81</span>
      </div>
    </div>

    <div class="news-card">
      <span class="news-tag neutral">Macro</span>
      <div class="news-title">Dollar weakens ahead of FOMC minutes — EM currencies rally</div>
      <div class="news-meta"><span>Bloomberg</span><span>7h ago</span></div>
      <div class="ai-score">
        <span class="ai-score-label">AI Confidence</span>
        <div class="score-bar"><div class="score-fill" style="width:69%"></div></div>
        <span class="score-num">69</span>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<div class="features-section">
  <section>
    <div class="section-label">Why Pulse</div>
    <div class="section-title">An unfair <em>advantage</em></div>
    <div class="section-sub">Institutional-grade tools, now accessible to every investor. Our AI processes millions of signals every second so you don't have to.</div>

    <div class="features-grid">
      <div class="feat-card">
        <div class="feat-icon">🧠</div>
        <div class="feat-title">AI Signal Engine</div>
        <div class="feat-desc">Proprietary models trained on decades of market data detect patterns before they become headlines. Updated in real-time, 24/7.</div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">📰</div>
        <div class="feat-title">Curated News Intelligence</div>
        <div class="feat-desc">Stop drowning in noise. We surface only the stories with actual market-moving potential, scored and ranked by AI confidence.</div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">🎯</div>
        <div class="feat-title">Precision Stock Picks</div>
        <div class="feat-desc">Daily curated picks with clear entry/exit signals, sentiment analysis, and risk scores — backed by quantitative reasoning.</div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">⚡</div>
        <div class="feat-title">Real-Time Alerts</div>
        <div class="feat-desc">Get notified the moment our AI detects a significant shift in momentum, news sentiment, or institutional flow data.</div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">📊</div>
        <div class="feat-title">Portfolio Analytics</div>
        <div class="feat-desc">Understand your exposure, risk concentration, and performance attribution with institutional-style portfolio analytics.</div>
      </div>
      <div class="feat-card">
        <div class="feat-icon">🔒</div>
        <div class="feat-title">Bank-Grade Security</div>
        <div class="feat-desc">Read-only market data — we never touch your brokerage. Your data is encrypted, private, and never sold to third parties.</div>
      </div>
    </div>
  </section>
</div>

<!-- CTA -->
<div class="cta-section">
  <div class="cta-inner">
    <div class="cta-glow">
      <h2>Get <em>AI Market Intelligence</em> Daily</h2>
      <p>Join 48,000+ investors receiving AI-curated stock picks, news analysis, and market signals — completely free to start.</p>
      <div class="email-form">
        <input class="email-input" type="email" placeholder="your@email.com" />
        <button>Get Free Access</button>
      </div>
      <div class="form-note">No credit card required. Unsubscribe anytime.</div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <p>© 2026 Pulse Markets AI. Not financial advice.</p>
  <ul class="footer-links">
    <li><a href="#">Privacy</a></li>
    <li><a href="#">Terms</a></li>
    <li><a href="#">Disclaimer</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</footer>

</body>
</html>
