import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Read It To Me - Text to Speech",
  description: "Convert any text to speech using OpenAI's voices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

