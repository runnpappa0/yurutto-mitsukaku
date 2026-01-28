export default function CompletionScreen() {
  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-secondary leading-tight">
          送信完了しました！
        </h1>
      </div>

      <div className="bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] rounded-[40px] p-6 md:p-10 border-4 border-white text-center">
        <p className="text-gray-500 leading-relaxed font-bold text-sm">
          この度はご相談いただき、誠にありがとうございます。<br />
          内容を確認の上、ご提案をメールにてお送りいたします。<br />
          今しばらくお待ちくださいませ。
        </p>
      </div>

      <div className="flex justify-center">
        <p className="text-xs text-gray-400 font-bold">このページを閉じて終了してください</p>
      </div>
    </div>
  );
}
