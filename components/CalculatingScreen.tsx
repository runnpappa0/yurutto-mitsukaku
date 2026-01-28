export default function CalculatingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
      <svg
        className="w-20 h-20 text-primary mb-12 animate-spin-slow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">お見積もりを</p>
      <p className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">計算しています...</p>
    </div>
  );
}
