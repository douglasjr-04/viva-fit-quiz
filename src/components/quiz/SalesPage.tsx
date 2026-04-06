import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Shield, Lock, ChevronDown, ChevronUp, Clock, Check, Star, X, AlertTriangle } from "lucide-react";
import { Lang, useLang } from "./LanguageContext";
import { tr } from "./translations";

type AnswerValue = string | string[] | Record<string, string> | boolean | number | undefined;
type Answers = Record<string, AnswerValue>;

interface SalesPageProps {
  answers: Answers;
}

const SalesPage = ({ answers }: SalesPageProps) => {
  const { lang } = useLang();
  const T = (k: string) => tr(k, lang);

  const checkoutUrls: Record<Lang, { basic: string; complete: string; upgrade: string }> = {
    pt: {
      basic: "https://pay.hotmart.com/M105251910N?off=3qdrd0uf",
      complete: "https://pay.hotmart.com/M105251910N?off=kquhi2ec",
      upgrade: "https://pay.hotmart.com/M105251910N?off=i5atteuw",
    },
    en: {
      basic: "https://pay.hotmart.com/B105252057A?off=6x4a2dy4",
      complete: "https://pay.hotmart.com/B105252057A?off=ikqumqgc",
      upgrade: "https://pay.hotmart.com/B105252057A?off=6x4a2dy4",
    },
    es: {
      basic: "https://pay.hotmart.com/J105252027J?off=elzwozbz",
      complete: "https://pay.hotmart.com/J105252027J?off=iyt58zdr",
      upgrade: "https://pay.hotmart.com/J105252027J?off=by0241mm",
    },
  };

  const getCheckoutUrl = (plan: "basic" | "complete" | "upgrade") => {
    const url = checkoutUrls[lang]?.[plan] ?? "";
    if (url) return url;
    if (plan === "upgrade") return checkoutUrls[lang]?.complete ?? "";
    return "";
  };

  const goToCheckout = (plan: "basic" | "complete" | "upgrade") => {
    const url = getCheckoutUrl(plan);
    if (!url) return;
    window.location.href = url;
  };

  const useUSD = lang === "en" || lang === "es";
  const currency = useUSD ? "U$" : "R$";
  const basicPrice = useUSD ? "5,90" : "10,00";
  const completePrice = useUSD ? "9,90" : "37,00";
  const basicFromPrice = useUSD ? "9,90" : "37,00";
  const completeFromPrice = useUSD ? "19,90" : "97,00";
  const upsellFromPrice = useUSD ? "19,90" : "37,00";
  const upsellToPrice = useUSD ? "7,90" : "19,90";
  const protocolValue = useUSD ? "49,00" : "97,00";
  const lifetimeValue = useUSD ? "249,00" : "497,00";
  const highlightUpgradeAmount = useUSD ? "U$ 2,00" : "R$ 9,90";

  const userName = typeof answers.name === "string" && answers.name.trim() ? answers.name : T("defaultUser");
  const preferredTime = answers["preferred-time"] === "morning" ? "morning" : "night";
  const [countdown, setCountdown] = useState(600);
  const [openWeek, setOpenWeek] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showBasicPage, setShowBasicPage] = useState(false);
  const salesScrollRef = useRef<HTMLDivElement | null>(null);
  const basicScrollRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = showBasicPage ? basicScrollRef.current : salesScrollRef.current;
    const scrollToTop = () => {
      if (el) {
        el.scrollTop = 0;
        return;
      }
      window.scrollTo(0, 0);
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [showBasicPage]);

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sequences = [
    { emoji: "🧘", name: T("salesSeqYoga"), desc: T("salesSeqYogaDesc") },
    { emoji: "🤸", name: T("salesSeqPilates"), desc: T("salesSeqPilatesDesc") },
    { emoji: "🏋️", name: T("salesSeqFunctional"), desc: T("salesSeqFunctionalDesc") },
    { emoji: "🥗", name: T("salesSeqRecipes"), desc: T("salesSeqRecipesDesc") },
  ];

  const weeks = [
    {
      id: "S1", title: T("salesWeek1"), subtitle: T("salesWeek1Sub"),
      badges: ["⏱ 30-60 min", `💪 ${lang === "pt" ? "Intensidade leve" : lang === "en" ? "Light intensity" : "Intensidad leve"}`, "❤️ 50-70% FCM"],
      days: [
        { day: 1, time: "30 min", activity: T("salesDay1Act"), meal: T("salesDay1Meal"), tip: T("salesDay1Tip") },
        { day: 2, time: "35 min", activity: T("salesDay2Act"), meal: T("salesDay2Meal"), tip: T("salesDay2Tip") },
        { day: 3, time: "40 min", activity: T("salesDay3Act"), meal: T("salesDay3Meal"), tip: T("salesDay3Tip") },
        { day: 4, time: "45 min", activity: T("salesDay4Act"), meal: T("salesDay4Meal"), tip: T("salesDay4Tip") },
        { day: 5, time: "50 min", activity: T("salesDay5Act"), meal: T("salesDay5Meal"), tip: T("salesDay5Tip") },
        { day: 6, time: "40 min", activity: T("salesDay6Act"), meal: T("salesDay6Meal"), tip: T("salesDay6Tip") },
        { day: 7, time: "30 min", activity: T("salesDay7Act"), meal: T("salesDay7Meal"), tip: T("salesDay7Tip") },
      ],
    },
    { id: "S2", title: T("salesWeek2"), subtitle: T("salesWeek2Sub"), locked: true },
    { id: "S3", title: T("salesWeek3"), subtitle: T("salesWeek3Sub"), locked: true },
    { id: "S4", title: T("salesWeek4"), subtitle: T("salesWeek4Sub"), locked: true },
  ];

  const faqs = [
    { q: T("salesFaq1Q"), a: T("salesFaq1A") },
    { q: T("salesFaq2Q"), a: T("salesFaq2A") },
    { q: T("salesFaq3Q"), a: T("salesFaq3A") },
    { q: T("salesFaq4Q"), a: T("salesFaq4A") },
    { q: T("salesFaq5Q"), a: T("salesFaq5A") },
  ];

  const testimonials = [
    { text: T("salesTest1"), name: "Maria", age: 48 },
    { text: T("salesTest2"), name: "Ana", age: 55 },
    { text: T("salesTest3"), name: "Juliana", age: 42 },
  ];

  const CountdownBar = () => (
    <div className="w-full bg-destructive text-destructive-foreground py-3 text-center font-bold text-sm flex items-center justify-center gap-2">
      <Clock className="w-4 h-4" /> {T("salesOfferToday")}: {mins}:{secs}
    </div>
  );

  const PricingCard = ({ highlighted }: { highlighted: boolean }) => (
    <div className={`w-full rounded-2xl border ${highlighted ? "border-primary shadow-lg" : "border-border"} bg-card p-6 relative`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
          👑 {T("salesMostPopular")}
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">{highlighted ? T("salesCompletePlan") : T("salesBasicPlan")}</h3>
          <p className="text-sm text-muted-foreground">{highlighted ? T("salesCompleteDesc") : T("salesBasicDesc")}</p>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-border" />
      </div>

      <div className="space-y-2.5 mb-6">
        {highlighted ? [
          T("salesCompItem1"), T("salesCompItem2"), T("salesCompItem3"), T("salesCompItem4"),
          T("salesCompItem5"), T("salesCompItem6"), T("salesCompItem7"), T("salesCompItem8"), T("salesCompItem9"),
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">{item}</span>
          </div>
        )) : [
          T("salesBasicItem1"), T("salesBasicItem2"), T("salesBasicItem3"),
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground line-through">{T("salesFrom")} {currency} {highlighted ? completeFromPrice : basicFromPrice}</p>
        <p className="text-4xl font-display font-bold text-foreground">{currency} {highlighted ? completePrice : basicPrice}</p>
        <p className="text-sm text-muted-foreground">{T("salesSinglePayment")}</p>
      </div>

      <button
        onClick={() => highlighted ? goToCheckout("complete") : setShowBasicPage(true)}
        disabled={highlighted && !getCheckoutUrl("complete")}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${highlighted ? "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" : "bg-foreground text-background hover:opacity-90"}`}
      >
        {highlighted ? T("salesWantComplete") : T("salesWantBasic")}
      </button>
    </div>
  );

  const BasicPlanPage = () => (
    <div className="h-[100dvh] bg-background flex flex-col">
      <div ref={basicScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar">
        <div className="border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-3">
            <button onClick={() => setShowBasicPage(false)} className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {lang === "pt" ? "Voltar" : lang === "en" ? "Back" : "Volver"}
            </button>
            <button onClick={() => setShowBasicPage(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-lg px-4 py-6">
        <div className="relative bg-background border border-border rounded-2xl w-full">
          <div className="text-center pt-8 pb-6 px-6">
            <img
              src="/logo.png"
              alt="VIVAFIT"
              className="w-12 h-12 rounded-full object-cover mx-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-semibold mb-5">
              {T("upsellWait")}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-4">
              {T("upsellTitle").split("{money}").map((part, i, arr) => (
                <span key={i}>{part}{i < arr.length - 1 && <span className="underline decoration-primary decoration-2">{T("upsellMoney")}</span>}</span>
              ))}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{
              __html: T("upsellDesc").replace(
                lang === "pt" ? "Protocolo Completo com acesso vitalício" : lang === "en" ? "Complete Protocol with lifetime access" : "Protocolo Completo con acceso de por vida",
                `<strong class="text-foreground">${lang === "pt" ? "Protocolo Completo com acesso vitalício" : lang === "en" ? "Complete Protocol with lifetime access" : "Protocolo Completo con acceso de por vida"}</strong>`
              )
            }} />
          </div>

          <div className="px-6 pb-8 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-3">{T("upsellFirstAccess")}</span>
              <p className="text-muted-foreground text-sm mb-3">{T("upsellMaxDiscount").replace("Protocolo Completo", `<strong class="text-foreground">Protocolo Completo</strong>`)}</p>
              <p className="text-foreground text-lg">
                {T("salesFrom")} <span className="line-through text-muted-foreground">{currency} {upsellFromPrice}</span>{" "}
                {lang === "pt" ? "por apenas" : lang === "en" ? "for only" : "por solo"}{" "}
                <span className="text-3xl font-bold text-primary">{currency} {upsellToPrice}</span>.
              </p>
            </div>

            <div className="w-full bg-primary text-primary-foreground py-2.5 text-center font-bold text-sm rounded-xl flex items-center justify-center gap-2">
              {T("upsellCoupon")}
            </div>

            <div className="bg-card rounded-2xl border border-primary/30 p-6">
              <h3 className="font-display font-bold text-foreground text-center text-lg mb-1">{T("upsellProtocolTitle")}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">{T("upsellSmartChoice")}</p>

              <div className="bg-background rounded-xl border border-dashed border-primary/40 p-4 text-center mb-5">
                <span className="text-primary text-xs font-bold tracking-wider">{T("upsellUniqueOffer")}</span>
                <p className="text-foreground mt-1">{T("upsellEverythingFor")} <span className="text-3xl font-bold">{upsellToPrice}</span> {T("upsellMore")}</p>
                <p className="text-xs text-muted-foreground mt-1">{T("upsellTotaling")}</p>
              </div>

              <div className="space-y-3">
                {[
                  { title: T("upsellProtoWeeks"), desc: T("upsellProtoWeeksDesc") },
                  { title: T("upsellVideoTitle"), desc: T("upsellVideoDesc") },
                  { title: T("upsellNutriTitle"), desc: T("upsellNutriDesc") },
                  { title: T("upsellSupportTitle"), desc: T("upsellSupportDesc") },
                  { title: T("upsellLifetimeTitle"), desc: T("upsellLifetimeDesc") },
                  { title: T("upsellBonusTitle"), desc: T("upsellBonusDesc") },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground"><strong className="text-foreground">{item.title}</strong> {item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-border text-center text-sm text-muted-foreground space-y-1">
                <p>{T("upsellProtocolValue")} <span className="line-through">{currency} {protocolValue}</span></p>
                <p>{T("upsellLifetimeValue")} <span className="line-through">{currency} {lifetimeValue}</span></p>
                <p className="text-primary font-bold text-base mt-2">{T("upsellSaving")}</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 text-center">
              <p className="font-bold text-foreground mb-2">{T("upsellHonest")}</p>
              <p className="text-sm text-muted-foreground mb-1" dangerouslySetInnerHTML={{
                __html: T("upsellAlreadyInvested").replace(
                  highlightUpgradeAmount,
                  `<span class="text-primary font-bold">${highlightUpgradeAmount}</span>`
                ).replace(
                  highlightUpgradeAmount.replace(",", "."),
                  `<span class="text-primary font-bold">${highlightUpgradeAmount.replace(",", ".")}</span>`
                ),
              }} />
              <p className="text-xs text-muted-foreground italic">{T("upsellCoffeePrice")}</p>
            </div>

            <button
              onClick={() => goToCheckout("upgrade")}
              disabled={!getCheckoutUrl("upgrade") && !getCheckoutUrl("complete")}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {T("upsellUpgradeCTA")}
            </button>
            <p className="text-xs text-muted-foreground text-center -mt-3">{T("upsellUpgradeDesc")}</p>

            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="font-bold text-foreground text-sm">{T("upsellBasicOption")}</p>
              <p className="text-2xl font-bold text-foreground">{currency} {basicPrice}</p>
              <p className="text-warning text-xs font-bold mt-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {T("upsellLimitedPlan")}</p>
              <div className="mt-3 space-y-2">
                {[T("upsellNoProto"), T("upsellNoVideo"), T("upsellNoNutri"), T("upsellNoLifetime")].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <X className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">{T("upsellRejectText")}</p>

            <button
              onClick={() => goToCheckout("basic")}
              disabled={!getCheckoutUrl("basic")}
              className="w-full py-4 rounded-2xl border border-border text-muted-foreground font-semibold text-sm hover:bg-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {T("upsellKeepBasic")}
            </button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {T("salesSatisfaction")}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  if (showBasicPage) {
    return <BasicPlanPage />;
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
      <div ref={salesScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar">
        <CountdownBar />

        <div className="bg-secondary py-2.5 text-center text-sm">
          🎉 <strong>{userName}</strong> {T("salesJustGot")}
        </div>

        <div className="bg-warning/10 py-2 text-center text-sm">
          ⏰ {T("salesSpotsLeft")}
        </div>

        <div className="flex flex-col items-center py-8">
          <img
            src="/logo.png"
            alt="VIVAFIT"
            className="w-20 h-20 rounded-full object-cover mb-2"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

      <div className="px-4 max-w-xl mx-auto w-full pb-12 space-y-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-4">
            ⚙️ {T("salesProtocol")}
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {userName}, {T("salesTransformation")}
          </h1>
          <p className="text-muted-foreground">{T("salesProgram")}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
          <span className="text-3xl">{preferredTime === "morning" ? "🌅" : "🌙"}</span>
          <div>
            <p className="font-semibold text-foreground">{T("salesRecommendedTime")}</p>
            <p className="text-sm text-muted-foreground">
              {preferredTime === "morning" ? T("salesMorningTime") : T("salesNightTime")}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">{T("salesSequences")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {sequences.map((s, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                <span className="text-2xl mb-2 block">{s.emoji}</span>
                <p className="font-semibold text-foreground text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">{T("salesProgram28")}</h2>
          <div className="space-y-3">
            {weeks.map((week, wi) => (
              <div key={wi} className="bg-card rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => !week.locked && setOpenWeek(openWeek === wi ? -1 : wi)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${wi === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {week.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{week.title}</p>
                    <p className="text-sm text-muted-foreground">{week.subtitle}</p>
                  </div>
                  {week.locked ? (
                    <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : openWeek === wi ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {openWeek === wi && week.days && (
                  <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {week.badges?.map((b, bi) => (
                        <span key={bi} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{b}</span>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {week.days.map((day) => (
                        <div key={day.day} className="bg-background rounded-xl p-4 border border-border">
                          <p className="text-sm font-semibold text-muted-foreground mb-1">{T("salesDay")} {day.day} · {day.time}</p>
                          <p className="font-semibold text-foreground mb-2">{day.activity}</p>
                          <p className="text-sm text-muted-foreground mb-2">🍽 {day.meal}</p>
                          <p className="text-sm text-primary italic">💡 {day.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollToPricing}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Lock className="w-5 h-5" /> {T("salesAccessProtocol")}
        </button>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">{T("salesExpectedResults")}</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">{T("salesWeek")}</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">{T("salesWeight")}</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">{T("salesMeasurements")}</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">{T("salesEnergy")}</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">{T("salesStatus")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold text-foreground">{lang === "pt" ? "Sem" : lang === "en" ? "Wk" : "Sem"} 1</td>
                  <td className="p-3 text-foreground">-0,5 a -1,5kg</td>
                  <td className="p-3 text-foreground">-2 a -3cm</td>
                  <td className="p-3 text-foreground">4→7/10</td>
                  <td className="p-3 text-foreground text-xs">{T("salesBodyWaking")}</td>
                </tr>
                {[2, 3, 4].map(i => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="p-3 font-semibold text-foreground">{lang === "pt" ? "Sem" : lang === "en" ? "Wk" : "Sem"} {i}</td>
                    <td className="p-3"><Lock className="w-4 h-4 text-muted-foreground" /></td>
                    <td className="p-3"><Lock className="w-4 h-4 text-muted-foreground" /></td>
                    <td className="p-3"><Lock className="w-4 h-4 text-muted-foreground" /></td>
                    <td className="p-3"><Lock className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td className="p-3 font-bold text-primary">TOTAL</td>
                  <td className="p-3 font-bold text-primary">-4 a -5kg</td>
                  <td className="p-3 font-bold text-primary">-10 a -15cm</td>
                  <td className="p-3 font-bold text-primary">+150%</td>
                  <td className="p-3 font-bold text-primary text-xs">{T("salesComplete")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">{T("salesMetabolicTransf")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🔥", label: T("salesBasalMet"), value: "+15-25%" },
              { icon: "📉", label: T("salesCortisol"), value: "-35-40%" },
              { icon: "❤️", label: T("salesInsulin"), value: "+40-50%" },
              { icon: "💪", label: T("salesMuscle"), value: "+2-3kg" },
              { icon: "⚡", label: T("salesMito"), value: "+30-40%" },
              { icon: "🌙", label: T("salesSleepQ"), value: "+50-80%" },
            ].map((m, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                <span className="text-lg">{m.icon}</span>
                <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-display font-bold text-lg text-foreground mb-4">{T("salesNutrition")}</h3>
          {[T("salesNut1"), T("salesNut2"), T("salesNut3"), T("salesNut4"), T("salesNut5")].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 mb-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-display font-bold text-lg text-foreground mb-4">{T("salesTips")}</h3>
          {[T("salesTip1"), T("salesTip2"), T("salesTip3"), T("salesTip4"), T("salesTip5")].map((tip, i) => (
            <div key={i} className="flex items-center gap-2.5 mb-2">
              <span className="text-primary font-bold">✓</span>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
          <h3 className="font-display font-bold text-lg text-foreground text-center mb-6">{T("salesTotalImpact")}</h3>
          <div className="space-y-5">
            <div>
              <p className="font-bold text-foreground mb-2">{T("salesBodyLabel")}</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>• {T("salesBody1")}</li>
                <li>• {T("salesBody2")}</li>
                <li>• {T("salesBody3")}</li>
                <li>• {T("salesBody4")}</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-2">{T("salesMetLabel")}</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>• {T("salesMet1")}</li>
                <li>• {T("salesMet2")}</li>
                <li>• {T("salesMet3")}</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-2">{T("salesWellLabel")}</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>• {T("salesWell1")}</li>
                <li>• {T("salesWell2")}</li>
                <li>• {T("salesWell3")}</li>
                <li>• {T("salesWell4")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">{T("salesProudResults")}</h2>
          <p className="text-muted-foreground mb-6">{T("salesRealTransf")}</p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-6">{T("salesWhatYouGet")}</h2>
          <div className="space-y-6">
            {[
              { emoji: "🔥", title: T("salesGet1Title"), desc: T("salesGet1Desc") },
              { emoji: "⏳", title: T("salesGet2Title"), desc: T("salesGet2Desc") },
              { emoji: "🪞", title: T("salesGet3Title"), desc: T("salesGet3Desc") },
              { emoji: "🔄", title: T("salesGet4Title"), desc: T("salesGet4Desc") },
              { emoji: "🌙", title: T("salesGet5Title"), desc: T("salesGet5Desc") },
              { emoji: "⚡", title: T("salesGet6Title"), desc: T("salesGet6Desc") },
              { emoji: "🧠", title: T("salesGet7Title"), desc: T("salesGet7Desc") },
              { emoji: "📒", title: T("salesGet8Title"), desc: T("salesGet8Desc") },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-display font-bold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={pricingRef}>
          <CountdownBar />

          <div className="space-y-6 pt-2">
            <PricingCard highlighted={true} />
            <PricingCard highlighted={false} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground text-center mb-6">{T("salesTestTitle")}</h2>
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-primary italic">"{t.text}"</p>
                <p className="text-sm text-muted-foreground">— {t.name}, {t.age} {T("salesYears")}</p>
              </div>
            ))}
          </div>
        </div>

        <CountdownBar />
        <div className="space-y-6 pt-2">
          <PricingCard highlighted={true} />
          <PricingCard highlighted={false} />
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-foreground mb-2">{T("salesGuarantee")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{T("salesGuaranteeText")}</p>
          <p className="text-sm text-muted-foreground mt-3">{T("salesGuaranteeEmail")} <strong className="text-foreground">suportevivafitapp@gmail.com</strong></p>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">{T("salesFaqTitle")}</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-4">
          <Lock className="w-3.5 h-3.5" /> {T("salesSecurePurchase")}
        </p>
      </div>
      </div>

    </div>
  );

};

export default SalesPage;
