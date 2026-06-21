export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Report {
  _id: string
  cropName: string
  diseaseName: string
  confidence: number
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  imageUrl: string
  latitude: number
  longitude: number
  weather: Weather
  riskLevel: 'Low' | 'Medium' | 'High'
  createdAt: string
  userId: string
}

export interface Weather {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
}

export interface Alert {
  _id: string
  diseaseName: string
  affectedArea: string
  cases: number
  riskLevel: 'Low' | 'Medium' | 'High'
  latitude: number
  longitude: number
  radius: number
  createdAt: string
}

export interface CommunityPost {
  _id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  diseaseTag?: string
  location: string
  likes: number
  likedBy?: string[]
  comments: Comment[]
  createdAt: string
}

export interface Comment {
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface Scheme {
  _id: string
  schemeId: string
  name: string
  ministry: string
  category: string
  description: string
  eligibility: string[]
  benefits: string[]
  requiredDocuments: string[]
  howToApply: string[]
  officialLink: string
  helplineNumber: string
  state: string
  lastUpdated: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export interface DashboardData {
  totalReports: number
  activeAlerts: number
  detectedDiseases: number
  locations: number
  recentReports: Report[]
  recentAlerts: Alert[]
}