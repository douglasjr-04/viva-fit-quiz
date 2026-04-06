import { useEffect, useState } from "react";
import { SOCIAL_PROOF_NAMES } from "./QuizData";
import { useLang } from "./LanguageContext";
import { tr } from "./translations";

const SocialProof = () => {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      const randomName = SOCIAL_PROOF_NAMES[Math.floor(Math.random() * SOCIAL_PROOF_NAMES.length)];
      setName(randomName);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    const interval = setInterval(show, 5000);
    const timeout = setTimeout(show, 2000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-notification-slide">
      <div className="bg-card shadow-lg rounded-lg px-4 py-3 flex items-center gap-2 border border-border">
        <span className="w-2 h-2 rounded-full bg-success" />
        <span className="text-sm">
          <span className="font-semibold text-foreground">{name}</span>{" "}
          <span className="text-muted-foreground">{tr("socialProofText", lang)}</span>
        </span>
      </div>
    </div>
  );
};

export default SocialProof;
