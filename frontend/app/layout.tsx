import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botrip",
  description: "Recomendaciones de viajes y hoteles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="font-playfair text-2xl font-bold text-blue-900">Botrip 📍🗺️</h1>
              <div className="space-x-6">
                <Link href="/hotels" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Hoteles
                </Link>
                <Link href="/packages" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Paquetes
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
