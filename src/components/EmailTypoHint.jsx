import React from "react";
import { useAppLang } from "@/hooks/useAppLang";
import { suggestEmailFix } from "@/lib/authHelpers";

// "Did you mean …@gmail.com?" under an email field. One tap fixes it.
// A typo'd domain can never receive the signup code, which is how students
// ended up stuck and opening a second account.
const PROMPT = { uz: "Balki shuni nazarda tutdingiz:", en: "Did you mean", ru: "Возможно, вы имели в виду" };

export default function EmailTypoHint({ email, onFix }) {
  const { lang } = useAppLang();
  const fix = suggestEmailFix(email);
  if (!fix) return null;
  return (
    <p className="text-xs text-amber-400 mt-1.5">
      {PROMPT[lang] || PROMPT.uz}{" "}
      <button type="button" onClick={() => onFix(fix)} className="font-semibold underline underline-offset-2">
        {fix}
      </button>
      {lang === "en" ? "?" : ""}
    </p>
  );
}
