export type SubjectCategory = 
  | "english" 
  | "math" 
  | "science" 
  | "social_studies" 
  | "art" 
  | "music" 
  | "physical_education" 
  | "foreign_language"
  | "other"

export const subjectCategoryNames: Record<SubjectCategory, string> = {
  english: "English",
  math: "Mathematics",
  science: "Science",
  social_studies: "Social Studies/History",
  art: "Art",
  music: "Music",
  physical_education: "Physical Education",
  foreign_language: "Foreign Languages",
  other: "Other"
}

export const subjectCategoryColors: Record<SubjectCategory, string> = {
  english: "from-blue-500 to-indigo-500",
  math: "from-red-500 to-pink-500",
  science: "from-green-500 to-teal-500",
  social_studies: "from-amber-500 to-orange-500",
  art: "from-purple-500 to-pink-500",
  music: "from-violet-500 to-purple-500",
  physical_education: "from-orange-500 to-red-500",
  foreign_language: "from-cyan-500 to-blue-500",
  other: "from-gray-500 to-slate-500"
}

export const subjectCategoryIcons: Record<SubjectCategory, string> = {
  english: "📚",
  math: "🔢",
  science: "🔬",
  social_studies: "🌍",
  art: "🎨",
  music: "🎵",
  physical_education: "🏃",
  foreign_language: "🗣️",
  other: "📖"
}

// Keywords to categorize subjects
const subjectKeywords: Record<SubjectCategory, string[]> = {
  english: [
    "english", "literature", "writing", "composition", "rhetoric", "poetry", 
    "creative writing", "journalism", "speech", "debate", "reading"
  ],
  math: [
    "math", "mathematics", "algebra", "geometry", "calculus", "statistics", 
    "trigonometry", "precalculus", "pre-calculus", "finite", "linear algebra"
  ],
  science: [
    "science", "biology", "chemistry", "physics", "environmental", "anatomy", 
    "physiology", "geology", "astronomy", "forensics", "lab", "botany", "zoology"
  ],
  social_studies: [
    "history", "government", "economics", "psychology", "sociology", "anthropology", 
    "geography", "civics", "politics", "world history", "us history", "european",
    "social studies", "current events"
  ],
  art: [
    "art", "drawing", "painting", "sculpture", "ceramics", "photography", 
    "graphic design", "visual", "studio art", "portfolio"
  ],
  music: [
    "music", "band", "orchestra", "choir", "chorus", "theory", "appreciation", 
    "jazz", "ensemble", "symphony", "vocal", "instrumental"
  ],
  physical_education: [
    "physical education", "pe", "p.e.", "gym", "health", "fitness", "sports", 
    "athletics", "wellness", "kinesiology"
  ],
  foreign_language: [
    "spanish", "french", "german", "chinese", "mandarin", "japanese", "italian", 
    "latin", "arabic", "russian", "portuguese", "korean", "language", "asl",
    "sign language"
  ],
  other: []
}

export function categorizeSubject(subjectName: string): SubjectCategory {
  const lowerSubject = subjectName.toLowerCase()
  
  for (const [category, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => lowerSubject.includes(keyword))) {
      return category as SubjectCategory
    }
  }
  
  return "other"
}

export function getGradePoint(grade: string): number {
  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  }
  
  return gradePoints[grade] || 0
}