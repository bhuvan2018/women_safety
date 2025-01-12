'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from './LanguageContext'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import ReportSlider from './ReportSlider'
import SubmittedReportsModal from './SubmittedReportsModal'

export default function Navbar() {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isSubmittedReportsOpen, setIsSubmittedReportsOpen] = useState(false)
  const [hasSubmittedReports, setHasSubmittedReports] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedReports = localStorage.getItem('navbarReports')
    setHasSubmittedReports(!!storedReports && JSON.parse(storedReports).length > 0)
    setMounted(true)
  }, [])

  const handleReportSubmit = () => {
    setHasSubmittedReports(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <nav className="fixed top-8 left-0 right-0 z-50 bg-gray-950 border-b border-border">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="flex items-center gap-3">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FF8C42' }} />
                  <stop offset="50%" style={{ stopColor: '#FF5C85' }} />
                  <stop offset="100%" style={{ stopColor: '#FF4291' }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Circle of the female symbol */}
              <circle cx="24" cy="20" r="14" stroke="url(#logoGradient)" strokeWidth="3" fill="none"/>
              {/* Vertical line of the female symbol */}
              <line x1="24" y1="34" x2="24" y2="44" stroke="url(#logoGradient)" strokeWidth="3"/>
              {/* Horizontal line of the female symbol */}
              <line x1="18" y1="39" x2="30" y2="39" stroke="url(#logoGradient)" strokeWidth="3"/>
              {/* Left hand */}
              <path
                d="M20 20C18 18 16 17 14 17.5C16 19 17 21 17 23"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right hand */}
              <path
                d="M28 20C30 18 32 17 34 17.5C32 19 31 21 31 23"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold text-orange-500">SafeWalk</span>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/" className="text-white hover:text-orange-500 transition-colors">
              {t('home')}
            </Link>
            <Link 
              href="/#community" 
              className="text-white hover:text-orange-500 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('community')}
            </Link>
            <Link href="/emergency-contacts" className="text-white hover:text-orange-500 transition-colors">
              {t('emergencyContacts')}
            </Link>
            <Link href="/safety-zones" className="text-white hover:text-orange-500 transition-colors">
              {t('safetyZones')}
            </Link>
            <Link href="/about" className="text-white hover:text-orange-500 transition-colors">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-white hover:text-orange-500 transition-colors">
              {t('contact')}
            </Link>
            {hasSubmittedReports && (
              <Button
                variant="ghost"
                onClick={() => setIsSubmittedReportsOpen(true)}
                className="text-white hover:text-orange-500 transition-colors"
              >
                {t('submittedReports')}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsReportOpen(true)}
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              {t('report')}
            </Button>
          </div>
        </div>
      </nav>
      <ReportSlider isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} onSubmit={handleReportSubmit} />
      <SubmittedReportsModal isOpen={isSubmittedReportsOpen} onClose={() => setIsSubmittedReportsOpen(false)} />
    </>
  )
}