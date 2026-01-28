"use client";

import { Dispatch, SetStateAction, useState } from "react";
import type { HearingData, ConsultationData } from "@/app/page";
import { calculatePrice } from "@/utils/priceCalculator";

interface Props {
  hearingData: HearingData;
  data: ConsultationData;
  onUpdate: Dispatch<SetStateAction<ConsultationData>>;
  onBack: () => void;
  onSubmit: () => void;
}

const inputClass =
  "w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-primary outline-none transition-all text-sm font-bold text-secondary placeholder:text-gray-300";

export default function ConsultationForm({ hearingData, data, onUpdate, onBack, onSubmit }: Props) {
  const priceBreakdown = calculatePrice(hearingData);
  const totalPrice = priceBreakdown.subtotal;
  const totalItems = priceBreakdown.additionalPagesCount + priceBreakdown.blogFeaturesCount + priceBreakdown.galleryFeaturesCount;
  const [referenceUrls, setReferenceUrls] = useState(["", "", ""]);
  const [files, setFiles] = useState<File[]>([]);

  const isValid = data.name.trim().length >= 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 tracking-tighter text-secondary leading-tight">
          相談依頼フォーム
        </h1>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-sm font-bold text-gray-400">お見積もり:</span>
          <span className="text-lg font-bold text-primary">¥</span>
          <span className="text-2xl md:text-3xl font-bold text-secondary tabular-nums tracking-tight">
            {totalPrice.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-gray-400">（税別）</span>
        </div>
      </div>

      {/* 必須項目 */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">必須項目</span>
          <h2 className="text-xl font-bold text-secondary">ご連絡先を入力してください</h2>
        </div>

        <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">
              お名前 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="山田 太郎"
              className={inputClass}
              value={data.name}
              onChange={(e) => onUpdate((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">
              メールアドレス <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className={inputClass}
              value={data.email}
              onChange={(e) => onUpdate((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>
      </section>

      {/* 任意項目 */}
      <section className="space-y-6 pb-24">
        <div className="flex flex-col gap-1 ml-1">
          <span className="text-[10px] font-bold text-primary tracking-widest">任意項目</span>
          <h2 className="text-xl font-bold text-secondary">初回提案の精度を上げるための情報です</h2>
          <p className="text-xs text-gray-400 font-bold mt-1">ご記入いただくと、より具体的なご提案が可能になります</p>
        </div>

        <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">既存サイトURL</label>
            <input
              type="url"
              placeholder="https://..."
              className={inputClass}
              value={data.existingUrl}
              onChange={(e) => onUpdate((prev) => ({ ...prev, existingUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">パンフレット・チラシ</label>
            <label className="flex items-center justify-center gap-2 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-primary hover:bg-white transition-all">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm font-bold text-gray-400">ファイルを選択（複数可）</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
                multiple
                onChange={handleFileChange}
              />
            </label>
            {files.length > 0 && (
              <div className="space-y-2 mt-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-xs font-bold text-secondary truncate mr-3">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-gray-300 hover:text-primary transition-colors text-lg font-bold shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-400 font-bold ml-1">PDF, JPG, PNG, PPT（最大5MB／最大5件）</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">参考サイト・お気に入りのサイト</label>
            <div className="space-y-2">
              {referenceUrls.map((url, i) => (
                <input
                  key={i}
                  type="url"
                  placeholder="https://..."
                  className={inputClass}
                  value={url}
                  onChange={(e) => {
                    const next = [...referenceUrls];
                    next[i] = e.target.value;
                    setReferenceUrls(next);
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-bold ml-1">「こんなサイトにしたい」というイメージに近いサイトのURLなど</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">追加のご要望</label>
            <textarea
              rows={4}
              placeholder="ご希望の納期や特記事項など、お気軽にご記入ください"
              className={`${inputClass} resize-none`}
              value={data.additionalRequests}
              onChange={(e) => onUpdate((prev) => ({ ...prev, additionalRequests: e.target.value }))}
            />
            <p className="text-[10px] text-gray-400 font-bold ml-1">500文字以内</p>
          </div>
        </div>
      </section>

      {/* 固定ボトムエリア */}
      <div className="sticky bottom-6 z-40 bg-secondary shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-fadeInUp">
        <button
          onClick={onBack}
          className="relative w-full md:w-auto px-8 py-5 rounded-2xl text-sm font-bold transition-all bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center"
        >
          <svg className="absolute left-5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          戻る
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`w-full md:w-auto flex-1 px-12 py-5 rounded-2xl text-sm font-bold transition-all shadow-lg ${
            isValid
              ? "bg-primary text-white hover:bg-white hover:text-secondary active:scale-95"
              : "bg-white/10 text-white/20 cursor-not-allowed"
          }`}
        >
          この内容で相談を送信する
        </button>
      </div>
    </div>
  );
}
