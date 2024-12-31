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
          <Link href="/" className="text-2xl font-bold text-orange-500">
            SafeWalk
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

