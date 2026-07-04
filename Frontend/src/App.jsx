/**
 * How Rare Are You?
 *
 * Vite project — save as src/App.jsx, and put the companion
 * stylesheet at src/HowRareAreYou.css.
 *
 * .env.local:
 *   VITE_API_URL=http://localhost:8000
 */

import { useState, useEffect } from "react";
import {
  ArrowRight, RotateCcw, Building2, Palette, Flame, Compass,
  Landmark, Search, Sparkles, Music2, Code2, BookOpen, Wrench,
  GraduationCap, Lightbulb,
} from "lucide-react";
import "./HowRareAreYou.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ─────────────────────────────────────────────
   QUESTIONS  (field → maps directly to UserProfile boolean)
───────────────────────────────────────────── */

const QUESTIONS = [
  {
    icon: Code2,
    field: "programming",
    q: "Do you write code?",
    options: [
      { label: "Yes — it's what I live for",   bool: true,  tag: "builder"  },
      { label: "Sometimes, when I need to",     bool: true,  tag: "curious"  },
      { label: "Tried it, didn't really stick", bool: false, tag: "creative" },
      { label: "Not at all",                    bool: false, tag: "social"   },
    ],
  },
  {
    icon: Music2,
    field: "instrument",
    q: "Do you play a musical instrument?",
    options: [
      { label: "Yes, more than one",  bool: true,  tag: "creative" },
      { label: "Yes, one instrument", bool: true,  tag: "creative" },
      { label: "Used to, not anymore",bool: false, tag: "curious"  },
      { label: "No",                  bool: false, tag: "social"   },
    ],
  },
  {
    icon: Compass,
    field: "gym",
    q: "Do you exercise regularly?",
    options: [
      { label: "Daily — non-negotiable",  bool: true,  tag: "builder" },
      { label: "A few times a week",      bool: true,  tag: "steady"  },
      { label: "When I feel like it",     bool: false, tag: "curious" },
      { label: "Not really my thing",     bool: false, tag: "creative"},
    ],
  },
  {
    icon: BookOpen,
    field: "reads_books",
    q: "Do you read books?",
    options: [
      { label: "Always — one on the go",       bool: true,  tag: "curious" },
      { label: "A few a year",                 bool: true,  tag: "steady"  },
      { label: "Rarely, maybe summaries",      bool: false, tag: "builder" },
      { label: "Books aren't really my thing", bool: false, tag: "social"  },
    ],
  },
  {
    icon: Wrench,
    field: "builds_projects",
    q: "Do you build your own projects?",
    options: [
      { label: "Constantly — I can't help myself", bool: true,  tag: "builder" },
      { label: "Yes, when I have the time",        bool: true,  tag: "builder" },
      { label: "I have ideas but rarely ship",      bool: false, tag: "curious" },
      { label: "Not really my thing",               bool: false, tag: "social"  },
    ],
  },
  {
    icon: GraduationCap,
    field: "engineering_student",
    q: "Are you studying or working in engineering / tech?",
    options: [
      { label: "Yes, currently studying",   bool: true,  tag: "builder"  },
      { label: "Yes, I work in the field",  bool: true,  tag: "builder"  },
      { label: "Different field entirely",  bool: false, tag: "creative" },
      { label: "Self-taught, no formal study", bool: false, tag: "maverick" },
    ],
  },
  {
    icon: Lightbulb,
    field: "entrepreneurship_interest",
    q: "Do you want to build something of your own?",
    options: [
      { label: "Obsessively — it's all I think about", bool: true,  tag: "maverick" },
      { label: "Yes, I'm actively planning",            bool: true,  tag: "builder"  },
      { label: "Maybe someday",                          bool: false, tag: "curious"  },
      { label: "Not really my path",                     bool: false, tag: "steady"   },
    ],
  },
  {
    icon: Sparkles,
    field: null, // personality only — not sent to backend
    q: "A stranger would probably describe you as...",
    options: [
      { label: "Unpredictable", bool: null, tag: "maverick" },
      { label: "Reliable",      bool: null, tag: "steady"   },
      { label: "Curious",       bool: null, tag: "curious"  },
      { label: "Magnetic",      bool: null, tag: "social"   },
    ],
  },
];

const ARCHETYPES = {
  builder:  { name: "Visionary Builder", icon: Building2, blurb: "You don't just imagine the future — you assemble it, one deliberate piece at a time." },
  creative: { name: "Quiet Inventor",    icon: Palette,   blurb: "Your ideas arrive fully formed in places nobody else thought to look." },
  maverick: { name: "Wild Catalyst",     icon: Flame,     blurb: "Rules are rough drafts to you, and your edit is usually an improvement." },
  wanderer: { name: "Curious Wanderer",  icon: Compass,   blurb: "Your map has more pins in it than most people's whole lives." },
  social:   { name: "Social Magnet",     icon: Sparkles,  blurb: "People orbit you without quite knowing why — it isn't really teachable." },
  steady:   { name: "Steady Architect",  icon: Landmark,  blurb: "While trends cycle past, you're quietly building things that last." },
  curious:  { name: "Pattern Seeker",    icon: Search,    blurb: "You notice the threads connecting things that, to everyone else, look unrelated." },
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
  "Reading your answers",
  "Mapping behavioral patterns",
  "Calculating rarity index",
  "Finding unique trait combinations",
  "Generating your personality profile",
  "Predicting your future trajectory",
];

/* ─────────────────────────────────────────────
   DATA HELPERS
───────────────────────────────────────────── */

function answersToProfile(answers, intake) {
  const profile = {
    age: parseInt(intake.age) || 22,
    country: intake.country?.trim() || "Unknown",
  };
  QUESTIONS.forEach((q, i) => {
    if (q.field) profile[q.field] = answers[i]?.bool ?? false;
  });
  return profile;
}

function localFallback(answers) {
  const tagCounts = {};
  answers.forEach((a) => { if (a.tag) tagCounts[a.tag] = (tagCounts[a.tag] || 0) + 1; });
  const topTag = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])[0] ?? "builder";
  const trueCount = answers.filter((a) => a.bool === true).length;
  const score = Math.round((55 + trueCount * 5.7) * 10) / 10;
  const archetype = ARCHETYPES[topTag] ?? ARCHETYPES.builder;
  const insights = (INSIGHT_POOL[topTag] ?? INSIGHT_POOL.builder).map((text) => ({ text }));
  return { score, percentile: Math.round(score * 10), archetype, insights, aiAnalysis: archetype.blurb, futureProjection: null, isFromAPI: false };
}

function normalizeResult(apiData, answers) {
  if (!apiData) return localFallback(answers);

  // Your FastAPI /analyze response nests the score/archetype under "analysis":
  // { report, profile, analysis: { rarity_score, percentile, archetype, description }, ... }
  const analysis = apiData.analysis ?? apiData;

  const name = analysis.archetype ?? "Visionary Builder";
  const key  = Object.keys(ARCHETYPES).find((k) => ARCHETYPES[k].name === name) ?? "builder";
  const base = ARCHETYPES[key];

  const insights = Array.isArray(apiData.insights)
    ? apiData.insights.map((item) => ({ text: typeof item === "string" ? item : (item.text ?? item.insight ?? String(item)) }))
    : localFallback(answers).insights;

  const aiAnalysis =
    typeof apiData.ai_analysis === "string"
      ? apiData.ai_analysis
      : apiData.ai_analysis?.analysis ?? apiData.ai_analysis?.text ?? base.blurb;

  return {
    score: analysis.rarity_score ?? 75,
    percentile: analysis.percentile ?? 750,
    archetype: { ...base, name, blurb: analysis.description ?? base.blurb },
    insights,
    aiAnalysis,
    futureProjection: apiData.future_projection ?? null,
    matchedTraits: apiData.matched_traits ?? [],
    warnings: apiData.warnings ?? [],
    isFromAPI: true,
  };
}

function parseFutureProjection(raw, archetype) {
  const defaults = [
    { label: "Today",   text: "You're already operating in the top tier — most people never even start." },
    { label: "1 Year",  text: "The habits compounding quietly right now start becoming visible to everyone around you." },
    { label: "3 Years", text: `${archetype.name} energy becomes your signature — people begin seeking you out for it.` },
    { label: "5 Years", text: "What once felt like an edge case becomes a category of one: just you." },
  ];
  if (!raw) return defaults;
  if (typeof raw === "string") return [{ label: "Your path forward", text: raw }];
  if (typeof raw === "object") {
    const entries = Object.entries(raw).map(([k, v]) => ({
      label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      text: String(v),
    }));
    return entries.length ? entries : defaults;
  }
  return defaults;
}

function useCountUp(target, ms = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    function tick(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / ms);
      setVal(Math.round(target * p * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

/* ─────────────────────────────────────────────
   INTAKE
───────────────────────────────────────────── */

function IntakeCard({ onNext }) {
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const n = parseInt(age);
    if (!age || isNaN(n) || n < 10 || n > 100) { setError("Enter a valid age (10–100)."); return; }
    if (!country.trim()) { setError("Enter your country."); return; }
    onNext({ age, country: country.trim() });
  }

  return (
    <div className="screen-center">
      <div className="card">
        <p className="eyebrow" style={{ marginBottom: 8 }}>Before we start</p>
        <p style={{ color: "var(--text-muted)", fontSize: 14.5, marginBottom: 24 }}>
          Two quick things — this helps place your score.
        </p>

        <div className="field">
          <label>Your age</label>
          <input
            type="number" min="10" max="100" placeholder="e.g. 22"
            value={age}
            onChange={(e) => { setAge(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="field">
          <label>Your country</label>
          <input
            type="text" placeholder="e.g. India"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn" style={{ width: "100%", marginTop: 8 }} onClick={submit}>
          Continue
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
    <div className="screen">
      <p className="eyebrow">A statistical experiment</p>
      <h1 className="hero-heading serif">How rare are you?</h1>
      <p className="hero-sub">
        Discover how statistically unique your skills, habits, interests and
        ambitions really are — in about ninety seconds.
      </p>

      <button className="btn" style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 8 }} onClick={onStart}>
        Start the quiz <ArrowRight size={16} />
      </button>
      <p className="hero-meta">8 questions · no sign-up · no data stored</p>

      <div className="feature-list">
        <div>
          <h4>A rarity score</h4>
          <p>A single number placing you against 1,000 other people.</p>
        </div>
        <div>
          <h4>An archetype</h4>
          <p>One of seven personality classes based on your answers.</p>
        </div>
        <div>
          <h4>A future projection</h4>
          <p>A short, written look at where your traits might take you.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUESTION FLOW
───────────────────────────────────────────── */

function QuestionFlow({ onComplete }) {
  const [phase, setPhase] = useState("intake");
  const [intakeData, setIntakeData] = useState({ age: "", country: "" });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [leaving, setLeaving] = useState(false);

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
    }, 180);
  }

  if (phase === "intake") return <IntakeCard onNext={handleIntake} />;

  const q = QUESTIONS[index];
  const Icon = q.icon;
  const pct = ((index) / QUESTIONS.length) * 100;

  return (
    <div className="screen" style={{ maxWidth: 560 }}>
      <div className="progress-row">
        <span>Question {index + 1} of {QUESTIONS.length}</span>
        <Icon size={15} />
      </div>
      <div className="progress-line">
        <span style={{ width: `${pct}%` }} />
      </div>

      <div
        className="fade-swap"
        key={index}
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translateY(-6px)" : "translateY(0)",
        }}
      >
        <h2 className="question-heading">{q.q}</h2>
        <div className="option-grid">
          {q.options.map((opt, i) => (
            <button key={i} className="option-btn" onClick={() => choose(opt)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANALYSIS
───────────────────────────────────────────── */

function Analysis({ answers, intakeData, onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
    }, 500);

    const profile = answersToProfile(answers, intakeData);
    console.log(`[/analyze] POST ${API_URL}/analyze`, profile);
    const minDelay = new Promise((res) => setTimeout(res, 500 * ANALYSIS_STEPS.length + 400));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // give the backend 15s before giving up

    const apiCall = fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text().catch(() => "");
          throw new Error(`Backend responded ${r.status}: ${body}`);
        }
        return r.json();
      })
      .catch((err) => {
        // Log the real reason instead of silently going offline.
        console.error("[/analyze] request failed — falling back to offline estimate:", err);
        return null;
      })
      .finally(() => clearTimeout(timeout));

    Promise.all([apiCall, minDelay]).then(([apiData]) => {
      clearInterval(stepTimer);
      onDone(normalizeResult(apiData, answers));
    });

    return () => clearInterval(stepTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="screen-center" style={{ flexDirection: "column" }}>
      <div className="dot-row dot-pulse">
        <span>•</span><span>•</span><span>•</span>
      </div>
      <p className="analysis-status">{ANALYSIS_STEPS[step]}…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULTS
───────────────────────────────────────────── */

function Results({ result, onRestart }) {
  const { score, percentile, archetype, insights, aiAnalysis, futureProjection, isFromAPI } = result;
  const displayScore = useCountUp(score);
  const ArchIcon = archetype.icon;
  const stages = parseFutureProjection(futureProjection, archetype);

  return (
    <div className="screen">
      <div className="score-block">
        <p className="eyebrow">Your rarity score</p>
        <div className="score-number serif" style={{ marginTop: 10 }}>{displayScore.toFixed(1)}</div>
        <p className="score-caption">Rarer than {percentile} out of every 1,000 people</p>
        {!isFromAPI && (
          <p className="offline-note">Offline estimate — start the API server for a live score.</p>
        )}
      </div>

      <div className="archetype-row" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <ArchIcon size={22} style={{ marginTop: 4, flexShrink: 0 }} />
        <div>
          <p className="eyebrow">Archetype</p>
          <h3 className="archetype-name serif">{archetype.name}</h3>
          <p className="archetype-blurb">{archetype.blurb}</p>
        </div>
      </div>

      <hr className="divider" />

      <p className="section-label">What makes you, you</p>
      <div className="insight-list">
        {insights.map((ins, i) => (
          <div key={i}>
            <span className="marker">{String(i + 1).padStart(2, "0")}</span>
            <span>{ins.text}</span>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <p className="section-label">Your personal analysis</p>
      <div className="analysis-block">{aiAnalysis}</div>

      <hr className="divider" />

      <p className="section-label">Where this could take you</p>
      <div>
        {stages.map((s, i) => (
          <div className="stage-row" key={i}>
            <div className="rail">
              <div className="node" />
              {i < stages.length - 1 && <div className="line" />}
            </div>
            <div className="stage-body">
              <div className="stage-label">{s.label}</div>
              <p className="stage-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <p className="section-label" style={{ textAlign: "center" }}>Share card</p>
      <div className="share-card">
        <div className="brand">How rare are you?</div>
        <div className="num serif">{score.toFixed(1)}</div>
        <div className="arch">{archetype.name}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <button className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8 }} onClick={onRestart}>
          <RotateCcw size={15} /> Take it again
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [answers, setAnswers] = useState([]);
  const [intakeData, setIntakeData] = useState({});
  const [result, setResult] = useState(null);

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
    <div className="hrau">
      {screen === "landing" && <Landing onStart={() => setScreen("questions")} />}
      {screen === "questions" && <QuestionFlow onComplete={handleComplete} />}
      {screen === "analysis" && (
        <Analysis answers={answers} intakeData={intakeData} onDone={(r) => { setResult(r); setScreen("results"); }} />
      )}
      {screen === "results" && result && <Results result={result} onRestart={handleRestart} />}
    </div>
  );
}