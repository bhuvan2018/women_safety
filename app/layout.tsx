"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import TopBar from "@/components/TopBar"
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/components/LanguageContext"
import SOS from "@/components/SOS"
import Chatbot from "@/components/Chatbot"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" />
      </head>
      <body className={`${inter.className} bg-gray-950 pt-20`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <TopBar />
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <div className="fixed bottom-6 left-6 right-6 flex justify-between z-50">
              <Chatbot />
              <SOS />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}