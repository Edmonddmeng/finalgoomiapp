"use client"

import React from "react"
import { SchoolCard, SchoolData } from "./SchoolCard"

interface SchoolRecommendationsProps {
  schools: SchoolData[]
}

export function SchoolRecommendations({ schools }: SchoolRecommendationsProps) {
  return (
    <div className="my-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Recommended Schools for You
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on your profile, these schools would be excellent matches:
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school, index) => (
          <SchoolCard key={school.id} school={school} index={index} />
        ))}
      </div>
    </div>
  )
}