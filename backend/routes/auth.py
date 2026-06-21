from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId
import os
from database import users_collection

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "krishirakshak-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "createdAt": user.get("createdAt", datetime.utcnow()).isoformat()
    }

@router.post("/register")
async def register(req: RegisterRequest):
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(req.password)
    user_doc = {
        "name": req.name,
        "email": req.email,
        "password": hashed,
        "createdAt": datetime.utcnow()
    }
    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    token = create_token({"sub": str(result.inserted_id), "email": req.email})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user_doc)}

@router.post("/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user or not pwd_context.verify(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token({"sub": str(user["_id"]), "email": req.email})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user)}
