import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getQuizSteps, QuizStep, QuizOption } from "./QuizData";
import QuizProgress from "./QuizProgress";
import SocialProof from "./SocialProof";
import SalesPage from "./SalesPage";
import { ChevronRight, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Lang, LanguageProvider, useLang } from "./LanguageContext";
import { tr } from "./translations";

type AnswerValue = string | string[] | Record<string, string> | boolean | number | undefined;
type Answers = Record<string, AnswerValue>;

const QuizInner = () => {
  const { lang, setLang } = useLang();
  const T = (k: string) => tr(k, lang);

  const quizSteps = useMemo(() => getQuizSteps(lang), [lang]);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [multiSelections, setMultiSelections] = useState<string[]>([]);
  const [textValue, setTextValue] = useState("");
  const [numberValues, setNumberValues] = useState<Record<string, string>>({});
  const [showLang, setShowLang] = useState(true);
  const [showSales, setShowSales] = useState(false);

  useEffect(() => {
    if (!showSales) return;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement?.scrollTo?.(0, 0);
      document.body?.scrollTo?.(0, 0);
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 0);
  }, [showSales]);

  useEffect(() => {
    if (showLang || showSales) return;

    const el = scrollAreaRef.current;
    const scrollToTop = () => {
      if (el) {
        el.scrollTop = 0;
        return;
      }
      window.scrollTo(0, 0);
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [step, showLang, showSales]);

  const currentStep = quizSteps[step];
  const totalSteps = quizSteps.length;

  const goNext = useCallback((value?: AnswerValue) => {
    if (value !== undefined) {
      setAnswers(prev => ({ ...prev, [currentStep.id]: value }));
    }
    setMultiSelections([]);
    setTextValue("");
    setNumberValues({});
    setStep(s => Math.min(s + 1, totalSteps - 1));
  }, [currentStep, totalSteps]);

  const goBack = () => setStep(s => Math.max(s - 1, 0));

  const toggleMulti = (id: string) => {
    setMultiSelections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (showSales) {
    return <SalesPage answers={answers} />;
  }

  if (showLang) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="fixed inset-0 bg-foreground/30 z-40" />
        <div className="relative z-50 bg-card rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
          <h2 className="text-xl font-display font-bold text-center mb-1">{T("chooseLang")}</h2>
          <p className="text-muted-foreground text-center text-sm mb-6">{T("selectLang")}</p>
          {([{ flag: "🇧🇷", label: "Português", code: "pt" as Lang }, { flag: "🇺🇸", label: "English", code: "en" as Lang }, { flag: "🇪🇸", label: "Español", code: "es" as Lang }]).map(l => (
            <button key={l.label} onClick={() => { setLang(l.code); setShowLang(false); }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent transition-all mb-3 text-left">
              <span className="text-2xl">{l.flag}</span>
              <span className="font-medium text-foreground">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const renderImageCards = (options: QuizOption[]) => (
    <div className={`grid gap-4 grid-cols-2 max-w-2xl mx-auto animate-fade-in-up`}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => goNext(opt.id)}
          className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
          <img src={opt.image} alt={opt.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <div className="quiz-card-overlay absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "white" }}>{opt.label}</span>
            <ChevronRight className="w-5 h-5" style={{ color: "white" }} />
          </div>
        </button>
      ))}
    </div>
  );

  const renderListSingle = (options: QuizOption[]) => (
    <div className="flex flex-col gap-3 max-w-xl mx-auto animate-fade-in-up">
      {options.map(opt => (
        <button key={opt.id} onClick={() => goNext(opt.id)}
          className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-accent transition-all text-left group">
          {opt.emoji && <span className="text-2xl w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">{opt.emoji}</span>}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{opt.label}</p>
            {opt.description && <p className="text-sm text-muted-foreground">{opt.description}</p>}
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  );

  const renderListMulti = (options: QuizOption[]) => (
    <div className="flex flex-col gap-3 max-w-xl mx-auto animate-fade-in-up">
      {options.map(opt => {
        const selected = multiSelections.includes(opt.id);
        return (
          <button key={opt.id} onClick={() => toggleMulti(opt.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selected ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"}`}>
            {opt.emoji && <span className="text-2xl w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">{opt.emoji}</span>}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{opt.label}</p>
              {opt.description && <p className="text-sm text-muted-foreground">{opt.description}</p>}
            </div>
            <div className={`w-5 h-5 rounded-md border-2 transition-colors flex-shrink-0 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-border"}`}>
              {selected && <span style={{ color: "white", fontSize: 12 }}>✓</span>}
            </div>
          </button>
        );
      })}
      <button
        onClick={() => goNext(multiSelections)}
        disabled={multiSelections.length === 0}
        className="mt-2 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {T("continueBtn")} →
      </button>
    </div>
  );

  const renderInfo = (s: QuizStep) => (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto animate-fade-in-up">
      {s.icon && <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-4xl mb-6">{s.icon}</div>}
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">{s.title}</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">{s.infoText}</p>
      <button onClick={() => goNext(true)}
        className="px-12 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg flex items-center gap-2 hover:opacity-90 transition-all">
        {T("continueBtn")} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderTextInput = (s: QuizStep) => (
    <div className="flex flex-col items-center max-w-xl mx-auto animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl mb-4">👤</div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 text-center">{s.title}</h2>
      <p className="text-muted-foreground mb-6 text-center">{s.subtitle}</p>
      {s.benefits && (
        <div className="w-full bg-secondary rounded-2xl p-4 mb-6">
          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">🎁 {T("whatYouGet")}</p>
          {s.benefits.map(b => <p key={b} className="text-sm text-muted-foreground ml-4">• {b}</p>)}
        </div>
      )}
      <form onSubmit={e => { e.preventDefault(); if (textValue.trim()) goNext(textValue.trim()); }} className="w-full">
        <input value={textValue} onChange={e => setTextValue(e.target.value)} placeholder={s.inputPlaceholder}
          className="w-full p-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4" />
        <button type="submit" disabled={!textValue.trim()}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
          {T("seeDiagnosis")} <ArrowRight className="w-5 h-5" />
        </button>
      </form>
      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-4"><Shield className="w-3 h-3" /> {T("dataProtected")}</p>
    </div>
  );

  const renderNumberInput = (s: QuizStep) => (
    <div className="flex flex-col items-center max-w-xl mx-auto animate-fade-in-up">
      {s.icon && <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl mb-4">{s.icon}</div>}
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 text-center">{s.title}</h2>
      <p className="text-muted-foreground mb-6 text-center">{s.subtitle}</p>
      {s.id === "goal-weight" && (typeof answers.weight === "string" || typeof answers.weight === "number") && (
        <div className="w-full bg-secondary rounded-2xl p-4 mb-4">
          <p className="text-sm text-muted-foreground">{T("currentWeight")}</p>
          <p className="text-lg font-bold text-foreground">{String(answers.weight)} kg</p>
        </div>
      )}
      <form onSubmit={e => { e.preventDefault(); const vals: Record<string,string> = {}; s.inputs?.forEach(i => { vals[i.key] = numberValues[i.key] || ""; }); const allFilled = s.inputs?.every(i => numberValues[i.key]?.trim()); if (allFilled) { setAnswers(prev => ({ ...prev, ...vals })); goNext(vals); }}} className="w-full">
        {s.inputs?.map(input => (
          <div key={input.key} className="mb-4">
            <label className="text-sm font-medium text-foreground mb-2 block">{input.label}</label>
            <div className="relative">
              <input type="number" value={numberValues[input.key] || ""} onChange={e => setNumberValues(prev => ({ ...prev, [input.key]: e.target.value }))}
                placeholder={input.placeholder}
                className="w-full p-4 pr-12 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{input.unit}</span>
            </div>
          </div>
        ))}
        <button type="submit"
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          {T("continueBtn")} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">{T("dataConfidential")}</p>
      </form>
    </div>
  );

  const renderResults = () => {
    const userName = typeof answers.name === "string" && answers.name.trim() ? answers.name : T("defaultUser");

    const calcScore = () => {
      let s = 50;
      if (answers.sleep === "bad" || answers.sleep === "terrible") s += 12;
      if (answers.stress === "high" || answers.stress === "burnout") s += 10;
      if (answers.lifestyle === "sedentary") s += 8;
      if (answers["pain-frequency"] === "daily" || answers["pain-frequency"] === "chronic") s += 8;
      if (answers.water === "less-1") s += 5;
      if (answers.diet === "bad") s += 5;
      if (answers.experience === "beginner") s += 4;
      return Math.min(s, 95);
    };
    const score = calcScore();
    const circumference = 283;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 70 ? "destructive" : score >= 50 ? "warning" : "primary";
    const scoreLabel = score >= 70 ? T("resLevelHigh") : score >= 50 ? T("resLevelModerate") : T("resLevelLow");

    const causes: { title: string; impact: string; description: string }[] = [];
    if (answers.sleep === "bad" || answers.sleep === "terrible") {
      causes.push({ title: T("causeSleep"), impact: T("causeSleepImpact"), description: T("causeSleepDesc") });
    }
    if (answers.lifestyle === "sedentary") {
      causes.push({ title: T("causeSedentary"), impact: T("causeSedentaryImpact"), description: T("causeSedentaryDesc") });
    }
    if (answers.stress === "high" || answers.stress === "burnout") {
      causes.push({ title: T("causeStress"), impact: T("causeStressImpact"), description: T("causeStressDesc") });
    }
    if (answers["pain-frequency"] === "daily" || answers["pain-frequency"] === "chronic") {
      causes.push({ title: T("causePain"), impact: T("causePainImpact"), description: T("causePainDesc") });
    }
    if (answers.water === "less-1") {
      causes.push({ title: T("causeWater"), impact: T("causeWaterImpact"), description: T("causeWaterDesc") });
    }
    if (answers.diet === "bad") {
      causes.push({ title: T("causeDiet"), impact: T("causeDietImpact"), description: T("causeDietDesc") });
    }
    const defaultCauses = [
      { title: T("causeDefault1"), impact: T("causeDefault1Impact"), description: T("causeDefault1Desc") },
      { title: T("causeDefault2"), impact: T("causeDefault2Impact"), description: T("causeDefault2Desc") },
      { title: T("causeDefault3"), impact: T("causeDefault3Impact"), description: T("causeDefault3Desc") },
    ];
    while (causes.length < 3) {
      const next = defaultCauses.shift();
      if (next && !causes.find(c => c.title === next.title)) causes.push(next);
    }
    const topCauses = causes.slice(0, 3);

    const diagnostics: string[] = [];
    if (answers.lifestyle === "sedentary") diagnostics.push(T("diagActivity"));
    if (answers.sleep === "bad" || answers.sleep === "terrible") diagnostics.push(T("diagSleep"));
    if (answers.stress === "high" || answers.stress === "burnout") diagnostics.push(T("diagStress"));
    if (answers["pain-frequency"] === "daily" || answers["pain-frequency"] === "chronic") diagnostics.push(T("diagPain"));
    if (diagnostics.length < 4) diagnostics.push(T("diagFlex"));
    if (diagnostics.length < 4) diagnostics.push(T("diagPosture"));
    if (diagnostics.length < 4) diagnostics.push(T("diagMetabolism"));
    if (diagnostics.length < 4) diagnostics.push(T("diagBalance"));

    return (
      <div className="flex flex-col items-center max-w-xl mx-auto animate-fade-in-up pb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
          <span className="text-destructive text-sm font-bold tracking-wide">{T("resAttention")}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-2">
          {userName}, {T("resWellnessLevel").split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-md">{T("resSabotage")}</p>

        <div className="relative w-44 h-44 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="45" stroke={`hsl(var(--${scoreColor}))`} strokeWidth="8" fill="none"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="animate-score-count" style={{ "--score-offset": offset } as React.CSSProperties} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold text-${scoreColor}`}>{score}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
        <span className={`inline-block px-5 py-1.5 rounded-full border border-${scoreColor} text-${scoreColor} text-sm font-semibold mb-10`}>
          {T("resImbalanceLevel")}: {scoreLabel}
        </span>

        <div className="w-full bg-card rounded-2xl p-6 border border-border mb-4">
          <p className="font-bold text-foreground mb-3 text-lg">{T("resWhatMeans")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
            __html: T("resWhatMeansText").replace(
              lang === "pt" ? "Modo de Desequilíbrio" : lang === "en" ? "Imbalance Mode" : "Modo de Desequilibrio",
              `<strong class="text-foreground">${lang === "pt" ? "Modo de Desequilíbrio" : lang === "en" ? "Imbalance Mode" : "Modo de Desequilibrio"}</strong>`
            )
          }} />
        </div>

        <div className="w-full bg-card rounded-2xl p-6 border border-border mb-4">
          <p className="font-bold text-foreground mb-4 text-lg">{T("resDiagnostic")}</p>
          <div className="space-y-3">
            {diagnostics.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-card rounded-2xl p-6 border border-border mb-4">
          <p className="font-bold text-foreground mb-5 text-lg">{T("resTopCauses")}</p>
          <div className="space-y-5">
            {topCauses.map((cause, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-destructive font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-1">{cause.title}</p>
                  <p className="text-xs font-semibold text-destructive mb-1.5">{T("resImpact")}: {cause.impact}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cause.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-card rounded-2xl p-6 border border-border mb-4">
          <p className="font-bold text-foreground mb-5 text-lg">{T("resIfNoAction")}</p>
          <div className="space-y-0">
            {[
              { time: T("resNext3m"), effect: T("resNext3mEffect") },
              { time: T("resNext6m"), effect: T("resNext6mEffect") },
              { time: T("resNext12m"), effect: T("resNext12mEffect") },
              { time: T("resNext2y"), effect: T("resNext2yEffect") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-warning" : i === 1 ? "bg-warning" : i === 2 ? "bg-destructive/70" : "bg-destructive"}`} />
                  {i < 3 && <div className="w-0.5 h-6 bg-border" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground">{item.time}</p>
                  <p className="text-sm font-medium text-foreground">{item.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-primary/5 rounded-2xl p-6 border border-primary/20 mb-4">
          <p className="font-bold text-foreground mb-2 text-lg">{T("resGoodNews")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
            __html: T("resGoodNewsText").replace(
              lang === "pt" ? "reversível em 28-90 dias" : lang === "en" ? "reversible in 28-90 days" : "reversible en 28-90 días",
              `<strong class="text-foreground">${lang === "pt" ? "reversível em 28-90 dias" : lang === "en" ? "reversible in 28-90 days" : "reversible en 28-90 días"}</strong>`
            )
          }} />
        </div>

        <div className="w-full bg-card rounded-2xl p-6 border border-border mb-8">
          <p className="font-bold text-foreground mb-2 text-lg">{T("resHowFitFlow")}</p>
          <p className="text-sm text-muted-foreground mb-5">{T("resHowFitFlowSub")}</p>
          <div className="space-y-4">
            {[T("resMech1"), T("resMech2"), T("resMech3"), T("resMech4"), T("resMech5"), T("resMech6")].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{i + 1}</span>
                <p className="text-sm text-muted-foreground pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setShowSales(true)} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
          {T("resCTA")} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-muted-foreground mt-3 text-center flex items-center gap-1 justify-center">
          <Shield className="w-3.5 h-3.5" /> {T("resProtocolExclusive")}
        </p>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case "image-cards": return renderImageCards(currentStep.options || []);
      case "list-single": return renderListSingle(currentStep.options || []);
      case "list-multi": return renderListMulti(currentStep.options || []);
      case "info": return renderInfo(currentStep);
      case "text-input": return renderTextInput(currentStep);
      case "number-input": return renderNumberInput(currentStep);
      case "results": return renderResults();
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex justify-center pt-6 pb-2">
        <img
          src="/icone.png"
          alt="VIVAFIT"
          className="w-20 h-20 object-contain"
        />
      </div>

      {currentStep.type !== "results" && (
        <div className="px-4 mb-4">
          <QuizProgress current={step + 1} total={totalSteps} />
        </div>
      )}

      <div ref={scrollAreaRef} className="flex-1 min-h-0 px-4 pb-24 overflow-y-auto no-scrollbar">
        {currentStep.type !== "info" && currentStep.type !== "text-input" && currentStep.type !== "number-input" && currentStep.type !== "results" && (
          <div className="text-center mb-6 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{currentStep.title}</h2>
            {currentStep.subtitle && <p className="text-muted-foreground">{currentStep.subtitle}</p>}
          </div>
        )}
        {renderStep()}
      </div>

      {step > 0 && currentStep.type !== "results" && (
        <div className="fixed bottom-4 left-4 z-40">
          <button onClick={goBack}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all text-sm">
            <ArrowLeft className="w-4 h-4" /> {T("backBtn")}
          </button>
        </div>
      )}

      <SocialProof />
    </div>
  );
};

const Quiz = () => (
  <LanguageProvider>
    <QuizInner />
  </LanguageProvider>
);

export default Quiz;
