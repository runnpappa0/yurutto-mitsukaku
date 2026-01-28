"use client";

import { useState } from "react";
import type { HearingData } from "@/app/page";
import { calculatePrice } from "@/utils/priceCalculator";

interface Props {
  hearingData: HearingData;
  onBack: () => void;
  onNext: () => void;
}

export default function ResultScreen({ hearingData, onBack, onNext }: Props) {
  const breakdown = calculatePrice(hearingData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get selected pages
  const selectedPages: string[] = [];
  if (hearingData.pages.topPage) selectedPages.push("トップページ");
  if (hearingData.pages.contactForm) selectedPages.push("お問い合わせ");
  if (hearingData.pages.companyProfile) selectedPages.push("会社概要");
  if (hearingData.pages.serviceIntro) selectedPages.push("サービス紹介");
  if (hearingData.pages.productMenu) selectedPages.push("商品・メニュー");
  if (hearingData.pages.facilityIntro) selectedPages.push("施設紹介");
  if (hearingData.pages.pricing) selectedPages.push("料金・プラン");
  if (hearingData.pages.staffIntro) selectedPages.push("スタッフ紹介");
  if (hearingData.pages.access) selectedPages.push("アクセス");
  if (hearingData.pages.faq) selectedPages.push("FAQ・よくある質問");
  if (hearingData.pages.recruitment) selectedPages.push("採用情報");
  if (hearingData.pages.other > 0) selectedPages.push(`その他 (${hearingData.pages.other}ページ)`);

  // Get selected blog features
  const selectedBlogFeatures: string[] = [];
  if (hearingData.blogFeatures.news) selectedBlogFeatures.push("お知らせ・ニュース");
  if (hearingData.blogFeatures.blog) selectedBlogFeatures.push("ブログ・コラム");
  if (hearingData.blogFeatures.activityReport) selectedBlogFeatures.push("活動報告");
  if (hearingData.blogFeatures.eventInfo) selectedBlogFeatures.push("イベント情報");
  if (hearingData.blogFeatures.other > 0) selectedBlogFeatures.push(`その他 (${hearingData.blogFeatures.other}種類)`);

  // Get selected gallery features
  const selectedGalleryFeatures: string[] = [];
  if (hearingData.galleryFeatures.portfolio) selectedGalleryFeatures.push("実績・事例紹介");
  if (hearingData.galleryFeatures.products) selectedGalleryFeatures.push("商品紹介");
  if (hearingData.galleryFeatures.testimonials) selectedGalleryFeatures.push("お客様の声");
  if (hearingData.galleryFeatures.staff) selectedGalleryFeatures.push("スタッフ紹介");
  if (hearingData.galleryFeatures.photoGallery) selectedGalleryFeatures.push("フォトギャラリー");
  if (hearingData.galleryFeatures.other > 0) selectedGalleryFeatures.push(`その他 (${hearingData.galleryFeatures.other}種類)`);

  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-secondary leading-tight">
          お見積もり結果
        </h1>
      </div>

      {/* 価格表示 */}
      <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white text-center">
        <p className="text-sm font-bold text-gray-400 mb-2">━━━━━━━━━━━━━━━━━━━━</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-sm font-bold text-gray-400">制作費総額</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
            aria-label="料金に含まれるものを見る"
          >
            ?
          </button>
        </div>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold text-primary mr-1">¥</span>
          <span className="text-5xl md:text-7xl font-bold text-secondary tabular-nums tracking-tighter">
            {breakdown.subtotal.toLocaleString()}
          </span>
        </div>
        <span className="text-xs font-bold text-gray-400 mt-4 block">（税別）</span>
        <p className="text-sm font-bold text-gray-400 mt-4">━━━━━━━━━━━━━━━━━━━━</p>
      </div>

      {/* 選択した項目の詳細 */}
      <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white">
        <div className="grid md:grid-cols-2 gap-10">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-secondary border-b-2 border-dashed border-gray-100 pb-3">
              ご選択いただいた構成
            </h3>

            {/* Selected pages */}
            <div className="space-y-2">
              {selectedPages.map((page, idx) => (
                <div key={idx} className="flex items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-secondary">{page}</span>
                </div>
              ))}
            </div>

            {/* Blog features */}
            {selectedBlogFeatures.length > 0 && (
              <div className="space-y-2 pt-4">
                <p className="text-[10px] font-bold text-gray-400 mb-2">お知らせ・ブログ機能</p>
                {selectedBlogFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center bg-primary/5 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Gallery features */}
            {selectedGalleryFeatures.length > 0 && (
              <div className="space-y-2 pt-4">
                <p className="text-[10px] font-bold text-gray-400 mb-2">実績・ギャラリー機能</p>
                {selectedGalleryFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center bg-primary/5 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-secondary border-b-2 border-dashed border-gray-100 pb-3">
              お見積もりの前提条件
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">目的</label>
                <p className="text-sm font-bold text-secondary">{hearingData.objective}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">業種</label>
                <p className="text-sm font-bold text-secondary">
                  {hearingData.industry}
                  {hearingData.industryDetail && ` (${hearingData.industryDetail})`}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">デザイン</label>
                <p className="text-sm font-bold text-secondary">{hearingData.designStyle}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-1 text-xs text-gray-400 font-bold ml-1">
        <p>※まだお申し込みではありません</p>
        <p>※ホスティング費用（ドメイン・サーバーまたはStudioプラン）は別途かかることがあります</p>
      </div>

      {/* 固定ボトムエリア */}
      <div className="sticky bottom-6 z-40 bg-secondary shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 animate-fadeInUp">
        <button
          onClick={onBack}
          className="relative w-full md:w-auto px-8 py-5 rounded-2xl text-sm font-bold transition-all bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center"
        >
          <svg className="absolute left-5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          内容を修正
        </button>
        <button
          onClick={onNext}
          className="w-full md:w-auto flex-1 px-12 py-5 rounded-2xl text-sm font-bold transition-all shadow-lg bg-primary text-white hover:bg-white hover:text-secondary active:scale-95"
        >
          この内容で相談する
        </button>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-[40px] p-6 md:p-10 max-w-3xl w-full max-h-[70vh] md:max-h-[85vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-secondary transition-all flex items-center justify-center font-bold text-xl"
            >
              ×
            </button>

            {/* タイトル */}
            <h2 className="text-2xl font-bold text-secondary mb-6">料金に含まれるもの</h2>

            {/* コンテンツ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">詳細デザイン</h3>
                <p className="text-xs text-gray-600 font-bold">レイアウト設計、文章作成・リライト、写真選定・加工</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">実装</h3>
                <p className="text-xs text-gray-600 font-bold">Studio または WordPress（Swellテーマ）を使用</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">レスポンシブ対応</h3>
                <p className="text-xs text-gray-600 font-bold">PC・タブレット・スマホ対応</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">お問い合わせフォーム</h3>
                <p className="text-xs text-gray-600 font-bold">標準搭載</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">基本的なSEO設定</h3>
                <p className="text-xs text-gray-600 font-bold">タイトル、メタディスクリプション等</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-primary mb-2">修正対応</h3>
                <p className="text-xs text-gray-600 font-bold">制作期間中は回数制限なし</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 md:col-span-2">
                <h3 className="text-xs font-bold text-primary mb-2">納品後サポート</h3>
                <p className="text-xs text-gray-600 font-bold">1ヶ月間の軽微な修正対応</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
