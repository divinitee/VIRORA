import React from "react";
import LegalPage from "@/components/legal/LegalPage";
import { TERMS } from "@/lib/legal/terms";

export default function Terms() {
  return <LegalPage docs={TERMS} />;
}