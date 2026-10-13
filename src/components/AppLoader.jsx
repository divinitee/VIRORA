import React from "react";
import BrandLoader from "@/components/BrandLoader";

export default function AppLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#08060C]">
      <div className="flex flex-col items-center">
        <BrandLoader size={124} label="Yuklanmoqda..." className="mb-5" />
        <p className="text-xs font-medium tracking-wide text-[#EFE6D5]/70">Yuklanmoqda...</p>
      </div>
      <p className="absolute bottom-6 text-[11px] text-[#EFE6D5]/50">
        VIRORA · Starter – C1
      </p>
    </div>
  );
}