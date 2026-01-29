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
  "w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 focus:bg-white focus:border-primary outline-none transition-all text-base font-bold text-secondary placeholder:text-gray-300";

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxQdfR2kDi_JmmkplbRdhhb06NusiDHU8jXnecLpgzBjB1oPbGf-XHiZ7WzYowrJQ5m/exec';

interface EncodedFile {
  name: string;
  data: string;
  mimeType: string;
}

export default function ConsultationForm({ hearingData, data, onUpdate, onBack, onSubmit }: Props) {
  const priceBreakdown = calculatePrice(hearingData);
  const totalPrice = priceBreakdown.subtotal;
  const totalItems = priceBreakdown.additionalPagesCount + priceBreakdown.blogFeaturesCount + priceBreakdown.galleryFeaturesCount;
  const [referenceUrls, setReferenceUrls] = useState(["", "", ""]);
  const [files, setFiles] = useState<EncodedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    existingUrl: false,
    referenceUrls: [false, false, false],
    additionalRequests: false,
  });

  // Validation
  const nameValid = data.name.trim().length >= 2;
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email);
  const existingUrlValid = !data.existingUrl || /^https?:\/\/.+/.test(data.existingUrl);
  const referenceUrlsValid = referenceUrls.every(url => !url || /^https?:\/\/.+/.test(url));
  const additionalRequestsValid = data.additionalRequests.length <= 500;
  const isValid = nameValid && emailValid && existingUrlValid && referenceUrlsValid && additionalRequestsValid;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // 既に5件選択されている場合は追加しない
    if (files.length >= 5) {
      alert('ファイルは最大5件までです');
      e.target.value = "";
      return;
    }

    const newFiles = Array.from(e.target.files);

    // サイズチェック
    const validFiles = newFiles.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`${file.name} は5MBを超えているためアップロードできません`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    console.log('ファイルをエンコード中...', validFiles.length, '件');

    try {
      // ファイルをエンコード（選択時に実行）
      const encodedFiles = await Promise.all(
        validFiles.map(async (file) => {
          console.log(`エンコード開始: ${file.name}`);
          const base64 = await fileToBase64(file);
          console.log(`エンコード完了: ${file.name}, サイズ: ${base64.length}文字`);
          return {
            name: file.name,
            data: base64,
            mimeType: file.type,
          };
        })
      );

      setFiles((prev) => {
        const newList = [...prev, ...encodedFiles].slice(0, 5);
        console.log('ファイル保存完了:', newList.length, '件');
        return newList;
      });
    } catch (error) {
      console.error('ファイルエンコードエラー:', error);
      alert('ファイルの処理中にエラーが発生しました');
    }

    e.target.value = "";
  };

  // ファイルをBase64に変換
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // "data:image/png;base64," の部分を除去
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 送信時に全フィールドをチェック
    setTouched({
      name: true,
      email: true,
      existingUrl: true,
      referenceUrls: [true, true, true],
      additionalRequests: true,
    });

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 送信データを作成（ファイルはすでにエンコード済み）
      const payload = {
        name: data.name,
        email: data.email,
        existingUrl: data.existingUrl,
        referenceUrls: referenceUrls,
        additionalRequests: data.additionalRequests,
        files: files, // すでにエンコード済み
        hearingData: hearingData,
        priceBreakdown: priceBreakdown,
      };

      if (files.length > 0) {
        // ファイルあり: リクエスト送信して2秒後に遷移
        fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }).catch((error) => {
          console.error('送信エラー:', error);
        });

        // 2秒後に完了画面へ遷移
        setTimeout(() => {
          onSubmit();
        }, 2000);

      } else {
        // ファイルなし: 通常通り完了を待つ
        await fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });

        // リクエスト完了後に完了画面へ遷移
        onSubmit();
      }

    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
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
              placeholder="山田太郎"
              className={`${inputClass} ${touched.name && !nameValid ? "border-primary" : ""}`}
              value={data.name}
              onChange={(e) => onUpdate((prev) => ({ ...prev, name: e.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            />
            {touched.name && !nameValid && (
              <p className="text-xs text-primary font-bold ml-1">お名前は2文字以上で入力してください</p>
            )}
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">
              メールアドレス <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className={`${inputClass} ${touched.email && !emailValid ? "border-primary" : ""}`}
              value={data.email}
              onChange={(e) => onUpdate((prev) => ({ ...prev, email: e.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            {touched.email && !emailValid && (
              <p className="text-xs text-primary font-bold ml-1">有効なメールアドレスを入力してください</p>
            )}
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
              className={`${inputClass} ${touched.existingUrl && !existingUrlValid ? "border-primary" : ""}`}
              value={data.existingUrl}
              onChange={(e) => onUpdate((prev) => ({ ...prev, existingUrl: e.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, existingUrl: true }))}
            />
            {touched.existingUrl && !existingUrlValid && (
              <p className="text-xs text-primary font-bold ml-1">有効なURL（https://...）を入力してください</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">
              パンフレット・チラシ {files.length > 0 && `(${files.length}/5)`}
            </label>
            <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-2xl p-5 transition-all ${
              files.length >= 5
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                : 'bg-gray-50 border-gray-200 cursor-pointer hover:border-primary hover:bg-white'
            }`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm font-bold text-gray-400">
                {files.length >= 5 ? 'ファイル上限に達しました' : 'ファイルを選択（複数可）'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
                multiple
                disabled={files.length >= 5}
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
              {referenceUrls.map((url, i) => {
                const urlValid = !url || /^https?:\/\/.+/.test(url);
                return (
                  <div key={i}>
                    <input
                      type="url"
                      placeholder="https://..."
                      className={`${inputClass} ${touched.referenceUrls[i] && !urlValid ? "border-primary" : ""}`}
                      value={url}
                      onChange={(e) => {
                        const next = [...referenceUrls];
                        next[i] = e.target.value;
                        setReferenceUrls(next);
                      }}
                      onBlur={() => {
                        setTouched((prev) => {
                          const newReferenceUrls = [...prev.referenceUrls];
                          newReferenceUrls[i] = true;
                          return { ...prev, referenceUrls: newReferenceUrls };
                        });
                      }}
                    />
                    {touched.referenceUrls[i] && !urlValid && (
                      <p className="text-xs text-primary font-bold ml-1 mt-1">有効なURL（https://...）を入力してください</p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 font-bold ml-1">「こんなサイトにしたい」というイメージに近いサイトのURLなど</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary">追加のご要望</label>
            <textarea
              rows={4}
              placeholder="ご希望の納期や特記事項など、お気軽にご記入ください"
              className={`${inputClass} resize-none ${touched.additionalRequests && !additionalRequestsValid ? "border-primary" : ""}`}
              value={data.additionalRequests}
              onChange={(e) => onUpdate((prev) => ({ ...prev, additionalRequests: e.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, additionalRequests: true }))}
            />
            <div className="flex items-center justify-between ml-1">
              <p className={`text-[10px] font-bold ${touched.additionalRequests && !additionalRequestsValid ? "text-primary" : "text-gray-400"}`}>
                {data.additionalRequests.length}/500文字
              </p>
              {touched.additionalRequests && !additionalRequestsValid && (
                <p className="text-xs text-primary font-bold">500文字以内で入力してください</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 固定ボトムエリア */}
      <div className="sticky bottom-6 z-40 bg-secondary shadow-2xl rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 animate-fadeInUp">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className={`relative w-full md:w-auto px-8 py-5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center ${
            isSubmitting ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          <svg className="absolute left-5 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full md:w-auto flex-1 px-12 py-5 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-white hover:text-secondary active:scale-95'
          }`}
        >
          {isSubmitting && (
            <svg className="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {isSubmitting ? '送信中...' : 'この内容で相談を送信する'}
        </button>
      </div>
    </div>
  );
}
