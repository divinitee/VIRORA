import React from "react";
import BrandLoader from "@/components/BrandLoader";
import PageLoader from "@/components/loading/PageLoader";

export default function AppLoader() {
  return (
    <PageLoader>
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background px-6">
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:gap-16 lg:gap-24">
        <BrandLoader
          width={132}
          height={194}
          label="Preparing your learning space"
          className="shrink-0"
        />
        <div className="text-center sm:text-left">
          <p className="text-3xl font-medium tracking-[0.28em] text-foreground sm:text-4xl">
            VIRORA
          </p>
          <p className="mt-5 text-lg font-normal tracking-[0.015em] text-secondary-foreground sm:text-2xl">
            Preparing your learning space…
          </p>
        </div>
      </div>
    </div>
    </PageLoader>
  );
}