"use client";

import { useState, useEffect, useCallback } from "react";
import HearingForm from "@/components/HearingForm";
import CalculatingScreen from "@/components/CalculatingScreen";
import ResultScreen from "@/components/ResultScreen";
import ConsultationForm from "@/components/ConsultationForm";
import CompletionScreen from "@/components/CompletionScreen";

export interface HearingData {
  objective: string;
  industry: string;
  industryDetail: string;
  designStyle: string;

  // STEP 04: 必要なページ
  pages: {
    topPage: boolean; // デフォルトtrue、修正不可
    contactForm: boolean; // 選択可能
    companyProfile: boolean;
    serviceIntro: boolean;
    productMenu: boolean;
    facilityIntro: boolean;
    pricing: boolean;
    staffIntro: boolean;
    access: boolean;
    faq: boolean;
    recruitment: boolean;
    other: number; // 0-10のカウンター
  };

  // STEP 05: お知らせ・ブログ機能
  blogFeatures: {
    news: boolean;
    blog: boolean;
    activityReport: boolean;
    eventInfo: boolean;
    other: number; // 0-10のカウンター
  };

  // STEP 06: 実績・ギャラリー機能
  galleryFeatures: {
    portfolio: boolean;
    products: boolean;
    testimonials: boolean;
    staff: boolean;
    photoGallery: boolean;
    other: number; // 0-10のカウンター
  };
}

export interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  existingUrl: string;
  additionalRequests: string;
}

export const initialHearingData: HearingData = {
  objective: "",
  industry: "",
  industryDetail: "",
  designStyle: "",
  pages: {
    topPage: true,
    contactForm: false,
    companyProfile: false,
    serviceIntro: false,
    productMenu: false,
    facilityIntro: false,
    pricing: false,
    staffIntro: false,
    access: false,
    faq: false,
    recruitment: false,
    other: 0,
  },
  blogFeatures: {
    news: false,
    blog: false,
    activityReport: false,
    eventInfo: false,
    other: 0,
  },
  galleryFeatures: {
    portfolio: false,
    products: false,
    testimonials: false,
    staff: false,
    photoGallery: false,
    other: 0,
  },
};

const initialConsultationData: ConsultationData = {
  name: "",
  email: "",
  phone: "",
  existingUrl: "",
  additionalRequests: "",
};

// Legacy function - no longer used
// Price calculation is now handled in utils/priceCalculator.ts

type Screen = "hearing" | "calculating" | "result" | "consultation" | "completion";

function Logo() {
  return (
    <img src="/mitsukaku_logo.svg" alt="ゆるっとミツ確" className="h-20" />
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("hearing");
  const [hearingData, setHearingData] = useState<HearingData>(initialHearingData);
  const [consultationData, setConsultationData] = useState<ConsultationData>(initialConsultationData);

  // 画面遷移時にトップへスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  // sessionStorage persistence
  useEffect(() => {
    const saved = sessionStorage.getItem("hearingData");
    if (saved) {
      try { setHearingData(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("hearingData", JSON.stringify(hearingData));
  }, [hearingData]);

  const handleStartCalculation = useCallback(() => {
    setScreen("calculating");
    setTimeout(() => setScreen("result"), 2000);
  }, []);

  const getProgress = () => {
    switch (screen) {
      case "hearing": return 33;
      case "result": return 66;
      case "consultation": return 85;
      case "completion": return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[60]">
        <div
          className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-700 ease-out"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      <main className="flex-grow p-4 py-12 md:py-20 flex justify-center items-start">
        <div className="max-w-2xl w-full">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Logo />
          </div>

          {screen === "hearing" && (
            <HearingForm
              data={hearingData}
              onUpdate={setHearingData}
              onSubmit={handleStartCalculation}
            />
          )}
          {screen === "calculating" && <CalculatingScreen />}
          {screen === "result" && (
            <ResultScreen
              hearingData={hearingData}
              onBack={() => setScreen("hearing")}
              onNext={() => setScreen("consultation")}
            />
          )}
          {screen === "consultation" && (
            <ConsultationForm
              hearingData={hearingData}
              data={consultationData}
              onUpdate={setConsultationData}
              onBack={() => setScreen("result")}
              onSubmit={() => setScreen("completion")}
            />
          )}
          {screen === "completion" && <CompletionScreen />}
        </div>
      </main>

      <footer className="py-12 text-center bg-white border-t border-border">
        <p className="text-sm text-secondary font-bold">&copy; 2026 studio earth signs</p>
      </footer>
    </div>
  );
}
