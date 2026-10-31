import React from "react";
import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY } from "@/lib/legal/privacy";

export default function Privacy() {
  return <LegalPage docs={PRIVACY} />;
}