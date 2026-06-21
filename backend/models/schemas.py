from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    createdAt: str

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    windSpeed: float
    condition: str = "Clear"

class ReportOut(BaseModel):
    id: str
    cropName: str
    diseaseName: str
    confidence: float
    symptoms: List[str]
    treatment: List[str]
    prevention: List[str]
    imageUrl: str
    latitude: float
    longitude: float
    riskLevel: str
    weather: Optional[WeatherData]
    createdAt: str

class AlertOut(BaseModel):
    id: str
    diseaseName: str
    affectedArea: str
    cases: int
    riskLevel: str
    latitude: float
    longitude: float
    radius: float
    createdAt: str

class SchemeOut(BaseModel):
    id: str
    schemeId: str
    name: str
    ministry: str
    category: str
    description: str
    eligibility: List[str]
    benefits: List[str]
    requiredDocuments: List[str]
    howToApply: List[str]
    officialLink: str
    helplineNumber: Optional[str]
    state: str
    lastUpdated: str

class CommentOut(BaseModel):
    userId: str
    userName: str
    content: str
    createdAt: str

class CommunityPostOut(BaseModel):
    id: str
    userId: str
    userName: str
    content: str
    imageUrl: Optional[str]
    diseaseTag: Optional[str]
    location: str
    likes: int
    comments: List[CommentOut]
    createdAt: str

class EligibilityRequest(BaseModel):
    landSize: float
    state: str
    cropType: str
    income: float

class AIAskRequest(BaseModel):
    question: str
    history: List[dict] = []

class DashboardOut(BaseModel):
    totalReports: int
    activeAlerts: int
    detectedDiseases: int
    locations: int
    recentReports: List[dict]
    recentAlerts: List[dict]
