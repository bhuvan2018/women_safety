"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import EmergencyHelplines from "@/components/EmergencyHelplines"
import AIStats from "@/components/AIStats"
import LocationSharing from "@/components/LocationSharing"
import SafetyZones from "@/components/SafetyZones"
import SafetyChallenges from "@/components/SafetyChallenges"
import CrowdsourcedData from "@/components/CrowdsourcedData"
import Community from "@/components/Community"
import LoadingAnimation from "@/components/LoadingAnimation"
import { useLanguage } from "@/components/LanguageContext"
import AudioPlayer from "@/components/AudioPlayer"
import SafetyRating from "@/components/SafetyRating"
import Image from "next/image"

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.02 } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentDescription, setCurrentDescription] = useState("safeWalkDescription")
  const { t } = useLanguage()
  const [hasSubmittedIncident, setHasSubmittedIncident] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDescription((prev) => (prev === "safeWalkDescription" ? "missionDescription" : "safeWalkDescription"))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleIncidentSubmit = () => {
    setHasSubmittedIncident(true)
  }

  return (
    <>
      <AudioPlayer />
      <LoadingAnimation />
      {isLoaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-950 text-foreground pt-16 md:pt-24"
        >
          <section className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="relative w-full mb-8">
              <div className="absolute inset-0 h-[400px] md:h-[500px] lg:h-[600px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Download%20premium%20image%20of%20Female%20boxer%20putting%20a%20strap%20on%20her%20hand%20by%20Teddy%20about%20hand,%20person,%20sports,%20adult,%20and%20woman%201222505-ZSZooVCKWphGJPH6Xj5PGo7EcdhAgM.jpeg"
                  alt="Strength and Preparation"
                  fill
                  className="object-cover opacity-30"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 pb-8">
                <div className="flex flex-col items-center mb-8 md:mb-16">
                  {/* Top centered text */}
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 md:mb-16"
                  >
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
                      {t("youAreNotAlone")}
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">{t("itIsNotYourFault")}</p>
                  </motion.div>

                  {/* Content container */}
                  <div className="w-full max-w-4xl px-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDescription}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        {/* Centered title */}
                        <motion.h2
                          className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 text-center mb-4 md:mb-6"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {currentDescription === "safeWalkDescription" ? "SafeWalk" : t("ourMission")}
                        </motion.h2>

                        {/* Right-aligned description */}
                        <div className="text-right">
                          <AnimatedText
                            text={t(currentDescription)}
                            className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl ml-auto"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <EmergencyHelplines />

            <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
              <LocationSharing />
              <AIStats />
            </div>

            <div id="community" className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
              <SafetyZones />
              <Community onIncidentSubmit={handleIncidentSubmit} />
            </div>

            <div className="mt-8 md:mt-12">
              <CrowdsourcedData />
            </div>

            <div className="mt-8 md:mt-12">
              <SafetyChallenges onIncidentReportClick={() => {}} hasSubmittedIncident={hasSubmittedIncident} />
            </div>

            <div className="mt-8 md:mt-12">
              <SafetyRating />
            </div>
          </section>
        </motion.main>
      )}
    </>
  )
}