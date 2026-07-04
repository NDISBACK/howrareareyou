/**
 * How Rare Are You? — Complete Frontend + API Integration
 *
 * Pages router:  save as  pages/index.jsx
 * App router:    save as  app/page.jsx  and add "use client" as first line
 *
 * .env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000
 */

import { useState, useEffect, useMemo } from "react";
import {
  Sparkles, ArrowRight, RotateCcw, Building2, Palette, Flame,
  Compass, Landmark, Search, Wand2, Radar,
  Gauge, TrendingUp, ChevronDown, Music2, Code2,
  BookOpen, Wrench, GraduationCap, Lightbulb,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */

const API_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

const C = {
  cream:    "#FFFBF3",
  sunshine: "#FFD23F",
  sky:      "#38BDF8",
  pink:     "#FF6FA5",
  lavender: "#9B8CFF",
  mint:     "#2DD4A7",
  orange:   "#FF8A3D",
  ink:      "#3A2E4D",
};

const PALETTE = [C.sky, C.pink, C.sunshine, C.mint, C.lavender, C.orange, C.sky, C.pink];
const INSIGHT_COLORS = [C.sky, C.sunshine, C.pink, C.lavender, C.mint, C.orange];

/* ─────────────────────────────────────────────
   QUESTIONS  (field → maps directly to UserProfile boolean)
───────────────────────────────────────────── */

const QUESTIONS = [
  {
    icon: Code2,
    field: "programming",
    q: "Do you write code?",
    options: [
      { label: "Yes — it's what I live for",      bool: true,  tag: "builder"  },
      { label: "Sometimes, when I need to",        bool: true,  tag: "curious"  },
      { label: "Tried it, didn't really stick",    bool: false, tag: "creative" },
      { label: "Not at all",                       bool: false, tag: "social"   },
    ],
  },
  {
    icon: Music2,
    field: "instrument",
    q: "Do you play a musical instrument?",
    options: [
      { label: "Yes, more than one",               bool: true,  tag: "creative" },
      { label: "Yes, one instrument",              bool: true,  tag: "creative" },
      { label: "Used to, not anymore",             bool: false, tag: "curious"  },
      { label: "No",                               bool: false, tag: "social"   },
    ],
  },
  {
    icon: Gauge,
    field: "gym",
    q: "Do you exercise regularly?",
    options: [
      { label: "Daily — non-negotiable",           bool: true,  tag: "builder"  },
      { label: "A few times a week",               bool: true,  tag: "steady"   },
      { label: "When I feel like it",              bool: false, tag: "curious"  },
      { label: "Not really my thing",              bool: false, tag: "creative" },
    ],
  },
  {
    icon: BookOpen,
    field: "reads_books",
    q: "Do you read books?",
    options: [
      { label: "Always — one on the go",           bool: true,  tag: "curious"  },
      { label: "A few a year",                     bool: true,  tag: "steady"   },
      { label: "Rarely, maybe summaries",          bool: false, tag: "builder"  },
      { label: "Books aren't really my thing",     bool: false, tag: "social"   },
    ],
  },
  {
    icon: Wrench,
    field: "builds_projects",
    q: "Do you build your own projects?",
    options: [
      { label: "Constantly — I can't help myself", bool: true,  tag: "builder"  },
      { label: "Yes, when I have the time",        bool: true,  tag: "builder"  },
      { label: "I have ideas but rarely ship",     bool: false, tag: "curious"  },
      { label: "Not really my thing",              bool: false, tag: "social"   },
    ],
  },
  {
    icon: GraduationCap,
    field: "engineering_student",
    q: "Are you studying or working in engineering / tech?",
    options: [
      { label: "Yes, currently studying",          bool: true,  tag: "builder"  },
      { label: "Yes, I work in the field",         bool: true,  tag: "builder"  },
      { label: "Different field entirely",         bool: false, tag: "creative" },
      { label: "Self-taught, no formal study",     bool: false, tag: "maverick" },
    ],
  },
  {
    icon: Lightbulb,
    field: "entrepreneurship_interest",
    q: "Do you want to build something of your own?",
    options: [
      { label: "Obsessively — it's all I think about", bool: true,  tag: "maverick" },
      { label: "Yes, I'm actively planning",           bool: true,  tag: "builder"  },
      { label: "Maybe someday",                        bool: false, tag: "curious"  },
      { label: "Not really my path",                   bool: false, tag: "steady"   },
    ],
  },
  {
    icon: Wand2,
    field: null,   // personality only — not sent to backend
    q: "A stranger would probably describe you as...",
    options: [
      { label: "Unpredictable", bool: null, tag: "maverick" },
      { label: "Reliable",      bool: null, tag: "steady"   },
      { label: "Curious",       bool: null, tag: "curious"  },
      { label: "Magnetic",      bool: null, tag: "social"   },
    ],
  },
];

/* ─────────────────────────────────────────────
   ARCHETYPES + INSIGHTS
───────────────────────────────────────────── */

const ARCHETYPES = {
  builder:  { name: "Visionary Builder",  icon: Building2, color: C.sky,      blurb: "You don't just imagine the future — you assemble it, one deliberate piece at a time." },
  creative: { name: "Quiet Inventor",     icon: Palette,   color: C.lavender, blurb: "Your ideas arrive fully formed in places nobody else thought to look." },
  maverick: { name: "Wild Catalyst",      icon: Flame,     color: C.orange,   blurb: "Rules are rough drafts to you, and your edit is usually an improvement." },
  wanderer: { name: "Curious Wanderer",   icon: Compass,   color: C.mint,     blurb: "Your map has more pins in it than most people's whole lives." },
  social:   { name: "Social Magnet",      icon: Sparkles,  color: C.pink,     blurb: "People orbit you without quite knowing why — it isn't really teachable." },
  steady:   { name: "Steady Architect",   icon: Landmark,  color: C.sunshine, blurb: "While trends cycle past, you're quietly building things that last." },
  curious:  { name: "Pattern Seeker",     icon: Search,    color: C.sky,      blurb: "You notice the threads connecting things that, to everyone else, look unrelated." },
};

const INSIGHT_POOL = {
  builder:  ["You don't wait for permission to start — you build, and structure follows.", "While others plan the plan, you're already three iterations deep."],
  creative: ["Your mind treats constraints as a prompt, never a wall.", "You see finished things in places where others only see raw material."],
  maverick: ["You'd rather ask forgiveness from a good outcome than permission for a safe one.", "Predictability bores you — and that's rarer than most people admit."],
  wanderer: ["Your curiosity has a passport. Most people's stays home.", "You collect places, languages and perspectives the way others collect routine."],
  social:   ["People remember conversations with you long after they forget what was said.", "You're a connector by instinct — rooms feel different when you walk in."],
  steady:   ["You build things that are still standing once the trend has moved on.", "Consistency, to you, is a creative act — not a limitation."],
  curious:  ["You notice the pattern three steps before anyone else names it.", "Half your best ideas start with 'wait, why does it work that way?'"],
};

const ANALYSIS_STEPS = [
  "Reading your answers...",
  "Mapping behavioral patterns...",
  "Calculating rarity index...",
  "Finding unique trait combinations...",
  "Generating your personality profile...",
  "Predicting your future trajectory...",
];

/* ─────────────────────────────────────────────
   DATA HELPERS
───────────────────────────────────────────── */

// Build the UserProfile object the backend expects
function answersToProfile(answers, intake) {
  const profile = {
    age:     parseInt(intake.age)    || 22,
    country: intake.country?.trim()  || "Unknown",
  };
  QUESTIONS.forEach((q, i) => {
    if (q.field) profile[q.field] = answers[i]?.bool ?? false;
  });
  return profile;
}

// Local fallback used when the API is unreachable
function localFallback(answers) {
  const tagCounts = {};
  answers.forEach((a) => { if (a.tag) tagCounts[a.tag] = (tagCounts[a.tag] || 0) + 1; });
  const topTag = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])[0] ?? "builder";
  const trueCount = answers.filter((a) => a.bool === true).length;
  const score = Math.round((55 + trueCount * 5.7) * 10) / 10;
  const archetype = ARCHETYPES[topTag] ?? ARCHETYPES.builder;
  const insights = (INSIGHT_POOL[topTag] ?? INSIGHT_POOL.builder)
    .map((text, i) => ({ text, color: INSIGHT_COLORS[i % INSIGHT_COLORS.length] }));
  return { score, percentile: Math.round(score * 10), archetype, insights, aiAnalysis: archetype.blurb, futureProjection: null, isFromAPI: false };
}

// Map the raw API response → shape that Results expects
function normalizeResult(apiData, answers) {
  if (!apiData) return localFallback(answers);

  const name  = apiData.archetype ?? "Visionary Builder";
  const key   = Object.keys(ARCHETYPES).find((k) => ARCHETYPES[k].name === name) ?? "builder";
  const base  = ARCHETYPES[key];

  const insights = Array.isArray(apiData.insights)
    ? apiData.insights.map((item, i) => ({
        text:  typeof item === "string" ? item : (item.text ?? String(item)),
        color: INSIGHT_COLORS[i % INSIGHT_COLORS.length],
      }))
    : localFallback(answers).insights;

  const aiAnalysis =
    typeof apiData.ai_analysis === "string"
      ? apiData.ai_analysis
      : apiData.ai_analysis?.analysis ?? apiData.ai_analysis?.text ?? base.blurb;

  return {
    score:            apiData.rarity_score ?? 75,
    percentile:       apiData.percentile   ?? 750,
    archetype:        { ...base, name, blurb: apiData.description ?? base.blurb },
    insights,
    aiAnalysis,
    futureProjection: apiData.future_projection ?? null,
    matchedTraits:    apiData.matched_traits    ?? [],
    isFromAPI:        true,
  };
}

// Parse future_projection regardless of shape (string | object)
function parseFutureProjection(raw, archetype) {
  const defaults = [
    { label: "Today",   text: `You're already operating in the top tier — most people never even start.` },
    { label: "1 Year",  text: "The habits compounding quietly right now start becoming visible to everyone around you." },
    { label: "3 Years", text: `${archetype.name} energy becomes your signature — people begin seeking you out for it.` },
    { label: "5 Years", text: "What once felt like an edge case becomes a category of one: just you." },
  ];
  if (!raw) return defaults;
  if (typeof raw === "string") return [{ label: "Your Path Forward", text: raw }];
  if (typeof raw === "object") {
    const entries = Object.entries(raw).map(([k, v]) => ({
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      text:  String(v),
    }));
    return entries.length ? entries : defaults;
  }
  return defaults;
}

/* ─────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────── */

function useCountUp(target, ms = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    function tick(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .hrau-root    { font-family: 'Manrope', sans-serif; color: ${C.ink}; }
      .hrau-display { font-family: 'Syne', sans-serif; letter-spacing: -0.025em; }

      @keyframes blobA { 0%,100%{ transform:translate(0,0) scale(1); } 33%{ transform:translate(4%,-6%) scale(1.08); } 66%{ transform:translate(-5%,4%) scale(.94); } }
      @keyframes blobB { 0%,100%{ transform:translate(0,0) scale(1); } 40%{ transform:translate(-6%,5%) scale(1.1); } 70%{ transform:translate(5%,-4%) scale(.92); } }
      @keyframes blobC { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(5%,6%) scale(1.06); } }
      @keyframes floatY  { 0%,100%{ transform:translateY(0); }  50%{ transform:translateY(-14px); } }
      @keyframes floatY2 { 0%,100%{ transform:translateY(0) rotate(-2deg); } 50%{ transform:translateY(-10px) rotate(2deg); } }
      @keyframes pulseGlow { 0%,100%{ opacity:.55; transform:scale(1); } 50%{ opacity:1; transform:scale(1.06); } }
      @keyframes spinCW  { to{ transform:rotate(360deg);  } }
      @keyframes spinCCW { to{ transform:rotate(-360deg); } }
      @keyframes fadeUp  { from{ opacity:0; transform:translateY(26px); } to{ opacity:1; transform:translateY(0); } }
      @keyframes popIn   { from{ opacity:0; transform:scale(.86); } to{ opacity:1; transform:scale(1); } }
      @keyframes particle { 0%{ transform:translateY(0); opacity:0; } 10%{opacity:1;} 90%{opacity:1;} 100%{ transform:translateY(-110px); opacity:0; } }

      .anim-fadeUp  { animation: fadeUp  .7s cubic-bezier(.22,1,.36,1) both; }
      .anim-popIn   { animation: popIn   .55s cubic-bezier(.22,1,.36,1) both; }
      .anim-float   { animation: floatY  6s ease-in-out infinite; }
      .anim-float2  { animation: floatY2 7s ease-in-out infinite; }
      .anim-spinCW  { animation: spinCW  14s linear infinite; }
      .anim-spinCCW { animation: spinCCW 18s linear infinite; }
      .anim-pulse   { animation: pulseGlow 3.2s ease-in-out infinite; }

      .glass {
        background: rgba(255,255,255,.48);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255,255,255,.65);
      }
      .glass-strong {
        background: rgba(255,255,255,.7);
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        border: 1px solid rgba(255,255,255,.85);
      }
      .clay {
        box-shadow: 0 1px 1px rgba(58,46,77,.04), 0 8px 20px rgba(58,46,77,.10), inset 0 1px 0 rgba(255,255,255,.6);
      }
      .clay-btn {
        box-shadow: 0 6px 0 rgba(0,0,0,.10), 0 10px 24px rgba(58,46,77,.18);
        transition: transform .15s ease, box-shadow .15s ease;
      }
      .clay-btn:hover  { transform:translateY(-3px); box-shadow: 0 9px 0 rgba(0,0,0,.10), 0 16px 30px rgba(58,46,77,.22); }
      .clay-btn:active { transform:translateY(2px);  box-shadow: 0 3px 0 rgba(0,0,0,.10), 0 6px 14px rgba(58,46,77,.18); }

      .opt-btn { transition: transform .18s ease, box-shadow .18s ease, background .2s ease; }
      .opt-btn:hover  { transform:translateY(-2px) scale(1.01); }
      .opt-btn:active { transform:scale(.98); }

      .intake-input {
        width: 100%; padding: 14px 18px; border-radius: 16px; font-size: 1rem;
        font-family: 'Manrope', sans-serif; font-weight: 600; color: ${C.ink};
        background: rgba(255,255,255,.7); border: 2px solid rgba(155,140,255,.25);
        outline: none; transition: border-color .2s;
      }
      .intake-input:focus { border-color: ${C.lavender}; }
      .intake-input::placeholder { color: #A595B8; font-weight: 500; }
    `}</style>
  );
}

/* ─────────────────────────────────────────────
   BACKGROUND
───────────────────────────────────────────── */

function BlobField({ colors, tint }) {
  const blobs = [
    { top: "-10%", left: "-8%",  size: 420, anim: "blobA", dur: "16s" },
    { top: "8%",   left: "62%",  size: 380, anim: "blobB", dur: "20s" },
    { top: "55%",  left: "-6%",  size: 360, anim: "blobC", dur: "18s" },
    { top: "68%",  left: "58%",  size: 460, anim: "blobA", dur: "22s" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 transition-colors duration-1000" style={{ backgroundColor: tint }} />
      {blobs.map((b, i) => (
        <div key={i} className="absolute rounded-full"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size,
            background: colors[i % colors.length], filter: "blur(72px)", opacity: .42,
            animation: `${b.anim} ${b.dur} ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function Particles({ count = 14 }) {
  const dots = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left:  (i * 137.5) % 100,
    delay: (i * 0.7) % 6,
    dur:   6 + (i % 5),
    size:  4 + (i % 4) * 2,
    color: PALETTE[i % 6],
  })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d, i) => (
        <div key={i} className="absolute rounded-full bottom-0"
          style={{ left: `${d.left}%`, width: d.size, height: d.size,
            background: d.color, animation: `particle ${d.dur}s ease-in ${d.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   RARITY ORB
───────────────────────────────────────────── */

function RarityOrb({ size = 220 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full anim-spinCW"
        style={{ border: `2px dashed ${C.lavender}55` }} />
      <div className="absolute rounded-full anim-spinCCW"
        style={{ inset: size * .08, border: `2px dotted ${C.sky}66` }} />
      <div className="absolute rounded-full anim-pulse"
        style={{ inset: size * .16,
          background: `conic-gradient(from 90deg, ${C.sky}, ${C.pink}, ${C.sunshine}, ${C.mint}, ${C.lavender}, ${C.sky})`,
          filter: "blur(2px)" }} />
      <div className="absolute rounded-full"
        style={{ inset: size * .26,
          background: `radial-gradient(circle at 35% 30%, #fff, ${C.sky} 35%, ${C.lavender} 70%, ${C.pink} 100%)`,
          boxShadow: `0 0 60px ${C.lavender}88, 0 0 100px ${C.sky}55` }} />
      <div className="absolute inset-0 anim-spinCW" style={{ animationDuration: "5s" }}>
        <div className="absolute rounded-full"
          style={{ top: 4, left: "50%", width: 14, height: 14,
            background: C.sunshine, boxShadow: `0 0 12px ${C.sunshine}` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SMALL ATOMS
───────────────────────────────────────────── */

function Pill({ children, color }) {
  return (
    <span className="glass-strong clay inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

function ProgressBar({ index, total }) {
  return (
    <div className="flex gap-2 w-full max-w-md mx-auto">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-2.5 rounded-full overflow-hidden"
          style={{ background: "rgba(58,46,77,.12)" }}>
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: i < index ? "100%" : i === index ? "50%" : "0%",
              background: `linear-gradient(90deg, ${C.sky}, ${C.pink})` }} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTAKE CARD  (age + country before questions)
───────────────────────────────────────────── */

function IntakeCard({ onNext }) {
  const [age,     setAge]     = useState("");
  const [country, setCountry] = useState("");
  const [error,   setError]   = useState("");

  function submit() {
    const n = parseInt(age);
    if (!age || isNaN(n) || n < 10 || n > 100) { setError("Please enter a valid age (10–100)."); return; }
    if (!country.trim())                         { setError("Please enter your country.");          return; }
    onNext({ age, country: country.trim() });
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">
      <BlobField colors={[C.lavender, C.sky, C.pink, C.mint]} tint="#FAF6FF" />
      <Particles count={10} />

      <div className="relative z-10 glass-strong clay rounded-[2rem] p-8 sm:p-12 w-full max-w-md anim-popIn">
        <div className="flex items-center gap-3 mb-2">
          <RarityOrb size={52} />
          <span className="hrau-display font-bold text-xl">Quick intro</span>
        </div>
        <p className="text-sm mb-7" style={{ color: "#5B4B73" }}>
          Two quick things before we start — this helps us place your score.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: C.lavender }}>
              YOUR AGE
            </label>
            <input
              className="intake-input"
              type="number" min="10" max="100"
              placeholder="e.g. 22"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: C.pink }}>
              YOUR COUNTRY
            </label>
            <input
              className="intake-input"
              type="text"
              placeholder="e.g. India"
              value={country}
              onChange={(e) => { setCountry(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium" style={{ color: C.orange }}>{error}</p>
        )}

        <button
          onClick={submit}
          className="clay-btn mt-7 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base hrau-display"
          style={{ background: `linear-gradient(135deg, ${C.sunshine}, ${C.orange})`, color: "#3A2300" }}
        >
          Let's go <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LANDING
───────────────────────────────────────────── */

function Landing({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BlobField colors={[C.sky, C.pink, C.sunshine, C.mint]} tint={C.cream} />
      <Particles />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="anim-fadeUp" style={{ animationDelay: "0s" }}>
          <Pill color={C.orange}><Sparkles size={14} /> A statistical experiment</Pill>
        </div>

        <h1 className="hrau-display font-bold mt-8 leading-[.93] anim-fadeUp"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", animationDelay: ".08s" }}>
          <span style={{ color: C.ink }}>How Rare</span><br />
          <span style={{
            background: `linear-gradient(90deg, ${C.sky}, ${C.pink} 45%, ${C.orange})`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          }}>Are You?</span>
        </h1>

        <p className="mt-7 text-lg sm:text-xl max-w-xl anim-fadeUp"
          style={{ color: "#5B4B73", animationDelay: ".16s" }}>
          Discover how statistically unique your skills, habits, interests
          and ambitions really are — in about ninety seconds.
        </p>

        <button onClick={onStart}
          className="clay-btn anim-fadeUp mt-10 inline-flex items-center gap-3 px-9 py-5 rounded-full font-bold text-lg hrau-display"
          style={{ animationDelay: ".24s", background: `linear-gradient(135deg, ${C.sunshine}, ${C.orange})`, color: "#3A2300" }}>
          Start Analysis <ArrowRight size={20} />
        </button>

        <p className="mt-3 text-sm anim-fadeUp" style={{ color: "#8C7AA3", animationDelay: ".3s" }}>
          8 questions · no sign-up · no data stored
        </p>

        {/* floating teaser cards */}
        <div className="relative w-full mt-20 hidden md:block" style={{ height: 160 }}>
          <div className="glass-strong clay anim-float absolute rounded-3xl px-6 py-4 text-left"
            style={{ left: "4%", top: 0, width: 200 }}>
            <div className="text-3xl font-bold hrau-display" style={{ color: C.sky }}>97.4</div>
            <div className="text-xs font-semibold mt-1" style={{ color: "#5B4B73" }}>RARITY SCORE</div>
          </div>
          <div className="glass-strong clay anim-float2 absolute rounded-3xl px-6 py-4 text-left"
            style={{ right: "6%", top: 16, width: 230 }}>
            <div className="flex items-center gap-2 text-sm font-bold hrau-display" style={{ color: C.pink }}>
              <Flame size={16} /> WILD CATALYST
            </div>
            <div className="text-xs mt-1" style={{ color: "#5B4B73" }}>Your unlocked archetype</div>
          </div>
          <div className="glass-strong clay anim-float absolute rounded-3xl px-5 py-3 text-left"
            style={{ left: "30%", top: 74, width: 230 }}>
            <div className="text-xs font-semibold" style={{ color: "#5B4B73" }}>
              "Only 3.8% of people play multiple instruments 🎻"
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs font-bold tracking-wide" style={{ color: "#8C7AA3" }}>SEE WHAT YOU'LL GET</span>
          <ChevronDown size={18} style={{ color: "#8C7AA3" }} className="anim-float" />
        </div>
      </div>

      {/* preview strip */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-28 grid sm:grid-cols-3 gap-5">
        {[
          { icon: Radar,      color: C.sky,   title: "A rarity score",      text: "A single number placing you against 1,000 other people." },
          { icon: Sparkles,   color: C.pink,  title: "An archetype",        text: "One of seven personality classes, unlocked like a game character." },
          { icon: TrendingUp, color: C.mint,  title: "A future projection", text: "An AI-written look at where your traits might take you." },
        ].map((card, i) => (
          <div key={i} className="glass clay rounded-3xl p-6 text-left anim-fadeUp"
            style={{ animationDelay: `${.1 * i}s` }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${card.color}33`, color: card.color }}>
              <card.icon size={22} />
            </div>
            <div className="font-bold hrau-display text-lg">{card.title}</div>
            <p className="text-sm mt-1.5" style={{ color: "#5B4B73" }}>{card.text}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center pb-10 text-xs" style={{ color: "#A595B8" }}>
        An interactive experiment, made for curious minds ✦ not a real statistical instrument
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUESTION FLOW
───────────────────────────────────────────── */

function QuestionFlow({ onComplete }) {
  const [phase,      setPhase]      = useState("intake"); // "intake" | "questions"
  const [intakeData, setIntakeData] = useState({ age: "", country: "" });
  const [index,      setIndex]      = useState(0);
  const [answers,    setAnswers]    = useState([]);
  const [leaving,    setLeaving]    = useState(false);

  function handleIntake(data) {
    setIntakeData(data);
    setPhase("questions");
  }

  function choose(opt) {
    if (leaving) return;
    setLeaving(true);
    const next = [...answers, opt];
    setTimeout(() => {
      if (index + 1 < QUESTIONS.length) {
        setAnswers(next);
        setIndex(index + 1);
        setLeaving(false);
      } else {
        onComplete(next, intakeData);
      }
    }, 320);
  }

  if (phase === "intake") return <IntakeCard onNext={handleIntake} />;

  const q    = QUESTIONS[index];
  const Icon = q.icon;
  const tint = `${PALETTE[index % PALETTE.length]}12`;

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <BlobField
        colors={[PALETTE[index % 8], PALETTE[(index+2)%8], PALETTE[(index+4)%8], PALETTE[(index+6)%8]]}
        tint={tint}
      />

      <div className="relative z-10 px-6 pt-10">
        <div className="max-w-md mx-auto flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wide" style={{ color: "#8C7AA3" }}>
            QUESTION {index + 1} OF {QUESTIONS.length}
          </span>
          <Pill color={PALETTE[index % 8]}>rarity scan</Pill>
        </div>
        <ProgressBar index={index} total={QUESTIONS.length} />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div key={index} className="w-full max-w-xl"
          style={{
            opacity:    leaving ? 0 : 1,
            transform:  leaving ? "translateY(-12px) scale(.97)" : "translateY(0) scale(1)",
            transition: "opacity .28s ease, transform .28s ease",
            animation:  leaving ? "none" : "popIn .5s cubic-bezier(.22,1,.36,1) both",
          }}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 clay"
              style={{ background: `${PALETTE[index%8]}28`, color: PALETTE[index%8] }}>
              <Icon size={28} />
            </div>
            <h2 className="hrau-display font-bold text-2xl sm:text-3xl max-w-md">{q.q}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => choose(opt)}
                className="opt-btn glass-strong clay rounded-3xl px-6 py-5 text-left font-semibold text-base"
                style={{ color: C.ink }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANALYSIS  (runs the real API call here)
───────────────────────────────────────────── */

function Analysis({ answers, intakeData, onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
    }, 650);

    const profile    = answersToProfile(answers, intakeData);
    const minDelay   = new Promise((res) => setTimeout(res, 650 * ANALYSIS_STEPS.length + 600));

    const apiCall = fetch(`${API_URL}/analyze`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(profile),
    })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(() => null); // null → localFallback inside normalizeResult

    Promise.all([apiCall, minDelay]).then(([apiData]) => {
      clearInterval(stepTimer);
      onDone(normalizeResult(apiData, answers));
    });

    return () => clearInterval(stepTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6">
      <BlobField colors={[C.lavender, C.sky, C.pink, C.mint]} tint="#FAF6FF" />
      <Particles count={20} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <RarityOrb size={230} />
        <h2 className="hrau-display font-bold text-2xl sm:text-3xl mt-10">
          Discovering your personality...
        </h2>

        <div className="mt-7 h-7 relative w-80 max-w-full">
          {ANALYSIS_STEPS.map((s, i) => (
            <div key={i}
              className="absolute inset-0 flex items-center justify-center text-sm font-semibold transition-opacity duration-300"
              style={{ opacity: i === step ? 1 : 0, color: "#6B5A85" }}>
              {s}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-8 w-72 max-w-full">
          {ANALYSIS_STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(58,46,77,.12)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: i <= step ? "100%" : "0%",
                  background: `linear-gradient(90deg, ${C.sky}, ${C.pink})` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULTS
───────────────────────────────────────────── */

function FutureStage({ label, text, color, delay, isLast }) {
  return (
    <div className="flex gap-5 anim-fadeUp" style={{ animationDelay: delay }}>
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full shrink-0"
          style={{ background: color, boxShadow: `0 0 0 6px ${color}22` }} />
        {!isLast && <div className="w-px flex-1" style={{ background: `${color}55` }} />}
      </div>
      <div className="pb-9">
        <div className="text-xs font-bold tracking-wide mb-1" style={{ color }}>{label.toUpperCase()}</div>
        <p className="text-sm sm:text-base" style={{ color: "#4A3D60" }}>{text}</p>
      </div>
    </div>
  );
}

function Results({ result, onRestart }) {
  const { score, percentile, archetype, insights, aiAnalysis, futureProjection, isFromAPI } = result;
  const displayScore = useCountUp(score);
  const ArchIcon     = archetype.icon;
  const stages       = parseFutureProjection(futureProjection, archetype);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <BlobField colors={[archetype.color, C.pink, C.sunshine, C.mint]} tint={C.cream} />
      <Particles count={10} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16">

        {/* ── Hero score card ── */}
        <div className="anim-popIn rounded-[2.5rem] glass-strong clay p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
            style={{ background: `radial-gradient(circle, ${archetype.color}55, transparent 70%)` }} />
          <div className="relative">
            <Pill color={archetype.color}><Sparkles size={14} /> Your rarity score</Pill>
            <div className="hrau-display font-bold mt-6 leading-none"
              style={{ fontSize: "clamp(4.5rem,16vw,8rem)", color: C.ink }}>
              {displayScore.toFixed(1)}
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ color: "#5B4B73" }}>
              Rarer than{" "}
              <span style={{ color: archetype.color }}>{percentile}</span>{" "}
              out of every 1,000 people
            </p>
            {!isFromAPI && (
              <p className="mt-2 text-xs" style={{ color: "#A595B8" }}>
                (Offline estimate — start your API server for a live score)
              </p>
            )}
          </div>
        </div>

        {/* ── Archetype card ── */}
        <div className="anim-fadeUp rounded-[2.5rem] clay p-8 sm:p-10 mt-6 flex items-center gap-6 flex-col sm:flex-row text-center sm:text-left"
          style={{ background: `linear-gradient(135deg, ${archetype.color}24, rgba(255,255,255,.8))`,
            border: "1px solid rgba(255,255,255,.8)", animationDelay: ".08s" }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 clay"
            style={{ background: archetype.color, color: "#fff" }}>
            <ArchIcon size={34} />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide" style={{ color: archetype.color }}>ARCHETYPE UNLOCKED</div>
            <div className="hrau-display font-bold text-2xl sm:text-3xl mt-1">{archetype.name}</div>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "#5B4B73" }}>{archetype.blurb}</p>
          </div>
        </div>

        {/* ── Insights ── */}
        <div className="mt-10">
          <h3 className="hrau-display font-bold text-xl mb-4 px-1">What makes you, you</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {insights.map((ins, i) => (
              <div key={i} className="anim-fadeUp rounded-3xl p-6 clay"
                style={{ background: `${ins.color}1E`, border: `1px solid ${ins.color}44`,
                  animationDelay: `${i * .1}s` }}>
                <p className="font-medium text-sm sm:text-base" style={{ color: C.ink }}>{ins.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Analysis ── */}
        <div className="anim-fadeUp mt-10 rounded-[2rem] glass-strong clay p-8 sm:p-10"
          style={{ animationDelay: ".2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Radar size={18} style={{ color: archetype.color }} />
            <h3 className="hrau-display font-bold text-xl">Your personal analysis</h3>
          </div>
          <p className="leading-relaxed text-[15px] sm:text-base whitespace-pre-line"
            style={{ color: "#4A3D60" }}>
            {aiAnalysis}
          </p>
        </div>

        {/* ── Future projection ── */}
        <div className="anim-fadeUp mt-10" style={{ animationDelay: ".25s" }}>
          <h3 className="hrau-display font-bold text-xl mb-5 px-1">Where this could take you</h3>
          <div className="rounded-[2rem] glass clay p-8">
            {stages.map((s, i) => (
              <FutureStage key={i} label={s.label} text={s.text}
                color={PALETTE[i % 8]} delay={`${i * .1}s`}
                isLast={i === stages.length - 1} />
            ))}
          </div>
        </div>

        {/* ── Share card ── */}
        <div className="anim-fadeUp mt-12 flex flex-col items-center" style={{ animationDelay: ".3s" }}>
          <h3 className="hrau-display font-bold text-xl mb-5">Share-ready card</h3>
          <div className="rounded-[2rem] p-8 w-full max-w-sm text-center relative overflow-hidden clay"
            style={{ background: `linear-gradient(160deg, ${archetype.color}, ${C.pink} 60%, ${C.sunshine})`, color: "#fff" }}>
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 anim-float" />
            <div className="absolute -bottom-14 -left-10 w-44 h-44 rounded-full bg-white/10 anim-float2" />
            <div className="relative">
              <div className="text-xs font-bold tracking-[.2em] opacity-90">HOW RARE ARE YOU?</div>
              <div className="hrau-display font-bold text-6xl mt-4">{score.toFixed(1)}</div>
              <div className="hrau-display font-bold text-lg mt-3 flex items-center justify-center gap-2">
                <ArchIcon size={18} /> {archetype.name.toUpperCase()}
              </div>
              <div className="text-sm mt-2 opacity-90">Rarer than {score.toFixed(0)}% of people</div>
              <div className="mt-6 text-xs opacity-70">📸 screenshot this</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button onClick={onRestart}
            className="clay-btn inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold hrau-display"
            style={{ background: "rgba(255,255,255,.72)", color: C.ink, border: "1px solid rgba(255,255,255,.85)" }}>
            <RotateCcw size={18} /> Take it again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */

export default function App() {
  const [screen,     setScreen]     = useState("landing");
  const [answers,    setAnswers]    = useState([]);
  const [intakeData, setIntakeData] = useState({});
  const [result,     setResult]     = useState(null);

  function handleComplete(ans, intake) {
    setAnswers(ans);
    setIntakeData(intake);
    setScreen("analysis");
  }

  function handleRestart() {
    setAnswers([]);
    setIntakeData({});
    setResult(null);
    setScreen("landing");
  }

  return (
    <div className="hrau-root min-h-screen" style={{ background: C.cream }}>
      <GlobalStyle />
      {screen === "landing"   && <Landing onStart={() => setScreen("questions")} />}
      {screen === "questions" && <QuestionFlow onComplete={handleComplete} />}
      {screen === "analysis"  && (
        <Analysis
          answers={answers}
          intakeData={intakeData}
          onDone={(r) => { setResult(r); setScreen("results"); }}
        />
      )}
      {screen === "results" && result && (
        <Results result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}



