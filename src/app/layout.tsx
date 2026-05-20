import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Lie Detector — We Know You're Lying",
  description:
    "AI-powered resume analysis that generates aggressive interview questions to verify your claims. Paste your resume. Face the truth.",
  keywords: ["resume", "interview", "AI", "lie detector", "skill verification"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0a0a0a] font-sans text-white selection:bg-red-500/30">
        <Providers>
          <Navbar />
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
