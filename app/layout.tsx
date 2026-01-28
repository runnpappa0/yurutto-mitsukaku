import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ゆるっとミツ確 - Web制作自動見積もり",
  description: "営業なし・匿名で、Web制作の確定価格がその場でわかる見積もりシミュレーター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
