import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BRAC University FabLab | Digital Fabrication & Innovation",
    template: "%s | BRACU FabLab",
  },
  description:
    "BRAC University's Fabrication Laboratory — empowering students and researchers with 3D printing, laser cutting, CNC machining, robotics, and digital prototyping. Transform your ideas into reality.",
  keywords: [
    "BRAC University", "FabLab", "Fabrication Laboratory", "3D Printing",
    "Laser Cutting", "CNC Machining", "Robotics", "Prototyping", "Innovation",
    "Digital Fabrication", "Dhaka", "Bangladesh",
  ],
  authors: [{ name: "BRAC University FabLab" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fablab.bracu.ac.bd",
    siteName: "BRACU FabLab",
    title: "BRAC University FabLab",
    description: "Transform Ideas Into Reality — Digital Fabrication, Prototyping, Research and Innovation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased font-sans">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
