import { useEffect, useState } from "react"
import React from "react"

const messages = [
  "🎉 10% OFF on your first purchase",
  "🚚 Free shipping on orders above 2000",
  "🌍 Worldwide shipping available",
]

export default function Banner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-black text-white">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {messages.map((text, i) => (
          <div
            key={i}
            className="min-w-full text-center py-2 text-sm"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
