"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingText, setLoadingText] = useState("Loading")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Loading text animation
    const textTimer = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading"
        return prev + "."
      })
    }, 500)

    // Trigger audio playback
    const audio = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/intro_audio-GNyD2UR0hswS61fDIEom53Z3GlPVtW.mp3",
    )
    audio.play().catch((error) => console.error("Audio playback failed:", error))

    return () => {
      clearTimeout(timer)
      clearInterval(textTimer)
      audio.pause()
      audio.src = ""
    }
  }, [])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      >
        <div className="text-center">
          <motion.div
            className="relative w-32 h-32 mb-8 mx-auto"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consent%20isn't%20tricky-mALm1EyLyR0x4DyhcPVIQIW7qDGWrX.jpeg"
              alt="SafeWalk Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249,115,22,0.2)",
                  "0 0 40px rgba(249,115,22,0.6)",
                  "0 0 20px rgba(249,115,22,0.2)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-white mb-4"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            SafeWalk
          </motion.h2>
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p
              className="text-orange-500 text-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {loadingText}
            </motion.p>
          </motion.div>
          <motion.p
            className="text-gray-400 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Empowering Women's Safety
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

