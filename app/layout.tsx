import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "readittome.io - Text to Speech",
  description: "Convert any text or URL to natural-sounding speech using OpenAI's advanced text-to-speech models. 100% open source and client-side.",
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

