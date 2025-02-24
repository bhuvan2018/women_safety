"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./LanguageContext"
import { Menu,X } from "lucide-react"
import ReportSlider from "./ReportSlider"
import SubmittedReportsModal from "./SubmittedReportsModal"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import LoginModal from "./LoginModal"
import { auth } from "@/lib/firebase"
import { logoutUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import type React from "react"
import AdminLoginModal from "./AdminLoginModal"
import SignupModal from "./SignupModal"

export default function Navbar() {
  const { t } = useLanguage()
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isSubmittedReportsOpen, setIsSubmittedReportsOpen] = useState(false)
  const [hasSubmittedReports, setHasSubmittedReports] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedReports = localStorage.getItem("navbarReports")
    setHasSubmittedReports(!!storedReports && JSON.parse(storedReports).length > 0)
    setMounted(true)

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleReportSubmit = () => {
    setHasSubmittedReports(true)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigateHome = () => {
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-8 left-0 right-0 z-50 bg-gray-950 border-b border-border"
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateHome}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-10 h-10 transition-transform hover:scale-110">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consent%20isn't%20tricky-mALm1EyLyR0x4DyhcPVIQIW7qDGWrX.jpeg"
                alt="SafeWalk Logo"
                fill
                className="object-contain rounded-full hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                priority
              />
            </div>
            <motion.span
              className="text-xl md:text-2xl font-bold text-orange-500 hover:text-orange-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              SafeWalk
            </motion.span>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <NavLinks
              t={t}
              hasSubmittedReports={hasSubmittedReports}
              setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
            />
            <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
            <AuthButtons
              user={user}
              handleLogout={handleLogout}
              setIsLoginOpen={setIsLoginOpen}
              setIsSignupOpen={setIsSignupOpen}
              t={t}
            />
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900 overflow-hidden"
        >
          {isMenuOpen && (
            <div className="p-4">
              <NavLinks
                t={t}
                hasSubmittedReports={hasSubmittedReports}
                setIsSubmittedReportsOpen={setIsSubmittedReportsOpen}
                isMobile
              />
              <div className="flex flex-col mt-4 space-y-2">
                <ReportButton setIsReportOpen={setIsReportOpen} t={t} />
                <AuthButtons
                  user={user}
                  handleLogout={handleLogout}
                  setIsLoginOpen={setIsLoginOpen}
                  setIsSignupOpen={setIsSignupOpen}
                  t={t}
                  isMobile
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.nav>
      <ReportSlider isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} onSubmit={handleReportSubmit} />
      <SubmittedReportsModal isOpen={isSubmittedReportsOpen} onClose={() => setIsSubmittedReportsOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />
    </>
  )
}

const NavLinks = ({
  t,
  hasSubmittedReports,
  setIsSubmittedReportsOpen,
  isMobile = false,
}: {
  t: (key: string) => string
  hasSubmittedReports: boolean
  setIsSubmittedReportsOpen: (isOpen: boolean) => void
  isMobile?: boolean
}) => {
  const router = useRouter()
  const linkClass = `relative text-white transition-colors duration-300 
    before:absolute before:inset-0 before:bg-orange-500/20 before:rounded-lg 
    before:scale-x-0 before:opacity-0 before:transition-all hover:before:scale-x-100 
    hover:before:opacity-100 before:origin-left px-3 py-2 rounded-lg 
    hover:text-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]
    ${isMobile ? "block w-full mb-2" : ""}`

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/")
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/" className={linkClass} onClick={handleHomeClick}>
          {t("home")}
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/#community"
          className={linkClass}
          onClick={(e) => {
            e.preventDefault()
            document.querySelector("#community")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {t("community")}
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/emergency-contacts" className={linkClass}>
          {t("emergencyContacts")}
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/safety-zones" className={linkClass}>
          {t("safetyZones")}
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/about" className={linkClass}>
          {t("about")}
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/contact" className={linkClass}>
          {t("contact")}
        </Link>
      </motion.div>
      {hasSubmittedReports && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={() => setIsSubmittedReportsOpen(true)}
            className={`text-white hover:text-orange-500 hover:bg-orange-500/20 transition-all duration-300
              ${isMobile ? "block w-full text-left pl-0" : ""}`}
          >
            {t("submittedReports")}
          </Button>
        </motion.div>
      )}
    </>
  )
}

const ReportButton = ({
  setIsReportOpen,
  t,
}: {
  setIsReportOpen: (isOpen: boolean) => void
  t: (key: string) => string
}) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      variant="outline"
      onClick={() => setIsReportOpen(true)}
      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white
        transition-all duration-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
    >
      {t("report")}
    </Button>
  </motion.div>
)

const AuthButtons = ({
  user,
  handleLogout,
  setIsLoginOpen,
  setIsSignupOpen,
  t,
  isMobile = false,
}: {
  user: any
  handleLogout: () => void
  setIsLoginOpen: (isOpen: boolean) => void
  setIsSignupOpen: (isOpen: boolean) => void
  t: (key: string) => string
  isMobile?: boolean
}) => {
  const buttonClass = isMobile ? "w-full justify-center" : "text-white hover:text-orange-500"

  return user ? (
    <Button onClick={handleLogout} variant="ghost" className={buttonClass}>
      {t("logout")}
    </Button>
  ) : (
    <>
      <Button onClick={() => setIsLoginOpen(true)} variant="ghost" className={buttonClass}>
        {t("login")}
      </Button>
      <Button onClick={() => setIsSignupOpen(true)} variant="ghost" className={buttonClass}>
        {t("signup")}
      </Button>
    </>
  )
}