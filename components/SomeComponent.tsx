"use client"

import type React from "react"
import { useRef, useEffect } from "react"

const SomeComponent: React.FC = () => {
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (myRef.current) {
      // Do something with the ref
      console.log("Ref is attached")
    }
  }, [])

  return <div ref={myRef}>This is the component</div>
}

export default SomeComponent