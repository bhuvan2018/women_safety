"use client"

import { Github, Linkedin, Instagram } from "lucide-react"

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-gray-300">
          We want you to be <span className="text-orange-500 font-semibold">Safe</span>
        </p>
        <div className="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4 text-gray-300 hover:text-orange-500" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4 text-gray-300 hover:text-orange-500" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-4 w-4 text-gray-300 hover:text-orange-500" />
          </a>
        </div>
      </div>
    </div>
  )
}