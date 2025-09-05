
import React, { useState, useEffect } from 'react';
import HomeImage from "../auth/HeroImage.png";
import GUBAAccessControlSystemBanner from "../auth/GUBAAccessControlSystemBanner.png";
import hom from "../auth/hom.png"

const slides = [
  {
    id: 1,
    title: 'Centralized Access Control',
    description:
      'Manage roles and permissions across all your applications in one place.',
    image: HomeImage, // replace with your image path
  },
  {
    id: 2,
    title: 'Granular Role Management',
    description:
      'Assign precise access levels to users based on their responsibilities.',
    image:  GUBAAccessControlSystemBanner
  },
  {
    id: 3,
    title: 'Secure & Scalable',
    description:
      'Ensure enterprise-grade security while scaling with your organization.',
    image:hom,
  },
]

export default function RBACSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-4/5 text-center text-white transition-all">
      <img
        src={slides[current].image}
        alt={slides[current].title}
        className="mx-auto mb-6 max-h-56 object-contain"
      />
      <h1 className="text-3xl font-bold mb-3">{slides[current].title}</h1>
      <p className="text-lg opacity-90">{slides[current].description}</p>

      {/* indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full ${
              idx === current ? 'bg-white' : 'bg-white/40'
            }`}
          ></span>
        ))}
      </div>

      {/* navigation arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 text-2xl"
      >
        ‹
      </button>
      <button
        onClick={() =>
          setCurrent((prev) => (prev + 1) % slides.length)
        }
        className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 text-2xl"
      >
        ›
      </button>
    </div>
  )
}

