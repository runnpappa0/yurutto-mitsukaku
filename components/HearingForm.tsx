"use client";

import { Dispatch, SetStateAction, useState } from "react";
import type { HearingData } from "@/app/page";
import { initialHearingData } from "@/app/page";
import { calculatePrice } from "@/utils/priceCalculator";

const OBJECTIVES = [
  { label: "会社・事業の紹介" },
  { label: "商品・サービスの紹介" },
  { label: "店舗・サロンの紹介" },
  { label: "採用・求人" },
  { label: "ポートフォリオ" },
  { label: "キャンペーン・告知" },
];

const INDUSTRIES = [
  "福祉・介護", "NPO・団体", "教室・スクール", "個人事業",
  "飲食店・カフェ", "美容室・サロン", "クリニック", "士業",
  "小売店", "コンサル", "IT・Web", "ペット", "その他",
];

const DESIGN_STYLES = [
  { label: "シンプル・すっきり" },
  { label: "信頼感・堅実" },
  { label: "あたたかみ・やさしい" },
  { label: "クール・スタイリッシュ" },
  { label: "ナチュラル・親しみやすい" },
  { label: "高級感・洗練" },
  { label: "ポップ・にぎやか" },
];

const PAGES = [
  { key: "topPage", label: "トップページ", disabled: true },
  { key: "contactForm", label: "お問い合わせ", disabled: false },
  { key: "companyProfile", label: "会社概要", disabled: false },
  { key: "serviceIntro", label: "サービス紹介", disabled: false },
  { key: "productMenu", label: "商品・メニュー", disabled: false },
  { key: "facilityIntro", label: "施設紹介", disabled: false },
  { key: "pricing", label: "料金・プラン", disabled: false },
  { key: "staffIntro", label: "スタッフ紹介（固定表示）", disabled: false },
  { key: "access", label: "アクセス", disabled: false },
  { key: "faq", label: "FAQ・よくある質問", disabled: false },
  { key: "recruitment", label: "採用情報", disabled: false },
];

const BLOG_FEATURES = [
  { key: "news", label: "お知らせ・ニュース" },
  { key: "blog", label: "ブログ・コラム" },
  { key: "activityReport", label: "活動報告" },
  { key: "eventInfo", label: "イベント情報" },
];

const GALLERY_FEATURES = [
  { key: "portfolio", label: "実績・事例紹介" },
  { key: "products", label: "商品紹介" },
  { key: "testimonials", label: "お客様の声" },
  { key: "staff", label: "スタッフ紹介（複数名を管理・更新）" },
  { key: "photoGallery", label: "フォトギャラリー" },
];

interface Props {
  data: HearingData;
  onUpdate: Dispatch<SetStateAction<HearingData>>;
  onSubmit: () => void;
}

export default function HearingForm({ data, onUpdate, onSubmit }: Props) {
  const [touched, setTouched] = useState(false);

  const handlePageToggle = (key: string) => {
    onUpdate((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [key]: !prev.pages[key as keyof typeof prev.pages],
      },
    }));
  };

  const handleBlogFeatureToggle = (key: string) => {
    onUpdate((prev) => ({
      ...prev,
      blogFeatures: {
        ...prev.blogFeatures,
        [key]: !prev.blogFeatures[key as keyof typeof prev.blogFeatures],
      },
    }));
  };

  const handleGalleryFeatureToggle = (key: string) => {
    onUpdate((prev) => ({
      ...prev,
      galleryFeatures: {
        ...prev.galleryFeatures,
        [key]: !prev.galleryFeatures[key as keyof typeof prev.galleryFeatures],
      },
    }));
  };

  const industryDetailValid = data.industry !== "その他" || data.industryDetail.trim().length > 0;

  // At least topPage should be selected (always true by default)
  const hasPages = data.pages.topPage;

  const isFormValid =
    data.objective &&
    data.industry &&
    industryDetailValid &&
    data.designStyle &&
    hasPages;

  const priceBreakdown = calculatePrice(data);

  // Count total selected items
  const selectedItemsCount =
    // Pages
    (data.pages.topPage ? 1 : 0) +
    (data.pages.contactForm ? 1 : 0) +
    (data.pages.companyProfile ? 1 : 0) +
    (data.pages.serviceIntro ? 1 : 0) +
    (data.pages.productMenu ? 1 : 0) +
    (data.pages.facilityIntro ? 1 : 0) +
    (data.pages.pricing ? 1 : 0) +
    (data.pages.staffIntro ? 1 : 0) +
    (data.pages.access ? 1 : 0) +
    (data.pages.faq ? 1 : 0) +
    (data.pages.recruitment ? 1 : 0) +
    data.pages.other +
    // Blog features
    (data.blogFeatures.news ? 1 : 0) +
    (data.blogFeatures.blog ? 1 : 0) +
    (data.blogFeatures.activityReport ? 1 : 0) +
    (data.blogFeatures.eventInfo ? 1 : 0) +
    data.blogFeatures.other +
    // Gallery features
    (data.galleryFeatures.portfolio ? 1 : 0) +
    (data.galleryFeatures.products ? 1 : 0) +
    (data.galleryFeatures.testimonials ? 1 : 0) +
    (data.galleryFeatures.staff ? 1 : 0) +
    (data.galleryFeatures.photoGallery ? 1 : 0) +
    data.galleryFeatures.other;

  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 tracking-tighter text-secondary leading-tight">
          HP制作の見積り、<br />
          メニューを選ぶだけ。
        </h1>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm font-bold tracking-tight">
            匿名でご利用いただけます。
          </p>
          <p className="text-gray-500 text-sm font-bold tracking-tight">
            気に入っていただけましたら、相談依頼へお進みください。
          </p>
        </div>
      </div>

      {/* 01: 制作の目的 */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">01</span>
          <h2 className="text-xl font-bold text-secondary">Webサイトを制作される目的を教えてください</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {OBJECTIVES.map((obj) => (
            <label
              key={obj.label}
              className={`cursor-pointer border-2 rounded-2xl p-6 transition-all duration-200 text-center flex items-center justify-center min-h-[80px] ${
                data.objective === obj.label
                  ? "border-primary bg-primary text-white shadow-[0_20px_40px_-10px_rgba(244,107,94,0.15)]"
                  : "border-white bg-white text-gray-500 hover:border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                checked={data.objective === obj.label}
                onChange={() => onUpdate((prev) => ({ ...prev, objective: obj.label }))}
              />
              <span className="text-xs md:text-sm font-bold tracking-tight leading-snug">{obj.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 02: ターゲット業種 */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">02</span>
          <h2 className="text-xl font-bold text-secondary">該当する業種やジャンルをお選びください</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <label
              key={ind}
              className={`cursor-pointer px-6 py-4 rounded-2xl border-2 font-bold text-xs transition-all duration-200 ${
                data.industry === ind
                  ? "bg-primary border-primary text-white shadow-lg"
                  : "bg-white border-white text-gray-400 hover:border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                checked={data.industry === ind}
                onChange={() => onUpdate((prev) => ({ ...prev, industry: ind, industryDetail: "" }))}
              />
              {ind}
            </label>
          ))}
        </div>

        {/* 業種の詳細入力 */}
        <div className="mt-4">
          <label className="text-xs font-bold text-secondary block mb-2">
            業種の詳細 {data.industry === "その他" && <span className="text-primary">*</span>}
          </label>
          <input
            type="text"
            placeholder={data.industry === "その他" ? "業種を入力してください" : "例: 整骨院、ネイルサロンなど（任意）"}
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-primary outline-none transition-all text-sm text-secondary placeholder:text-gray-300"
            value={data.industryDetail}
            onChange={(e) => onUpdate((prev) => ({ ...prev, industryDetail: e.target.value }))}
          />
        </div>
      </section>

      {/* 03: デザインスタイル */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">03</span>
          <h2 className="text-xl font-bold text-secondary">ご希望のデザインイメージに近いものはどれですか？</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {DESIGN_STYLES.map((style) => (
            <label
              key={style.label}
              className={`cursor-pointer border-2 rounded-2xl p-6 transition-all duration-200 text-center flex items-center justify-center min-h-[80px] ${
                data.designStyle === style.label
                  ? "border-primary bg-primary text-white shadow-lg"
                  : "border-white bg-white text-gray-500 hover:border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]"
              }`}
            >
              <input
                type="radio"
                className="hidden"
                checked={data.designStyle === style.label}
                onChange={() => onUpdate((prev) => ({ ...prev, designStyle: style.label }))}
              />
              <span className="text-xs font-bold tracking-tight leading-snug">{style.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* 04: 必要なページ */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">04</span>
          <h2 className="text-xl font-bold text-secondary">必要なページを選択してください</h2>
        </div>

        <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white">
          <div className="space-y-2 mb-8">
            {PAGES.map((page) => (
              <label
                key={page.key}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                  page.disabled
                    ? "bg-gray-50/50 cursor-default opacity-80"
                    : "hover:bg-gray-50 cursor-pointer group"
                }`}
              >
                <span className={`text-sm font-bold ${page.disabled ? "text-secondary" : "text-gray-500"}`}>
                  {page.label}
                </span>

                {!page.disabled ? (
                  <div
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      data.pages[page.key as keyof typeof data.pages]
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        data.pages[page.key as keyof typeof data.pages]
                          ? "right-1"
                          : "left-1"
                      }`}
                    />
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">選択済み</span>
                )}

                <input
                  type="checkbox"
                  className="hidden"
                  checked={!!data.pages[page.key as keyof typeof data.pages]}
                  onChange={() => handlePageToggle(page.key)}
                  disabled={page.disabled}
                />
              </label>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t-2 border-dashed border-gray-100">
            {/* その他のカウント */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-secondary mb-1">その他のページ数</p>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                  上記以外に必要なページがあれば追加してください
                </p>
              </div>
              <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl">
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      pages: {
                        ...prev.pages,
                        other: Math.max(0, prev.pages.other - 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-10 text-center tabular-nums text-secondary">
                  {data.pages.other}
                </span>
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      pages: {
                        ...prev.pages,
                        other: Math.min(10, prev.pages.other + 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05: お知らせ・ブログ機能 */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">05</span>
          <h2 className="text-xl font-bold text-secondary">お知らせ・ブログ機能が必要ですか？</h2>
        </div>

        <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white">
          <div className="space-y-2 mb-8">
            {BLOG_FEATURES.map((feature) => (
              <label
                key={feature.key}
                className="flex items-center justify-between p-5 rounded-2xl transition-all hover:bg-gray-50 cursor-pointer group"
              >
                <span className="text-sm font-bold text-gray-500">{feature.label}</span>

                <div
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    data.blogFeatures[feature.key as keyof typeof data.blogFeatures]
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      data.blogFeatures[feature.key as keyof typeof data.blogFeatures]
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </div>

                <input
                  type="checkbox"
                  className="hidden"
                  checked={!!data.blogFeatures[feature.key as keyof typeof data.blogFeatures]}
                  onChange={() => handleBlogFeatureToggle(feature.key)}
                />
              </label>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t-2 border-dashed border-gray-100">
            {/* その他のカウント */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-secondary mb-1">その他のブログ機能</p>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                  上記以外に必要な機能があれば追加してください
                </p>
              </div>
              <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl">
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      blogFeatures: {
                        ...prev.blogFeatures,
                        other: Math.max(0, prev.blogFeatures.other - 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-10 text-center tabular-nums text-secondary">
                  {data.blogFeatures.other}
                </span>
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      blogFeatures: {
                        ...prev.blogFeatures,
                        other: Math.min(10, prev.blogFeatures.other + 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06: 実績・ギャラリー機能 */}
      <section className="space-y-6 pb-24">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">06</span>
          <h2 className="text-xl font-bold text-secondary">実績・ギャラリー機能が必要ですか？</h2>
        </div>

        <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white">
          <div className="space-y-2 mb-8">
            {GALLERY_FEATURES.map((feature) => (
              <label
                key={feature.key}
                className="flex items-center justify-between p-5 rounded-2xl transition-all hover:bg-gray-50 cursor-pointer group"
              >
                <span className="text-sm font-bold text-gray-500">{feature.label}</span>

                <div
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    data.galleryFeatures[feature.key as keyof typeof data.galleryFeatures]
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      data.galleryFeatures[feature.key as keyof typeof data.galleryFeatures]
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </div>

                <input
                  type="checkbox"
                  className="hidden"
                  checked={!!data.galleryFeatures[feature.key as keyof typeof data.galleryFeatures]}
                  onChange={() => handleGalleryFeatureToggle(feature.key)}
                />
              </label>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t-2 border-dashed border-gray-100">
            {/* その他のカウント */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-secondary mb-1">その他のギャラリー機能</p>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                  上記以外に必要な機能があれば追加してください
                </p>
              </div>
              <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl">
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      galleryFeatures: {
                        ...prev.galleryFeatures,
                        other: Math.max(0, prev.galleryFeatures.other - 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-10 text-center tabular-nums text-secondary">
                  {data.galleryFeatures.other}
                </span>
                <button
                  onClick={() =>
                    onUpdate((prev) => ({
                      ...prev,
                      galleryFeatures: {
                        ...prev.galleryFeatures,
                        other: Math.min(10, prev.galleryFeatures.other + 1),
                      },
                    }))
                  }
                  className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-all font-bold text-xl"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 固定ボトムエリア */}
      <div className="sticky bottom-6 z-40 bg-secondary shadow-2xl rounded-[32px] p-4 md:p-6 md:p-8 flex flex-col md:flex-row items-center gap-3 md:gap-6 animate-fadeInUp">
        {/* スマホ: 横並び、デスクトップ: 縦並び with flex-grow */}
        <div className="flex md:flex-grow items-center gap-2 md:gap-6">
          <div className="flex flex-row md:flex-col items-center md:items-center justify-center gap-2 md:gap-0">
            <span className="text-[10px] text-white/40 font-bold tracking-widest md:mb-1">選択済みページ数</span>
            <span className="text-2xl md:text-4xl font-bold text-white leading-none">{selectedItemsCount}</span>
          </div>
        </div>

        {/* ボタン: スマホは横並び、デスクトップも横並び */}
        <div className="flex w-full md:w-auto gap-2 md:gap-4">
          <button
            onClick={() => {
              onUpdate(initialHearingData);
              setTouched(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full md:w-auto px-4 md:px-8 py-4 md:py-5 rounded-2xl text-xs md:text-sm font-bold transition-all bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center gap-1 md:gap-2"
          >
            <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            入力リセット
          </button>

          <button
            onClick={() => {
              setTouched(true);
              if (isFormValid) onSubmit();
            }}
            className={`w-full md:w-auto md:px-12 px-6 py-4 md:py-5 rounded-2xl text-xs md:text-sm font-bold transition-all shadow-lg ${
              isFormValid
                ? "bg-primary text-white hover:bg-white hover:text-secondary active:scale-95"
                : "bg-white/10 text-white/20 cursor-not-allowed"
            }`}
          >
            この内容でお見積もりを算出する
          </button>
        </div>
      </div>

      {touched && !isFormValid && (
        <div className="text-center text-xs font-bold text-primary animate-pulse">
          ※ 全ての項目を選択してください
        </div>
      )}
    </div>
  );
}
