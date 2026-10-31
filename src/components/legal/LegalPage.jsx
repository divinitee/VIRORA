import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAppLang } from "@/hooks/useAppLang";
import { useAuth } from "@/lib/AuthContext";

const LANGS = ["uz", "ru", "en"];

export default function LegalPage({ docs }) {
  const initial = LANGS.includes(getAppLang()) ? getAppLang() : "uz";
  const [lang, setLang] = useState(initial);
  const { user } = useAuth();
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={user ? "/" : "/landing"} className="text-muted-foreground hover:text-foreground p-1.5"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex gap-1 rounded-full border border-border p-1">
            {LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <article className="premium-card p-6 md:p-8 select-text text-sm leading-relaxed text-foreground/90 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_code]:text-xs [&_code]:text-brand">
          <ReactMarkdown>{docs[lang]}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}