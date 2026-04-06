import genderFemale from "@/assets/gender-female.jpg";
import genderMale from "@/assets/gender-male.jpg";
import ageYoung from "@/assets/age-young.jpg";
import age30s from "@/assets/age-30s.jpg";
import age40s from "@/assets/age-40s.jpg";
import age50plus from "@/assets/age-50plus.jpg";
import lifestyleSedentary from "@/assets/lifestyle-sedentary.jpg";
import lifestyleActive from "@/assets/lifestyle-active.jpg";
import timeMorning from "@/assets/time-morning.jpg";
import timeNight from "@/assets/time-night.jpg";
import { Lang } from "./LanguageContext";
import { tr } from "./translations";

export type StepType = "image-cards" | "list-single" | "list-multi" | "info" | "text-input" | "number-input" | "results";

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
  image?: string;
}

export interface QuizStep {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  options?: QuizOption[];
  icon?: string;
  infoText?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputs?: { key: string; label: string; placeholder: string; unit: string }[];
  benefits?: string[];
}

export function getQuizSteps(lang: Lang): QuizStep[] {
  const T = (k: string) => tr(k, lang);
  return [
    {
      id: "gender", type: "image-cards", title: T("genderTitle"), subtitle: T("genderSubtitle"),
      options: [
        { id: "female", label: T("genderFemale"), image: genderFemale },
        { id: "male", label: T("genderMale"), image: genderMale },
      ],
    },
    {
      id: "age", type: "image-cards", title: T("ageTitle"), subtitle: T("ageSubtitle"),
      options: [
        { id: "18-29", label: T("age1829"), image: ageYoung },
        { id: "30-39", label: T("age3039"), image: age30s },
        { id: "40-49", label: T("age4049"), image: age40s },
        { id: "50+", label: T("age50plus"), image: age50plus },
      ],
    },
    {
      id: "welcome", type: "info", title: T("welcomeTitle"), icon: "🌿", infoText: T("welcomeText"),
    },
    {
      id: "goal", type: "list-single", title: T("goalTitle"), subtitle: T("goalSubtitle"),
      options: [
        { id: "lose-weight", label: T("goalLoseWeight"), description: T("goalLoseWeightDesc"), emoji: "🔥" },
        { id: "flexibility", label: T("goalFlexibility"), description: T("goalFlexibilityDesc"), emoji: "🧘" },
        { id: "stress", label: T("goalStress"), description: T("goalStressDesc"), emoji: "🧘‍♀️" },
        { id: "strength", label: T("goalStrength"), description: T("goalStrengthDesc"), emoji: "⚡" },
      ],
    },
    {
      id: "experience", type: "list-single", title: T("expTitle"), subtitle: T("expSubtitle"),
      options: [
        { id: "beginner", label: T("expBeginner"), description: T("expBeginnerDesc"), emoji: "🌱" },
        { id: "some", label: T("expSome"), description: T("expSomeDesc"), emoji: "🌿" },
        { id: "regular", label: T("expRegular"), description: T("expRegularDesc"), emoji: "🌳" },
        { id: "expert", label: T("expExpert"), description: T("expExpertDesc"), emoji: "🏔️" },
      ],
    },
    {
      id: "lifestyle", type: "image-cards", title: T("lifestyleTitle"), subtitle: T("lifestyleSubtitle"),
      options: [
        { id: "sedentary", label: T("lifestyleSedentary"), image: lifestyleSedentary },
        { id: "active", label: T("lifestyleActive"), image: lifestyleActive },
      ],
    },
    {
      id: "name", type: "text-input", title: T("nameTitle"), subtitle: T("nameSubtitle"),
      inputLabel: T("nameLabel"), inputPlaceholder: T("nameLabel"),
      benefits: [T("nameBenefit1"), T("nameBenefit2"), T("nameBenefit3")],
    },
    {
      id: "conditions", type: "list-multi", title: T("conditionsTitle"), subtitle: T("conditionsSubtitle"),
      options: [
        { id: "back-pain", label: T("condBackPain"), description: T("condBackPainDesc"), emoji: "🔙" },
        { id: "joint-pain", label: T("condJointPain"), description: T("condJointPainDesc"), emoji: "🦵" },
        { id: "anxiety", label: T("condAnxiety"), description: T("condAnxietyDesc"), emoji: "😰" },
        { id: "blood-pressure", label: T("condBloodPressure"), description: T("condBloodPressureDesc"), emoji: "❤️" },
      ],
    },
    {
      id: "pain-frequency", type: "list-single", title: T("painTitle"), subtitle: T("painSubtitle"),
      options: [
        { id: "rarely", label: T("painRarely"), emoji: "✅" },
        { id: "sometimes", label: T("painSometimes"), emoji: "⚠️" },
        { id: "daily", label: T("painDaily"), emoji: "🔴" },
        { id: "chronic", label: T("painChronic"), emoji: "🌡️" },
      ],
    },
    {
      id: "sleep", type: "list-single", title: T("sleepTitle"), subtitle: T("sleepSubtitle"),
      options: [
        { id: "great", label: T("sleepGreat"), description: T("sleepGreatDesc"), emoji: "😴" },
        { id: "ok", label: T("sleepOk"), description: T("sleepOkDesc"), emoji: "😐" },
        { id: "bad", label: T("sleepBad"), description: T("sleepBadDesc"), emoji: "😣" },
        { id: "terrible", label: T("sleepTerrible"), description: T("sleepTerribleDesc"), emoji: "🌙" },
      ],
    },
    {
      id: "stress", type: "list-single", title: T("stressTitle"), subtitle: T("stressSubtitle"),
      options: [
        { id: "low", label: T("stressLow"), emoji: "🌈" },
        { id: "moderate", label: T("stressModerate"), emoji: "🌤️" },
        { id: "high", label: T("stressHigh"), emoji: "💫" },
        { id: "burnout", label: T("stressBurnout"), emoji: "🔥" },
      ],
    },
    {
      id: "time", type: "list-single", title: T("timeTitle"), subtitle: T("timeSubtitle"),
      options: [
        { id: "10", label: T("time10"), description: T("time10Desc"), emoji: "⏱️" },
        { id: "15-20", label: T("time1520"), description: T("time1520Desc"), emoji: "⏰" },
        { id: "30", label: T("time30"), description: T("time30Desc"), emoji: "🕐" },
        { id: "45+", label: T("time45"), description: T("time45Desc"), emoji: "🕑" },
      ],
    },
    {
      id: "preferred-time", type: "image-cards", title: T("prefTimeTitle"), subtitle: T("prefTimeSubtitle"),
      options: [
        { id: "morning", label: T("prefTimeMorning"), image: timeMorning },
        { id: "night", label: T("prefTimeNight"), image: timeNight },
      ],
    },
    {
      id: "did-you-know", type: "info", title: T("dykTitle"), icon: "✨", infoText: T("dykText"),
    },
    {
      id: "body-type", type: "list-single", title: T("bodyTypeTitle"), subtitle: T("bodyTypeSubtitle"),
      options: [
        { id: "slim", label: T("bodySlim"), emoji: "🦋" },
        { id: "medium", label: T("bodyMedium"), emoji: "🌸" },
        { id: "curvy", label: T("bodyCurvy"), emoji: "🌺" },
        { id: "overweight", label: T("bodyOverweight"), emoji: "🌻" },
      ],
    },
    {
      id: "measurements", type: "number-input", title: T("measTitle"), subtitle: T("measSubtitle"), icon: "📏",
      inputs: [
        { key: "weight", label: T("measWeight"), placeholder: T("measWeightPh"), unit: "kg" },
        { key: "height", label: T("measHeight"), placeholder: T("measHeightPh"), unit: "cm" },
      ],
    },
    {
      id: "goal-weight", type: "number-input", title: T("goalWeightTitle"), subtitle: T("goalWeightSubtitle"), icon: "🎯",
      inputs: [
        { key: "goalWeight", label: T("goalWeightLabel"), placeholder: T("goalWeightPh"), unit: "kg" },
      ],
    },
    {
      id: "body-goal", type: "list-single", title: T("bodyGoalTitle"), subtitle: T("bodyGoalSubtitle"),
      options: [
        { id: "lean", label: T("bodyGoalLean"), emoji: "✨" },
        { id: "toned", label: T("bodyGoalToned"), emoji: "💪" },
        { id: "flexible", label: T("bodyGoalFlexible"), emoji: "🏄" },
        { id: "balanced", label: T("bodyGoalBalanced"), emoji: "🏔️" },
      ],
    },
    {
      id: "focus-areas", type: "list-multi", title: T("focusTitle"), subtitle: T("focusSubtitle"),
      options: [
        { id: "arms", label: T("focusArms"), emoji: "💪" },
        { id: "abs", label: T("focusAbs"), emoji: "🎯" },
        { id: "legs", label: T("focusLegs"), emoji: "🦵" },
        { id: "back", label: T("focusBack"), emoji: "🧘" },
      ],
    },
    {
      id: "preferred-activities", type: "list-multi", title: T("activitiesTitle"), subtitle: T("activitiesSubtitle"),
      options: [
        { id: "yoga", label: T("actYoga"), description: T("actYogaDesc"), emoji: "🧘" },
        { id: "pilates", label: T("actPilates"), description: T("actPilatesDesc"), emoji: "🤸" },
        { id: "functional", label: T("actFunctional"), description: T("actFunctionalDesc"), emoji: "🏋️" },
        { id: "hiit", label: T("actHiit"), description: T("actHiitDesc"), emoji: "⚡" },
      ],
    },
    {
      id: "motivation", type: "list-single", title: T("motivTitle"), subtitle: T("motivSubtitle"),
      options: [
        { id: "results", label: T("motivResults"), description: T("motivResultsDesc"), emoji: "📈" },
        { id: "community", label: T("motivCommunity"), description: T("motivCommunityDesc"), emoji: "👥" },
        { id: "routine", label: T("motivRoutine"), description: T("motivRoutineDesc"), emoji: "📋" },
        { id: "wellbeing", label: T("motivWellbeing"), description: T("motivWellbeingDesc"), emoji: "💚" },
      ],
    },
    {
      id: "water", type: "list-single", title: T("waterTitle"), subtitle: T("waterSubtitle"),
      options: [
        { id: "less-1", label: T("waterLess1"), emoji: "💧" },
        { id: "1-2", label: T("water12"), emoji: "💦" },
        { id: "2-3", label: T("water23"), emoji: "🌊" },
        { id: "3+", label: T("water3plus"), emoji: "🏆" },
      ],
    },
    {
      id: "diet", type: "list-single", title: T("dietTitle"), subtitle: T("dietSubtitle"),
      options: [
        { id: "bad", label: T("dietBad"), emoji: "🍔" },
        { id: "ok", label: T("dietOk"), emoji: "🍝" },
        { id: "good", label: T("dietGood"), emoji: "🥑" },
        { id: "great", label: T("dietGreat"), emoji: "🥗" },
      ],
    },
    {
      id: "results", type: "results", title: "",
    },
  ];
}

// Keep backward compat - default Portuguese
export const QUIZ_STEPS = getQuizSteps("pt");

export const SOCIAL_PROOF_NAMES = [
  "Maria", "Ana", "Carla", "Patrícia", "Fernanda", "Juliana", "Beatriz",
  "Luciana", "Sandra", "Renata", "Camila", "Amanda", "Isabela", "Larissa",
];
