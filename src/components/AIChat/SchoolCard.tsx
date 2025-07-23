"use client"

import React from "react"
import { ExternalLink, MapPin, Star, TrendingUp } from "lucide-react"

export interface SchoolData {
  id: string
  name: string
  imageUrl: string
  acceptanceRate: number
  location: string
  type: "Boarding" | "Day" | "Boarding/Day"
  ranking?: number
  websiteUrl: string
}

interface SchoolCardProps {
  school: SchoolData
  index: number
}

export function SchoolCard({ school, index }: SchoolCardProps) {
  return (
    <div
      className="school-card-entrance"
      style={{
        animationDelay: `${index * 150}ms`
      }}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
        {/* Gradient overlay for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500 z-10" />
        
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={school.imageUrl}
            alt={school.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Ranking badge */}
          {school.ranking && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 animate-badge-pop">
              <Star size={14} fill="currentColor" />
              #{school.ranking}
            </div>
          )}
          
          {/* School name overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{school.name}</h3>
            <div className="flex items-center gap-1 text-white/90 text-sm">
              <MapPin size={14} />
              <span>{school.location}</span>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-5 relative z-20">
          {/* Key stats */}
          <div className="mb-4">
            <div className="stat-card bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-medium">Acceptance Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {school.acceptanceRate}%
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  {school.type}
                </span>
              </div>
            </div>
          </div>
          
          {/* Visit button */}
          <a
            href={school.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            Visit School Website
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}