'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-950 text-gray-300">
      <motion.h1 
        className="text-4xl font-bold text-orange-500 mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About SafeWalk
      </motion.h1>
      
      <div className="space-y-12">
        <motion.section {...fadeIn}>
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">Project Overview</h2>
          <p>
            SafeWalk is a community-driven platform designed to enhance public safety. 
            By leveraging real-time data and user input, we aim to create safer environments 
            for everyone, especially in urban areas.
          </p>
        </motion.section>
        
        <motion.section {...fadeIn}>
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>SOS Alerts: Instant emergency assistance at your fingertips</li>
            <li>Incident Reporting: Contribute to community awareness</li>
            <li>Safety Ratings: Make informed decisions about your surroundings</li>
            <li>Location Sharing: Stay connected with trusted contacts</li>
          </ul>
        </motion.section>
        
        <motion.section {...fadeIn}>
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">Mission Statement</h2>
          <p className="italic">
            "Empowering communities through technology to create safer, more connected neighborhoods."
          </p>
        </motion.section>
        
        <motion.section {...fadeIn}>
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">How It Works</h2>
          <p>
            Users report incidents, view safety ratings, and access real-time safety tools. 
            This collaborative approach allows for a dynamic, up-to-date safety network that 
            benefits from the collective input of the community.
          </p>
        </motion.section>
        
        <motion.section 
          {...fadeIn}
          className="bg-gray-900 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">Get Involved</h2>
          <p className="mb-4">
            Your feedback and participation are crucial to making our communities safer. 
            Join us in our mission to create a safer world for everyone.
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center text-orange-500 hover:text-orange-400"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Contact Us <ArrowRight className="ml-2 h-4 w-4" />
          </motion.a>
        </motion.section>
      </div>
    </div>
  )
}

