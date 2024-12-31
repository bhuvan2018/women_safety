'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Rating {
  id: number
  location: string
  rating: number
  comment: string
}

export default function SafetyRating() {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const storedRatings = localStorage.getItem('safetyRatings')
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location && rating) {
      const newRating: Rating = {
        id: Date.now(),
        location,
        rating,
        comment
      }
      const updatedRatings = [...ratings, newRating]
      setRatings(updatedRatings)
      localStorage.setItem('safetyRatings', JSON.stringify(updatedRatings))
      setLocation('')
      setRating(0)
      setComment('')
      toast({
        title: "Rating Submitted",
        description: "Thank you for contributing to community safety!",
      })
    }
  }

  const getAverageRating = (location: string) => {
    const locationRatings = ratings.filter(r => r.location.toLowerCase() === location.toLowerCase())
    if (locationRatings.length === 0) return 0
    const sum = locationRatings.reduce((acc, curr) => acc + curr.rating, 0)
    return sum / locationRatings.length
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Safety Rating System</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-800 text-white border-gray-700"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              ★
            </motion.button>
          ))}
        </div>
        <div>
          <Textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Submit Rating
        </Button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Ratings</h3>
        {ratings.slice(-5).reverse().map((rating) => (
          <motion.div
            key={rating.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-lg mb-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{rating.location}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating.rating ? 'text-yellow-500' : 'text-gray-400'}`}
                    fill={star <= rating.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            {rating.comment && (
              <p className="text-gray-400 mt-2">{rating.comment}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-white">Location Safety Averages</h3>
        {Array.from(new Set(ratings.map(r => r.location))).map((location) => (
          <div key={location} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-2">
            <span className="text-white">{location}</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-yellow-500 font-semibold">{getAverageRating(location).toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

