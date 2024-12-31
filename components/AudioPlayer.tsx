'use client'

import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)

  const audioUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/intro_audio-GNyD2UR0hswS61fDIEom53Z3GlPVtW.mp3"

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const playAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true)
        console.log('Audio started playing')
      }).catch(error => {
        console.error('Audio playback failed:', error)
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay prevented. Waiting for user interaction.')
        } else {
          toast({
            title: "Audio Playback Error",
            description: "Unable to play the audio. Please ensure your device supports audio playback.",
            variant: "destructive",
          })
        }
      })
    }

    const handleUserInteraction = () => {
      if (!isPlaying) {
        playAudio()
      }
    }

    // Try to play immediately
    playAudio()

    // Set up event listeners for user interaction
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      audio.pause()
      audio.currentTime = 0
    }
  }, [audioUrl, isPlaying, toast])

  return null
}