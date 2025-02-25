"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mb-6"
          >
            <p className="text-gray-400 italic text-lg">
              "In a world where women walk with keys between their fingers, we strive to create a future where they can
              walk with confidence in their hearts."
            </p>
          </motion.div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>to protect women by</span>
            <a
              href="https://github.com/bhuvan2018"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-colors hover:scale-105 active:scale-95"
            >
              Bhuvan Shetty
            </a>
          </div>
          <p className="text-gray-600 text-sm mt-2">© {new Date().getFullYear()} SafeWalk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}