import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const L = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer" className="text-primary underline" onClick={(e) => e.stopPropagation()}>{children}</a>
);

const COPY = {
  uz: {
    terms: <>Men VIRORA <L to="/terms">Ommaviy Ofertasi</L> shartlarini qabul qilaman va <L to="/privacy">Maxfiylik Siyosati</L> bilan tanishib chiqdim.</>,
    data: "Ta'lim jarayonini ta'minlash maqsadida shaxsiy va o'quv ma'lumotlarimning xalqaro bulutli serverlar (Base44) hamda sun'iy intellekt (AI) provayderlari orqali transchegaraviy qayta ishlanishiga rozilik bildiraman.",
    error: "Hisob yaratish uchun Ommaviy oferta, Maxfiylik siyosati va ma'lumotlarni qayta ishlash shartlariga rozilik bildirishingiz kerak.",
  },
  ru: {
    terms: <>Я принимаю условия <L to="/terms">Публичной оферты</L> VIRORA и подтверждаю ознакомление с <L to="/privacy">Политикой конфиденциальности</L>.</>,
    data: "Я даю согласие на трансграничную передачу и обработку моих учетных и учебных данных на международных облачных серверах (Base44) и провайдерами ИИ в целях функционирования платформы.",
    error: "Для создания аккаунта необходимо принять условия Публичной оферты, Политики конфиденциальности и дать согласие на обработку данных.",
  },
  en: {
    terms: <>I accept the VIRORA <L to="/terms">Public Offer</L> and acknowledge the <L to="/privacy">Privacy Policy</L>.</>,
    data: "I consent to the cross-border transfer and processing of my account and learning data on international cloud servers (Base44) and AI providers for platform functionality.",
    error: "Please accept the Public Offer, Privacy Policy, and data processing consent to create your account.",
  },
};

export const consentError = (lang) => (COPY[lang] || COPY.en).error;

export default function SignupConsent({ lang, terms, data, onTerms, onData, error }) {
  const c = COPY[lang] || COPY.en;
  const row = (id, checked, onChange, label) => (
    <label htmlFor={id} className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground cursor-pointer">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span>{label}</span>
    </label>
  );
  return (
    <div className="space-y-3 pt-4">
      {row("consent-terms", terms, onTerms, c.terms)}
      {row("consent-data", data, onData, c.data)}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}