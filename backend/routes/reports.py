from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from datetime import datetime
from bson import ObjectId
import os, shutil, uuid, json
from database import reports_collection
from deps import get_current_user
from services.outbreak import check_outbreak
from services.cloud_storage import upload_image, is_configured

router = APIRouter()

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    if "userId" in doc:
        doc["userId"] = str(doc["userId"])
    return doc

async def save_image(file: UploadFile, contents: bytes) -> str:
    """Upload to Cloudinary if configured, otherwise fall back to local disk."""
    if is_configured():
        try:
            return await upload_image(contents, folder="krishirakshak/reports")
        except Exception as e:
            print(f"⚠️ Cloudinary upload failed, falling back to local disk: {e}")

    # Local disk fallback (for local dev only — not persistent on Render free tier)
    os.makedirs("uploads", exist_ok=True)
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    path = f"uploads/{filename}"
    with open(path, "wb") as f:
        f.write(contents)
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    return f"{base_url}/uploads/{filename}"

@router.post("/reports")
async def create_report(
    file: UploadFile = File(...),
    cropName: str = Form(...),
    diseaseName: str = Form(...),
    confidence: float = Form(...),
    symptoms: str = Form(...),
    treatment: str = Form(...),
    prevention: str = Form(...),
    riskLevel: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    weather: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "Image must be under 10MB")

    image_url = await save_image(file, contents)

    doc = {
        "userId": current_user["_id"],
        "cropName": cropName,
        "diseaseName": diseaseName,
        "confidence": confidence,
        "symptoms": json.loads(symptoms),
        "treatment": json.loads(treatment),
        "prevention": json.loads(prevention),
        "riskLevel": riskLevel,
        "imageUrl": image_url,
        "latitude": latitude,
        "longitude": longitude,
        "weather": json.loads(weather),
        "createdAt": datetime.utcnow()
    }
    result = await reports_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    await check_outbreak(diseaseName, latitude, longitude)

    return serialize(doc)

@router.get("/reports")
async def get_reports(current_user: dict = Depends(get_current_user)):
    cursor = reports_collection.find({"userId": current_user["_id"]}).sort("createdAt", -1)
    return [serialize(r) async for r in cursor]

@router.get("/heatmap")
async def get_heatmap(current_user: dict = Depends(get_current_user)):
    cursor = reports_collection.find({}, {"diseaseName": 1, "cropName": 1, "latitude": 1, "longitude": 1, "riskLevel": 1, "confidence": 1, "createdAt": 1})
    return [serialize(r) async for r in cursor]
