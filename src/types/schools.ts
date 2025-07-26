export interface College {
  id: string
  name: string
  city: string
  state: string
  
  // Key stats for browse list
  acceptanceRate: number
  satRange: string
  actRange: string
  gpaRange: string
  bestMajors: string[]
  
  // Detailed information
  description: string
  
  // Rankings
  usNewsRanking: number
  forbesRanking: number
  
  // Admissions
  totalApplicants: number
  totalAdmitted: number
  totalEnrolled: number
  earlyAcceptanceRate: number
  regularAcceptanceRate: number
  
  // Student body
  undergradEnrollment: number
  gradEnrollment: number
  studentFacultyRatio: string
  
  // Costs
  tuition: number
  roomAndBoard: number
  totalCostOfAttendance: number
  averageFinancialAid: number
  percentReceivingAid: number
  
  // Test scores (middle 50%)
  satMath: string
  satEbrw: string
  
  // Programs
  specialPrograms: string[]
  
  // Campus life
  campusSize: number
  housingRequired: boolean
  greekLife: boolean
  
  // Optional user scores (if authenticated)
  userScores?: {
    fitScore: number
    acceptanceRate: number
    reasons: string[]
    calculatedAt: string
    isCalculating: boolean
  }
}

export interface CollegeMatriculation {
  college: string
  percentage: number
}

export interface PrepSchool {
  id: string
  name: string
  city: string
  state: string
  
  // Key stats for browse list
  acceptanceRate: number
  ssatRange: string
  gpaRequirement: string
  bestPrograms: string[]
  
  // Detailed information
  description: string
  
  // School type
  type: string
  grades: string
  isBoarding: boolean
  isDaySchool: boolean
  boardingPercentage: number
  
  // Rankings
  nicheRanking: number
  boardingSchoolReviewRanking: number
  
  // Admissions
  totalApplicants: number
  totalAdmitted: number
  totalEnrolled: number
  averageSsat: number
  
  // Student body
  enrollment: number
  studentTeacherRatio: string
  averageClassSize: number
  internationStudentPercentage: number
  
  // Costs
  boardingTuition: number
  dayTuition: number
  percentOnFinancialAid: number
  averageFinancialAid: number
  
  // College matriculation
  collegeMatriculation: CollegeMatriculation[]
  
  // Special programs
  specialPrograms: string[]
  
  // Campus
  campusSize: number
  athleticTeams: number
  clubs: number
  artsFacilities: string[]
  
  // Notable alumni
  notableAlumni: string[]
  
  // Optional user scores (if authenticated)
  userScores?: {
    fitScore: number
    acceptanceRate: number
    reasons: string[]
    calculatedAt: string
    isCalculating: boolean
  }
}

export interface CollegesResponse {
  colleges: College[]
  total: number
  offset: number
  limit: number
}

export interface PrepSchoolsResponse {
  prepSchools: PrepSchool[]
  total: number
  offset: number
  limit: number
}

export type SchoolType = 'college' | 'prep-school'